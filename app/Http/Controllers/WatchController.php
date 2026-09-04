<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\Rental;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;

class WatchController extends Controller
{
    public function show(Request $request, Film $film)
    {
        $user = $request->user();
        $canWatch = false;
        $expiresAt = null;

        // 1. Role-based Access Logic
        if ($user->role === 'admin') {
            $canWatch = true;
        } elseif ($user->role === 'sineas' && $film->filmmaker && $film->filmmaker->user_id === $user->id) {
            $canWatch = true;
        } else {
            $activeRental = Rental::where('user_id', $user->id)
                ->where('film_id', $film->id)
                ->where('access_expires_at', '>', now())
                ->first();

            if ($activeRental) {
                $canWatch = true;
                $expiresAt = $activeRental->access_expires_at->toIso8601String();
            }
        }

        if (!$canWatch) {
            return redirect()->route('films.show', $film->slug)
                ->with('error', 'Anda tidak memiliki akses untuk menonton film ini.');
        }

        // 2. Resolve Mux Playback ID Dynamically (Since localhost has no Webhooks)
        if (!$film->mux_playback_id && $film->mux_upload_id) {
            $auth = [\env('MUX_TOKEN_ID'), \env('MUX_TOKEN_SECRET')];
            
            // Check upload status
            $uploadRes = \Illuminate\Support\Facades\Http::withBasicAuth($auth[0], $auth[1])
                ->get('https://api.mux.com/video/v1/uploads/' . $film->mux_upload_id);
                
            if ($uploadRes->successful() && $assetId = $uploadRes->json('data.asset_id')) {
                // Get asset details
                $assetRes = \Illuminate\Support\Facades\Http::withBasicAuth($auth[0], $auth[1])
                    ->get('https://api.mux.com/video/v1/assets/' . $assetId);
                    
                if ($assetRes->successful() && $playbackIds = $assetRes->json('data.playback_ids')) {
                    $film->update([
                        'mux_asset_id' => $assetId,
                        'mux_playback_id' => $playbackIds[0]['id']
                    ]);
                }
            }
        }

        // Standard local fallback stream url
        $streamUrl = $film->video_path ?: '/video-stream-placeholder.mp4';
        
        $userReview = $film->reviews()->where('user_id', $user->id)->first();

        return Inertia::render('Watch/Play', [
            'film' => $film->only(['id', 'title', 'slug', 'description', 'mux_playback_id']),
            'streamUrl' => $streamUrl,
            'expiresAt' => $expiresAt,
            'role' => $user->role,
            'userWatermark' => [
                'id' => $user->id,
                'email' => $user->email,
            ],
            'userReview' => $userReview
        ]);
    }
}
