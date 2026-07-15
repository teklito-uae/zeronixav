<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index();
            $table->enum('role', ['user', 'assistant', 'system']);
            $table->longText('content');
            $table->string('provider_snapshot')->nullable(); // provider used at time of message
            $table->string('model_snapshot')->nullable();    // model used at time of message
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_conversations');
    }
};
