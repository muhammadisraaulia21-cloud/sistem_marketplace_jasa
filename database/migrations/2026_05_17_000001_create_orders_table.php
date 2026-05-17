<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Siapa yang memesan (pembeli)
            $table->foreignId('buyer_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Jasa apa yang dipesan
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->onDelete('cascade');

            // Snapshot harga saat pemesanan (agar harga tidak berubah meski jasa diedit)
            $table->integer('price_at_order');

            // Status pesanan: pending → accepted → completed / cancelled
            $table->enum('status', ['pending', 'accepted', 'completed', 'cancelled'])
                  ->default('pending');

            // Catatan opsional dari pembeli
            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
