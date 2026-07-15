<?php
namespace App\Services;

use App\Models\AiConversation;
use App\Models\AiSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class BrainService
{
    private ?AiSetting $config;

    public function __construct()
    {
        $this->config = Cache::remember('ai_active_config', 60, fn () => AiSetting::active());
    }

    /**
     * Return the active AI configuration record.
     */
    public function getConfig(): ?AiSetting
    {
        return $this->config;
    }

    /**
     * Persist a conversation message to the database with provider/model snapshots.
     */
    public function storeMessage(string $sessionId, string $role, string $content): AiConversation
    {
        return AiConversation::create([
            'session_id'        => $sessionId,
            'role'              => $role,
            'content'           => $content,
            'provider_snapshot' => $this->config?->provider,
            'model_snapshot'    => $this->config?->model_name,
        ]);
    }

    /**
     * Retrieve ordered conversation history for a session.
     *
     * @return array<int, array{role: string, content: string}>
     */
    public function getHistory(string $sessionId, int $limit = 20): array
    {
        return AiConversation::where('session_id', $sessionId)
            ->orderBy('created_at')
            ->limit($limit)
            ->get(['role', 'content'])
            ->toArray();
    }

    /**
     * Check whether a valid AI configuration with an API key is present.
     */
    public function isConfigured(): bool
    {
        return $this->config !== null && !empty($this->config->api_key);
    }

    /**
     * Bust the cached AI config — call this after saving/updating AI settings.
     */
    public function invalidateCache(): void
    {
        Cache::forget('ai_active_config');
    }
}
