<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ai_settings', function (Blueprint $table) {
            $table->id();
            $table->string('provider')->default('openai'); // openai, claude, gemini
            $table->text('api_key_encrypted')->nullable();
            $table->string('model_name')->default('gpt-4o');
            $table->integer('max_tokens')->default(2048);
            $table->decimal('temperature', 3, 2)->default(0.70);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_settings');
    }
};
