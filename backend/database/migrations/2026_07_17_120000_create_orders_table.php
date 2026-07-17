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
        Schema::create('orders', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            // Nullable because it's generated from the auto-increment id right after the
            // initial create() (see OrderController@store) — MySQL unique indexes permit
            // multiple NULLs, so this is safe pre-population.
            $table->string('order_number')->nullable()->unique();
            $table->string('customer_name');
            $table->string('email');
            $table->string('phone');
            $table->string('company')->nullable();
            $table->string('country');
            $table->string('address_line1');
            $table->string('address_line2')->nullable();
            $table->string('city');
            $table->text('notes')->nullable();
            $table->string('payment_method')->default('cod');
            $table->string('status')->default('pending'); // pending, confirmed, processing, shipped, delivered, cancelled
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
