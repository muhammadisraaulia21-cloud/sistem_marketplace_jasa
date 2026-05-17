<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'service_id',
        'price_at_order',
        'status',
        'note',
    ];

    // Relasi: Pesanan ini dibuat oleh seorang pembeli (User)
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // Relasi: Pesanan ini merujuk ke sebuah Jasa
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
