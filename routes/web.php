<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// https://github.com/404labfr/laravel-impersonate?tab=readme-ov-file#rationale
Route::impersonate();

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('samples', function () {
    return Inertia::render('samples/index');
})->name('samples');

require __DIR__.'/settings.php';
require __DIR__.'/todos.php';
require __DIR__.'/auth.php';
