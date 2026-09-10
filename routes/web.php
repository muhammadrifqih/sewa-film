<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\WatchController;
use App\Http\Controllers\Dashboard\FilmController as DashboardFilmController;
use App\Models\Film;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $films = Film::with('filmmaker')
        ->withCount('rentals')
        ->withAvg('reviews', 'rating')
        ->where('is_published', true)
        ->latest()
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'films' => $films,
    ]);
})->name('home');

Route::get('/explore', function (\Illuminate\Http\Request $request) {
    $query = Film::with('filmmaker')
        ->withCount('rentals')
        ->withAvg('reviews', 'rating')
        ->where('is_published', true);

    if ($request->has('search')) {
        $search = $request->search;
        $query->where('title', 'like', "%{$search}%")
              ->orWhere('genre', 'like', "%{$search}%");
    }

    if ($request->has('genre')) {
        $query->where('genre', $request->genre);
    }

    // Sort options: latest, popular (rentals), top_rated
    $sort = $request->get('sort', 'latest');
    if ($sort === 'popular') {
        $query->orderByDesc('rentals_count');
    } elseif ($sort === 'top_rated') {
        $query->orderByDesc('reviews_avg_rating');
    } else {
        $query->latest();
    }

    $films = $query->paginate(24)->withQueryString();

    // Get unique genres for the filter UI
    $genres = Film::where('is_published', true)
        ->whereNotNull('genre')
        ->distinct()
        ->pluck('genre');

    return Inertia::render('Explore', [
        'films' => $films,
        'genres' => $genres,
        'filters' => $request->only(['search', 'genre', 'sort'])
    ]);
})->name('explore');

Route::get('/films/{film:slug}', function(Film $film) {
    $film->load(['filmmaker', 'reviews.user' => function($q) { $q->latest(); }]);
    $film->loadAvg('reviews', 'rating');
    $film->loadCount('rentals');
    
    return Inertia::render('Films/Show', [
        'film' => $film,
    ]);
})->name('films.show');

Route::middleware(['auth', 'verified'])->group(function () {

    // Central Dashboard Redirector
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;
        if ($role === 'admin') return redirect()->route('admin.dashboard');
        if ($role === 'sineas') return redirect()->route('sineas.dashboard');
        return redirect()->route('user.dashboard');
    })->name('dashboard');

    // --- ADMIN ROUTES ---
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Dashboard\AdminController::class, 'dashboard'])->name('dashboard');
        
        Route::get('/users', [\App\Http\Controllers\Dashboard\AdminController::class, 'users'])->name('users');
        Route::post('/users/{user}/role', [\App\Http\Controllers\Dashboard\AdminController::class, 'updateUserRole'])->name('users.role');
        
        Route::get('/films', [\App\Http\Controllers\Dashboard\AdminController::class, 'films'])->name('films');
        Route::post('/films/{film}/toggle', [\App\Http\Controllers\Dashboard\AdminController::class, 'toggleFilm'])->name('films.toggle');
        Route::delete('/films/{film}', [\App\Http\Controllers\Dashboard\AdminController::class, 'destroyFilm'])->name('films.destroy');
        
        Route::get('/transactions', [\App\Http\Controllers\Dashboard\AdminController::class, 'transactions'])->name('transactions');
    });

    // --- SINEAS ROUTES ---
    Route::middleware(['role:sineas'])->prefix('sineas')->name('sineas.')->group(function () {
        Route::get('/dashboard', [DashboardFilmController::class, 'index'])->name('dashboard');
        Route::get('/dashboard/films/create', [DashboardFilmController::class, 'create'])->name('films.create');
        Route::post('/dashboard/films/mux-upload', [DashboardFilmController::class, 'createMuxUpload'])->name('films.mux-upload');
        Route::post('/dashboard/films', [DashboardFilmController::class, 'store'])->name('films.store');
        Route::get('/dashboard/films/{id}/edit', [DashboardFilmController::class, 'edit'])->name('films.edit');
        Route::post('/dashboard/films/{id}', [DashboardFilmController::class, 'update'])->name('films.update');
        Route::patch('/dashboard/films/{id}/toggle-publish', [DashboardFilmController::class, 'togglePublish'])->name('films.toggle-publish');
        Route::delete('/dashboard/films/{id}', [DashboardFilmController::class, 'destroy'])->name('films.destroy');
    });

    // --- USER (CONSUMER) ROUTES ---
    Route::middleware(['role:user'])->prefix('user')->name('user.')->group(function () {
        Route::get('/dashboard', function () {
            $rentals = auth()->user()->rentals()->with('film')->where('access_expires_at', '>', now())->get();
            return Inertia::render('Dashboard/User/Index', [
                'rentals' => $rentals
            ]);
        })->name('dashboard');
    });

    Route::get('/favourites', function () {
        $films = auth()->user()->favorites()
            ->with('filmmaker')
            ->withCount('rentals')
            ->withAvg('reviews', 'rating')
            ->paginate(24);
        return Inertia::render('Favourites', [
            'films' => $films
        ]);
    })->name('favourites');

    // Profile Settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // TVOD
    Route::post('/orders/{film:slug}', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order:order_number}', function(\App\Models\Order $order) {
        $order->load('film');
        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    })->name('orders.show');
    Route::post('/films/{film:slug}/review', function (App\Models\Film $film, Illuminate\Http\Request $request) {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);
        
        // Ensure user rented this film
        $hasRented = $film->rentals()->where('user_id', $request->user()->id)->exists();
        if (!$hasRented) {
            return back()->with('error', 'Anda harus menyewa film ini sebelum memberikan ulasan.');
        }
        
        $film->reviews()->updateOrCreate(
            ['user_id' => $request->user()->id],
            ['rating' => $request->rating, 'comment' => $request->comment]
        );
        
        return back()->with('success', 'Terima kasih, ulasan Anda berhasil disimpan!');
    })->name('reviews.store');

    Route::post('/films/{film:slug}/favorite', function (App\Models\Film $film) {
        auth()->user()->favorites()->toggle($film->id);
        return back();
    })->name('films.favorite');

    Route::get('/watch/{film:slug}', [WatchController::class, 'show'])->name('watch.show');
});

// --- KLIKQRIS WEBHOOK ---
Route::post('/webhook/qris', function(\Illuminate\Http\Request $request) {
    // Validasi sederhana (di production gunakan pengecekan signature)
    $orderId = $request->order_id;
    $status = strtoupper($request->status ?? '');

    if ($orderId && ($status === 'PAID' || $status === 'SUCCESS')) {
        $order = \App\Models\Order::where('order_number', $orderId)->first();
        if ($order && $order->payment_status !== 'paid') {
            $order->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
            ]);

            // Beri akses film ke user
            \App\Models\Rental::create([
                'user_id' => $order->user_id,
                'film_id' => $order->film_id,
                'order_id' => $order->id,
                'access_expires_at' => now()->addHours(48),
            ]);
        }
    }

    return response()->json(['status' => 'success']);
})->name('webhook.qris');

require __DIR__.'/auth.php';
