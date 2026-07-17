<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('scrape_items', function (Blueprint $table) {
            $table->string('model_number')->nullable()->after('sku');
            $table->string('source_url')->nullable()->after('model_number');
            $table->string('status_message')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scrape_items', function (Blueprint $table) {
            $table->dropColumn(['model_number', 'source_url', 'status_message']);
        });
    }
};
