<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Film;
use App\Models\Order;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Dashboard/Admin/Index', [
            'totalUsers' => User::count(),
            'totalFilms' => Film::count(),
            'totalOrders' => Order::count(),
        ]);
    }

    public function users()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return Inertia::render('Dashboard/Admin/Users', [
            'users' => $users
        ]);
    }

    public function updateUserRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:user,sineas,admin'
        ]);
        
        $user->update(['role' => $validated['role']]);
        
        return back()->with('success', 'Peran pengguna berhasil diperbarui.');
    }

    public function films()
    {
        $films = Film::with('filmmaker')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Dashboard/Admin/Films', [
            'films' => $films
        ]);
    }

    public function toggleFilm(Film $film)
    {
        $film->update([
            'is_published' => !$film->is_published
        ]);
        
        $status = $film->is_published ? 'dipublikasikan' : 'disembunyikan';
        return back()->with('success', "Film berhasil $status.");
    }
    
    public function destroyFilm(Film $film)
    {
        $film->delete();
        return back()->with('success', 'Film berhasil dihapus.');
    }

    public function transactions()
    {
        $transactions = Order::with(['user', 'film'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('Dashboard/Admin/Transactions', [
            'transactions' => $transactions
        ]);
    }
}
