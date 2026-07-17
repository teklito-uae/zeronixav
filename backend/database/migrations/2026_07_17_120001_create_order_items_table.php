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
        Schema::create('order_items', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            // NOTE: no ->constrained() here — the `products` table in this environment is
            // MyISAM (see `scrape_items.product_id` for precedent), which cannot be the
            // target of an InnoDB foreign key constraint. Kept as an indexed nullable
            // column only; "nullOnDelete" semantics are enforced at the application level.
            $table->foreignId('product_id')->nullable()->index();
            $table->string('sku');
            // TEXT to match products.title, which was widened past varchar(191) for
            // real scraped titles (see 2026_07_17_100805_widen_title_and_source_url_columns_for_scraper).
            $table->text('title');
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('quantity');
            $table->decimal('line_total', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
