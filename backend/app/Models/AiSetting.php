<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class AiSetting extends Model
{
    protected $fillable = [
        'provider', 'api_key_encrypted', 'model_name',
        'max_tokens', 'temperature', 'is_active',
    ];

    protected $casts = [
        'is_active'   => 'boolean',
        'temperature' => 'decimal:2',
    ];

    /**
     * Mutator: encrypts the API key before storing it.
     * Usage: $setting->api_key = 'sk-...';
     */
    public function setApiKeyAttribute(string $value): void
    {
        $this->attributes['api_key_encrypted'] = Crypt::encryptString($value);
    }

    /**
     * Accessor: decrypts the stored API key on read.
     * Usage: $setting->api_key;
     */
    public function getApiKeyAttribute(): ?string
    {
        if (empty($this->attributes['api_key_encrypted'])) {
            return null;
        }
        return Crypt::decryptString($this->attributes['api_key_encrypted']);
    }

    /**
     * Returns the currently active AI configuration.
     */
    public static function active(): ?self
    {
        return static::where('is_active', true)->latest()->first();
    }
}
