<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Order;
use Inertia\Inertia;

class ServiceController extends Controller
{
    // [TIDAK BERUBAH] Tampilkan semua jasa (katalog)
    public function index()
    {
        $services = Service::with('user')->latest()->get();

        return Inertia::render('Services/Index', [
            'services' => $services,
            'auth'     => ['user' => auth()->user()], // ← tambahkan ini
        ]);
    }

    // [TIDAK BERUBAH] Tampilkan form tambah jasa
    public function create()
    {
        return Inertia::render('Services/Create');
    }

    // [TIDAK BERUBAH] Simpan jasa baru ke database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|integer|min:1000',
        ]);

        $validated['user_id'] = auth()->id();
        Service::create($validated);

        return redirect('/services');
    }

    // [BARU] Tampilkan detail satu jasa
    public function show(Service $service)
    {
        $service->load('user');

        // Cek apakah user yang login sudah pernah memesan jasa ini
        $hasOrdered = false;
        if (auth()->check()) {
            $hasOrdered = Order::where('buyer_id', auth()->id())
                ->where('service_id', $service->id)
                ->whereIn('status', ['pending', 'accepted'])
                ->exists();
        }

        return Inertia::render('Services/Show', [
            'service'    => $service,
            'hasOrdered' => $hasOrdered,
        ]);
    }

    // [BARU] Tampilkan form edit jasa
    public function edit(Service $service)
    {
        // Keamanan: hanya pemilik yang bisa membuka halaman edit
        if ($service->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Services/Edit', [
            'service' => $service,
        ]);
    }

    // [BARU] Simpan perubahan data jasa
    public function update(Request $request, Service $service)
    {
        // Keamanan: hanya pemilik yang bisa mengubah datanya
        if ($service->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|integer|min:1000',
        ]);

        $service->update($validated);

        return redirect("/services/{$service->id}");
    }

    // [TIDAK BERUBAH] Hapus jasa
    public function destroy(Service $service)
    {
        if ($service->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus jasa ini.');
        }

        $service->delete();

        return redirect('/services');
    }
    
}
