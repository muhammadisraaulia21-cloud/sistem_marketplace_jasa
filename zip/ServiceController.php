<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service; // Memanggil Model Service (M) kita
use Inertia\Inertia; // Memanggil Inertia (jembatan komunikasi Laravel ke React)

class ServiceController extends Controller
{
    // 1. Fungsi untuk menampilkan halaman formulir tambah jasa
    public function create()
    {
        return Inertia::render('Services/Create');
    }

    // 2. Fungsi untuk menerima data dari formulir dan menyimpannya ke database
    public function store(Request $request)
    {
        // Validasi data yang dikirim dari formulir agar aman
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|integer|min:1000',
        ]);

        // Masukkan id user yang sedang login secara otomatis, gabungkan dengan data yang valid
        $validated['user_id'] = auth()->id();

        // Simpan ke database menggunakan Model Service
        Service::create($validated);

        // Setelah berhasil menyimpan, tendang user kembali ke halaman katalog jasa
        return redirect('/services');
    }

    public function index()
    {
        // 1. Ambil semua data jasa dari database
        $services = Service::with('user')->get();

        // 2. Kirim datanya ke tampilan depan (React View)
        return Inertia::render('Services/Index', [
            'services' => $services
        ]);
    }
    // Fungsi untuk menghapus data jasa dari database
    public function destroy(Service $service)
    {
        // Fitur Keamanan: Pastikan user yang login adalah pemilik asli jasa ini
        if ($service->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus jasa ini.');
        }

        // Hapus jasa dari database
        $service->delete();

        // Kembalikan user ke halaman katalog dengan tampilan yang sudah diperbarui
        return redirect('/services');
    }
}

