<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Real scraped titles and product-detail-page URLs routinely exceed
        // varchar(191) — widen to TEXT rather than truncating meaningful data.
        DB::statement('ALTER TABLE scrape_items MODIFY title TEXT NOT NULL');
        DB::statement('ALTER TABLE scrape_items MODIFY source_url TEXT NULL');
        DB::statement('ALTER TABLE products MODIFY title TEXT NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE scrape_items MODIFY title VARCHAR(191) NOT NULL');
        DB::statement('ALTER TABLE scrape_items MODIFY source_url VARCHAR(191) NULL');
        DB::statement('ALTER TABLE products MODIFY title VARCHAR(191) NOT NULL');
    }
};
