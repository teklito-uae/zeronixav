<?php
namespace Database\Seeders;

use App\Models\Brand;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User for JWT/Sanctum Portal Login
        User::updateOrCreate(
            ['email' => 'admin@zeronixav.com'],
            [
                'name' => 'Lead AV Systems Engineer (Admin)',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // 2. Seed Core AV Brands
        $brands = [
            ['name' => 'Yealink', 'country' => 'China', 'description' => 'Microsoft Teams Rooms & Zoom Rooms certified conferencing solutions.'],
            ['name' => 'Shure', 'country' => 'USA', 'description' => 'Professional ceiling microphone arrays and Dante acoustic systems.'],
            ['name' => 'Crestron', 'country' => 'USA', 'description' => 'Enterprise control automation, switching, and AV-over-IP distribution.'],
            ['name' => 'Hikvision', 'country' => 'China', 'description' => 'Commercial interactive flat panels, dvLED walls, and CCTV surveillance.'],
            ['name' => 'Samsung', 'country' => 'South Korea', 'description' => 'Commercial 24/7 digital signage panels and MagicINFO SoC ecosystem.'],
            ['name' => 'LG', 'country' => 'South Korea', 'description' => 'Professional interactive IR touch displays and SuperSign CMS.'],
            ['name' => 'Sony', 'country' => 'Japan', 'description' => 'High-lumen laser projectors and broadcast PTZ optical cameras.'],
            ['name' => 'Bose Professional', 'country' => 'USA', 'description' => 'Commercial public address systems and background music ceiling speakers.'],
            ['name' => 'Barco', 'country' => 'Belgium', 'description' => 'ClickShare wireless presentation and collaboration systems.'],
            ['name' => 'Poly', 'country' => 'USA', 'description' => 'Video bars and enterprise acoustic headsets.']
        ];

        foreach ($brands as $b) {
            Brand::updateOrCreate(
                ['slug' => Str::slug($b['name'])],
                [
                    'name' => $b['name'],
                    'country' => $b['country'],
                    'description' => $b['description'],
                    'is_active' => true,
                ]
            );
        }

        // 3. Seed Demo Services & Products
        $this->call(DemoSeeder::class);
    }
}
