<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderCrudController extends Controller
{
    const ALLOWED_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    /**
     * Display a listing of all orders.
     */
    public function index(Request $request)
    {
        $query = Order::latest();

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('order_number', 'like', "%{$s}%")
                  ->orWhere('customer_name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        if ($request->has('status') && !empty($request->status) && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        $perPage = min((int) $request->get('per_page', 15), 100);
        $orders = $query->paginate($perPage)->withQueryString();

        return response()->json(JsonResource::collection($orders)->response()->getData());
    }

    /**
     * Display the specified order with its line items.
     */
    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);

        return response()->json(['order' => $order]);
    }

    /**
     * Update the status of the specified order.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', self::ALLOWED_STATUSES),
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Order status updated.',
            'order' => $order->load('items'),
        ]);
    }
}
