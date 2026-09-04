<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request, Film $film)
    {
        $user = $request->user();

        $hasActiveRental = $user->rentals()
            ->where('film_id', $film->id)
            ->where('access_expires_at', '>', now())
            ->exists();

        if ($hasActiveRental) {
            return redirect()->route('watch.show', $film->slug)
                ->with('info', 'Anda masih memiliki akses untuk menonton film ini.');
        }

        try {
            DB::beginTransaction();

            $orderNumber = 'INV-' . strtoupper(Str::random(10));
            
            $order = Order::create([
                'user_id' => $user->id,
                'film_id' => $film->id,
                'order_number' => $orderNumber,
                'amount' => $film->rental_price,
                'payment_method' => 'qris',
                'payment_status' => 'pending',
            ]);

            // Hit KlikQRIS API (Production / Real)
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'x-api-key' => env('KLIKQRIS_API_KEY', 'SK_PROD_ISI_DENGAN_KEY_ASLI'),
                'id_merchant' => env('KLIKQRIS_MERCHANT_ID', 'ISI_DENGAN_MERCHANT_ID_ASLI'),
                'Content-Type' => 'application/json'
            ])->post(env('KLIKQRIS_API_URL', 'https://klikqris.com/api/qris/create'), [
                'order_id' => $orderNumber,
                'id_merchant' => env('KLIKQRIS_MERCHANT_ID', 'ISI_DENGAN_MERCHANT_ID_ASLI'),
                'amount' => (int) $film->rental_price,
                'keterangan' => 'Sewa Film: ' . $film->title
            ]);

            if ($response->successful() && $response->json('status') == true) {
                $data = $response->json('data');
                $order->update([
                    'total_amount' => $data['total_amount'],
                    'payment_signature' => $data['signature'],
                    'payment_reference' => $data['qris_url'] ?? $data['qris_image'],
                ]);
            } else {
                throw new \Exception('Gagal menghubungi Payment Gateway: ' . $response->body());
            }

            DB::commit();
            
            return redirect()->route('orders.show', $order->order_number)
                ->with('success', 'Pesanan berhasil dibuat. Silakan selesaikan pembayaran.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membuat pesanan: ' . $e->getMessage());
        }
    }
}
