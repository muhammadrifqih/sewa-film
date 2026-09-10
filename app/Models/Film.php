<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Film extends Model
{
    use HasFactory;

    protected $fillable = [
        'filmmaker_id',
        'title',
        'slug',
        'description',
        'genre',
        'poster_path',
        'trailer_url',
        'video_path',
        'mux_upload_id',
        'mux_asset_id',
        'mux_playback_id',
        'duration_minutes',
        'rental_price',
        'is_published',
    ];

    protected $casts = [
        'rental_price' => 'decimal:2',
        'is_published' => 'boolean',
        'duration_minutes' => 'integer',
    ];

    public function filmmaker(): BelongsTo
    {
        return $this->belongsTo(Filmmaker::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    protected static function booted()
    {
        static::deleting(function ($film) {
            $auth = [\env('MUX_TOKEN_ID'), \env('MUX_TOKEN_SECRET')];

            if ($film->mux_asset_id) {
                \Illuminate\Support\Facades\Http::withBasicAuth($auth[0], $auth[1])
                    ->delete('https://api.mux.com/video/v1/assets/' . $film->mux_asset_id);
            } else if ($film->mux_upload_id) {
                $uploadRes = \Illuminate\Support\Facades\Http::withBasicAuth($auth[0], $auth[1])
                    ->get('https://api.mux.com/video/v1/uploads/' . $film->mux_upload_id);
                    
                if ($uploadRes->successful() && $assetId = $uploadRes->json('data.asset_id')) {
                    \Illuminate\Support\Facades\Http::withBasicAuth($auth[0], $auth[1])
                        ->delete('https://api.mux.com/video/v1/assets/' . $assetId);
                }
            }
        });
    }
}
