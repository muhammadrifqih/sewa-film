<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class FilmController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Auto-create filmmaker profile if not exists
        $filmmaker = $user->filmmaker()->firstOrCreate(
            ['user_id' => $user->id],
            ['name' => $user->name]
        );

        $films = $filmmaker->films()
            ->withCount('rentals')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->get();
        $filmIds = $films->pluck('id');

        $totalTickets = \App\Models\Order::whereIn('film_id', $filmIds)
            ->where('payment_status', 'paid')
            ->count();

        $estimatedRevenue = \App\Models\Order::whereIn('film_id', $filmIds)
            ->where('payment_status', 'paid')
            ->sum('amount');

        return Inertia::render('Dashboard/Sineas/Index', [
            'films' => $films,
            'filmmaker' => $filmmaker,
            'totalTickets' => $totalTickets,
            'estimatedRevenue' => $estimatedRevenue
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Sineas/Films/Create');
    }

    public function createMuxUpload()
    {
        $response = \Illuminate\Support\Facades\Http::withBasicAuth(
            env('MUX_TOKEN_ID'),
            env('MUX_TOKEN_SECRET')
        )->post('https://api.mux.com/video/v1/uploads', [
            'new_asset_settings' => [
                'playback_policy' => ['public'],
            ],
            'cors_origin' => '*'
        ]);

        if ($response->successful()) {
            return response()->json($response->json()['data']);
        }

        return response()->json(['error' => 'Failed to create Mux upload', 'details' => $response->body()], 500);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'genre' => 'required|string|max:100',
            'duration_minutes' => 'required|integer|min:1',
            'rental_price' => 'required|numeric|min:0',
            'poster' => 'nullable|image|max:2048', 
            'mux_upload_id' => 'required|string',
        ]);

        $user = $request->user();
        $filmmaker = $user->filmmaker;

        $posterPath = null;
        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $posterPath = Storage::url($path);
        }

        $film = $filmmaker->films()->create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . uniqid(),
            'description' => $request->description,
            'genre' => $request->genre,
            'duration_minutes' => $request->duration_minutes,
            'rental_price' => $request->rental_price,
            'poster_path' => $posterPath,
            'mux_upload_id' => $request->mux_upload_id,
            'is_published' => true,
        ]);

        return redirect()->route('sineas.dashboard')->with('success', 'Film berhasil diunggah dan sedang diproses oleh Mux!');
    }

    public function togglePublish(Request $request, $id)
    {
        $film = $request->user()->filmmaker->films()->findOrFail($id);
        $film->update(['is_published' => !$film->is_published]);

        return back()->with('success', 'Status rilis film berhasil diubah.');
    }

    public function edit(Request $request, $id)
    {
        $film = $request->user()->filmmaker->films()->findOrFail($id);
        return Inertia::render('Dashboard/Sineas/Films/Edit', [
            'film' => $film
        ]);
    }

    public function update(Request $request, $id)
    {
        $film = $request->user()->filmmaker->films()->findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'genre' => 'required|string|max:100',
            'duration_minutes' => 'required|integer|min:1',
            'rental_price' => 'required|numeric|min:0',
            'poster' => 'nullable|image|max:2048', 
        ]);

        $posterPath = $film->poster_path;
        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $posterPath = Storage::url($path);
        }

        $film->update([
            'title' => $request->title,
            'description' => $request->description,
            'genre' => $request->genre,
            'duration_minutes' => $request->duration_minutes,
            'rental_price' => $request->rental_price,
            'poster_path' => $posterPath,
        ]);

        return redirect()->route('sineas.dashboard')->with('success', 'Detail film berhasil diperbarui!');
    }

    public function destroy(Request $request, $id)
    {
        $film = $request->user()->filmmaker->films()->findOrFail($id);
        $film->delete();

        return redirect()->route('sineas.dashboard')->with('success', 'Film berhasil dihapus dari sistem (dan Mux).');
    }
}
