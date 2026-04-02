<?php

use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

// Public — no auth required
Route::get('/sources', function () {
    return Inertia::render('Sources');
})->name('sources');
Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
Route::post('/jobs/refresh', [JobController::class, 'refresh'])->name('jobs.refresh');
Route::get('/jobs/{job}', [JobController::class, 'show'])->name('jobs.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
