<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiConversation extends Model
{
    protected $fillable = [
        'session_id', 'role', 'content', 'provider_snapshot', 'model_snapshot',
    ];
}
