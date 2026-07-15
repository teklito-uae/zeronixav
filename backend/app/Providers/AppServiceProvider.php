<?php
namespace App\Providers;

use App\Services\BrainService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register BrainService as a singleton so config is cached once per request lifecycle
        $this->app->singleton(BrainService::class, fn () => new BrainService());
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fix MySQL/MariaDB error 1071 (max index length 1000 bytes for utf8mb4)
        Schema::defaultStringLength(191);
    }
}
