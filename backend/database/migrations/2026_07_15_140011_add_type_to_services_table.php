<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // 'solution' = core service categories (existing homepage carousels).
            // 'space_type' = room/space-type grid on the homepage (Conference Rooms, Huddle Space, etc).
            $table->string('type')->default('solution')->after('slug');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
