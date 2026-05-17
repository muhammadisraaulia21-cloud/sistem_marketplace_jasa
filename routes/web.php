<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\OrderController;  // [BARU]
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])
        ->name('invitations.accept');
});

require __DIR__.'/settings.php';

// ─── Rute Jasa (Services) ─────────────────────────────────────────────────────

// Publik: siapa pun bisa lihat katalog dan detail jasa
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');

Route::middleware('auth')->group(function () {
    Route::get('/services/create', [ServiceController::class, 'create'])->name('services.create');
    Route::post('/services',       [ServiceController::class, 'store'])->name('services.store');
});

// {service} harus PALING BAWAH di antara GET services
Route::get('/services/{service}',      [ServiceController::class, 'show'])->name('services.show');

Route::middleware('auth')->group(function () {
    Route::get('/services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    Route::put('/services/{service}',      [ServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{service}',   [ServiceController::class, 'destroy'])->name('services.destroy');
});

// ─── Rute Pesanan (Orders) ────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/orders',            [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{service}', [OrderController::class, 'store'])->name('orders.store');
    Route::patch('/orders/{order}',  [OrderController::class, 'update'])->name('orders.update');
});
