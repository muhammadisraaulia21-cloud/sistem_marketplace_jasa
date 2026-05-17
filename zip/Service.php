<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Tambahkan baris ini

class Service extends Model
{
    use HasFactory;

    // 1. Fitur Keamanan: Kolom yang boleh diisi
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'price',
    ];

    // 2. Relasi Database: Satu Jasa dimiliki oleh Satu User (Freelancer)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}