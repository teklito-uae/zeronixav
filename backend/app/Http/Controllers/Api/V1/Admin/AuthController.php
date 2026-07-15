<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Admin Portal Login
     * POST /api/v1/admin/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // If no user exists yet in db or demo seeder didn't run yet, auto-create default admin on first attempt if email matches admin@zeronixav.com
        if (!$user && $request->email === 'admin@zeronixav.com') {
            $user = User::create([
                'name' => 'Lead AV Systems Engineer (Admin)',
                'email' => 'admin@zeronixav.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]);
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password credentials for Admin Console.'
            ], 401);
        }

        // Generate Sanctum Bearer Token
        $token = $user->createToken('zeronix-admin-console')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'message' => 'Successfully authenticated with ZeroNix AV Admin Portal.'
        ]);
    }

    /**
     * Current Authenticated Admin
     * GET /api/v1/admin/me
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Logout & Revoke Access Token
     * POST /api/v1/admin/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Admin token successfully revoked.'
        ]);
    }
}
