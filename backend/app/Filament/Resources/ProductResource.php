<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cpu-chip';
    protected static ?string $navigationGroup = 'AV Catalog Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()->schema([
                    Forms\Components\Section::make('Product Identification')->schema([
                        Forms\Components\TextInput::make('sku')
                            ->required()
                            ->unique(Product::class, 'sku', ignoreRecord: true)
                            ->label('SKU Code'),
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->unique(Product::class, 'slug', ignoreRecord: true),
                        Forms\Components\TextInput::make('brand')
                            ->required()
                            ->placeholder('e.g. Yealink, Shure, Crestron, Samsung'),
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->nullable(),
                    ])->columns(2),

                    Forms\Components\Section::make('Description & Media')->schema([
                        Forms\Components\RichEditor::make('description')
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('images')
                            ->multiple()
                            ->directory('products')
                            ->reorderable()
                            ->columnSpanFull(),
                    ]),
                ])->columnSpan(2),

                Forms\Components\Group::make()->schema([
                    Forms\Components\Section::make('Inventory & Pricing')->schema([
                        Forms\Components\TextInput::make('price')
                            ->numeric()
                            ->prefix('AED')
                            ->default(0.00),
                        Forms\Components\TextInput::make('stock')
                            ->numeric()
                            ->default(10),
                    ]),

                    Forms\Components\Section::make('AV Technical Specifications')->schema([
                        Forms\Components\KeyValue::make('tech_specs')
                            ->keyLabel('Attribute (e.g. Resolution, Network)')
                            ->valueLabel('Specification')
                            ->reorderable(),
                    ]),
                ])->columnSpan(1),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('sku')->searchable()->sortable()->label('SKU')->fontFamily('mono'),
                Tables\Columns\TextColumn::make('title')->searchable()->sortable()->limit(40),
                Tables\Columns\TextColumn::make('brand')->searchable()->sortable()->badge()->color('info'),
                Tables\Columns\TextColumn::make('category.name')->sortable()->label('Category'),
                Tables\Columns\TextColumn::make('price')->money('AED')->sortable(),
                Tables\Columns\TextColumn::make('stock')->sortable()->badge()->color(fn (int $state): string => $state > 0 ? 'success' : 'danger'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')->relationship('category', 'name'),
                Tables\Filters\SelectFilter::make('brand')->options(fn () => Product::distinct()->pluck('brand', 'brand')->toArray()),
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
