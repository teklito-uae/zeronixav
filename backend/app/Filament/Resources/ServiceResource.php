<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Filament\Resources\ServiceResource\RelationManagers;
use App\Models\Product;
use App\Models\Service;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';
    protected static ?string $navigationGroup = 'AV Catalog Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()->schema([
                    Forms\Components\Section::make('Service Specification')->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->unique(Service::class, 'slug', ignoreRecord: true),
                        Forms\Components\Select::make('type')
                            ->label('Section')
                            ->options([
                                'solution'   => 'Solution (homepage Bento grid + product carousel)',
                                'space_type' => 'Space Type (homepage room-type grid)',
                            ])
                            ->default('solution')
                            ->required(),
                        Forms\Components\Textarea::make('summary')
                            ->rows(3)
                            ->columnSpanFull()
                            ->helperText('Short excerpt displayed on homepage and service cards.'),
                        Forms\Components\Actions::make([
                            Forms\Components\Actions\Action::make('insertProductCarousel')
                                ->label('Insert Product Carousel Snippet')
                                ->icon('heroicon-o-squares-2x2')
                                ->color('gray')
                                ->modalHeading('Insert Product Carousel')
                                ->modalDescription('Pick products from the catalog. A snippet is appended to the end of the content below — cut and paste it anywhere in the text to control exactly where the carousel appears. No snippet, no carousel.')
                                ->modalSubmitActionLabel('Insert Snippet')
                                ->form([
                                    Forms\Components\Select::make('product_ids')
                                        ->label('Products to feature')
                                        ->multiple()
                                        ->searchable()
                                        ->required()
                                        ->preload()
                                        ->options(fn () => Product::query()->orderBy('title')->limit(100)->pluck('title', 'id'))
                                        ->getSearchResultsUsing(fn (string $search) => Product::query()
                                            ->where('title', 'like', "%{$search}%")
                                            ->orWhere('sku', 'like', "%{$search}%")
                                            ->limit(50)
                                            ->get()
                                            ->mapWithKeys(fn (Product $product) => [$product->id => "{$product->title} ({$product->sku})"])),
                                ])
                                ->action(function (array $data, Forms\Set $set, Forms\Get $get) {
                                    $snippet = '[[products:' . implode(',', $data['product_ids']) . ']]';
                                    $set('content', trim(($get('content') ?? '') . "\n\n{$snippet}\n\n"));
                                }),
                        ])->columnSpanFull(),
                        Forms\Components\MarkdownEditor::make('content')
                            ->required()
                            ->columnSpanFull()
                            ->default(<<<'MD'
### The Challenge

_What's broken in the market today? Describe the pain point in 2-3 sentences._

### The ZeroNix Solution

_What do we build instead, and why does it hold up better? Keep it concrete._

{{PRODUCT_CAROUSEL}}

### How We Work

1. **Assess** — ...
2. **Design** — ...
3. **Install** — ...
4. **Support** — ...
MD)
                            ->helperText('Keep it brief: The Challenge → The ZeroNix Solution → How We Work. A product carousel renders on the live page only where a `[[products:ID,ID]]` snippet appears in this text (the `{{PRODUCT_CAROUSEL}}` placeholder marks a good spot, but the snippet works anywhere — before, after, or between sections). Use the button above to generate one from real catalog items. The "Linked Hardware" tab below is a separate curation list and does not by itself control what is displayed.'),
                    ])->columns(2),
                ])->columnSpan(2),

                Forms\Components\Group::make()->schema([
                    Forms\Components\Section::make('Regional SEO Parameters')->schema([
                        Forms\Components\TextInput::make('seo_title')
                            ->maxLength(255)
                            ->helperText('Recommended: 50-60 characters.'),
                        Forms\Components\Textarea::make('seo_description')
                            ->maxLength(320)
                            ->rows(3)
                            ->helperText('Recommended: 150-160 characters for GCC ranking.'),
                        Forms\Components\TagsInput::make('keywords')
                            ->helperText('SEO keyword pills shown on the service page (e.g. "meeting room AV Dubai").')
                            ->placeholder('Add keyword'),
                    ]),
                ])->columnSpan(1),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('slug')->searchable()->fontFamily('mono'),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => $state === 'space_type' ? 'Space Type' : 'Solution')
                    ->color(fn (string $state) => $state === 'space_type' ? 'info' : 'success'),
                Tables\Columns\TextColumn::make('products_count')->counts('products')->label('Linked Hardware')->badge(),
                Tables\Columns\TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'solution'   => 'Solution',
                        'space_type' => 'Space Type',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ProductsRelationManager::class,
            RelationManagers\FaqsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
