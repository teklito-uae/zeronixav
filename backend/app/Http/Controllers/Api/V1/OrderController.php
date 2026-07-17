<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Place a new order (Cash on Delivery checkout).
     * POST /api/v1/checkout
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'company' => 'nullable|string',
            'country' => 'required|string',
            'address_line1' => 'required|string',
            'address_line2' => 'nullable|string',
            'city' => 'required|string',
            'notes' => 'nullable|string',
            'payment_method' => 'required|string|in:cod',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $lineItems = [];

            foreach ($validated['items'] as $item) {
                // Lock the row to prevent a race with concurrent checkouts decrementing stock.
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->firstOrFail();

                $price = (float) $product->price;
                $quantity = (int) $item['quantity'];
                $lineTotal = $price * $quantity;
                $subtotal += $lineTotal;

                $lineItems[] = [
                    'product_id' => $product->id,
                    'sku' => $product->sku,
                    'title' => $product->title,
                    'price' => $price,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ];

                $product->stock = max(0, $product->stock - $quantity);
                $product->save();
            }

            $order = Order::create([
                'customer_name' => $validated['customer_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'company' => $validated['company'] ?? null,
                'country' => $validated['country'],
                'address_line1' => $validated['address_line1'],
                'address_line2' => $validated['address_line2'] ?? null,
                'city' => $validated['city'],
                'notes' => $validated['notes'] ?? null,
                'payment_method' => 'cod',
                'status' => 'pending',
                'subtotal' => $subtotal,
                'total' => $subtotal,
            ]);

            $order->order_number = 'ZNX-' . str_pad($order->id, 6, '0', STR_PAD_LEFT);
            $order->save();

            foreach ($lineItems as $lineItem) {
                $order->items()->create($lineItem);
            }

            return $order;
        });

        return response()->json(['order' => $order->load('items')], 201);
    }

    /**
     * Look up an order by its order number (guest confirmation lookup).
     * GET /api/v1/orders/{order_number}
     */
    public function show($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->with('items')->firstOrFail();

        return response()->json(['order' => $order]);
    }
}
