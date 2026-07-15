<?php

namespace App\Filament\Pages;

use App\Models\AiSetting;
use App\Services\BrainService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Actions\Action;
use Filament\Notifications\Notification;

class AiSettings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-cpu-chip';
    protected static ?string $navigationGroup = 'AI & System Architecture';
    protected static ?string $navigationLabel = 'AI Brain Configuration';
    protected static ?string $title = 'Centralized AI Brain Configuration';

    protected static string $view = 'filament.pages.ai-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $active = AiSetting::active();
        if ($active) {
            $this->form->fill([
                'provider'    => $active->provider,
                'api_key'     => $active->api_key,
                'model_name'  => $active->model_name,
                'max_tokens'  => $active->max_tokens,
                'temperature' => $active->temperature,
                'is_active'   => $active->is_active,
            ]);
        } else {
            $this->form->fill([
                'provider'    => 'openai',
                'model_name'  => 'gpt-4o',
                'max_tokens'  => 2048,
                'temperature' => 0.70,
                'is_active'   => true,
            ]);
        }
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Centralized LLM & Model Context Protocol (MCP) Brain')
                    ->description('All model switches and API key updates are managed centrally here. Existing conversations preserve their provider snapshot, preventing data loss across transitions.')
                    ->schema([
                        Forms\Components\Select::make('provider')
                            ->label('AI Provider')
                            ->options([
                                'openai' => 'OpenAI (GPT-4o, GPT-4 Turbo)',
                                'claude' => 'Anthropic (Claude 3.5 Sonnet, Claude 3 Opus)',
                                'gemini' => 'Google (Gemini 1.5 Pro, Gemini 1.5 Flash)',
                            ])
                            ->required()
                            ->live()
                            ->afterStateUpdated(function ($state, Forms\Set $set) {
                                if ($state === 'openai') $set('model_name', 'gpt-4o');
                                if ($state === 'claude') $set('model_name', 'claude-3-5-sonnet-20240620');
                                if ($state === 'gemini') $set('model_name', 'gemini-1.5-pro-latest');
                            }),

                        Forms\Components\TextInput::make('model_name')
                            ->label('Exact Model Identifier')
                            ->required()
                            ->helperText('e.g. gpt-4o, claude-3-5-sonnet-20240620, gemini-1.5-pro'),

                        Forms\Components\TextInput::make('api_key')
                            ->label('API Secret Key (Encrypted in MySQL)')
                            ->password()
                            ->revealable()
                            ->required()
                            ->helperText('Your API key is stored securely using Laravel Crypt (AES-256-CBC).'),

                        Forms\Components\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('max_tokens')
                                ->numeric()
                                ->default(2048)
                                ->required(),
                            Forms\Components\TextInput::make('temperature')
                                ->numeric()
                                ->step(0.05)
                                ->default(0.70)
                                ->required(),
                        ]),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Enable AI Brain Engine for Solution Builder & MCP Endpoints')
                            ->default(true),
                    ])->columns(1),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        // Deactivate older configs safely
        AiSetting::where('is_active', true)->update(['is_active' => false]);

        $setting = new AiSetting([
            'provider'    => $data['provider'],
            'model_name'  => $data['model_name'],
            'max_tokens'  => $data['max_tokens'],
            'temperature' => $data['temperature'],
            'is_active'   => $data['is_active'],
        ]);
        
        $setting->api_key = $data['api_key']; // Triggers setApiKeyAttribute for encryption
        $setting->save();

        // Invalidate BrainService cache atomically
        app(BrainService::class)->invalidateCache();

        Notification::make()
            ->title('AI Brain Configuration Saved & Encrypted')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save & Deploy Brain Configuration')
                ->submit('save')
                ->color('primary'),
        ];
    }
}
