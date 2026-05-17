<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Halaman riwayat transaksi: menggabungkan pesanan masuk (seller)
     * dan pesanan keluar (buyer) milik user yang sedang login.
     */
    public function index()
    {
        $userId = auth()->id();

        // Pesanan MASUK: jasa milik user ini yang dipesan orang lain
        $incomingOrders = Order::with(['buyer', 'service'])
            ->whereHas('service', fn($q) => $q->where('user_id', $userId))
            ->latest()
            ->get();

        // Pesanan KELUAR: jasa yang dipesan oleh user ini
        $outgoingOrders = Order::with(['service.user'])
            ->where('buyer_id', $userId)
            ->latest()
            ->get();

        return Inertia::render('Orders/Index', [
            'incomingOrders' => $incomingOrders,
            'outgoingOrders' => $outgoingOrders,
        ]);
    }

    /**
     * Menyimpan pesanan baru.
     * Route: POST /orders/{service}
     */
    public function store(Service $service)
    {
        $userId = auth()->id();

        // Keamanan: pemilik jasa tidak bisa memesan jasanya sendiri
        if ($service->user_id === $userId) {
            return back()->withErrors(['order' => 'Anda tidak bisa memesan jasa milik sendiri.']);
        }

        // Keamanan: cegah pemesanan ganda untuk jasa yang sama
        $alreadyOrdered = Order::where('buyer_id', $userId)
            ->where('service_id', $service->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->exists();

        if ($alreadyOrdered) {
            return back()->withErrors(['order' => 'Anda sudah memiliki pesanan aktif untuk jasa ini.']);
        }

        Order::create([
            'buyer_id'       => $userId,
            'service_id'     => $service->id,
            'price_at_order' => $service->price,
            'status'         => 'pending',
        ]);

        return redirect('/orders');
    }

    /**
     * Seller mengubah status pesanan (accept / complete / cancel).
     * Route: PATCH /orders/{order}
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:accepted,completed,cancelled',
        ]);

        // Keamanan: hanya seller (pemilik jasa) yang bisa mengubah status
        if ($order->service->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        $order->update(['status' => $request->status]);

        return back();
    }
}
