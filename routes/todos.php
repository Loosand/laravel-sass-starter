<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('todos', TodoController::class);
    Route::patch('todos/{todo}/toggle-status', [TodoController::class, 'toggleStatus'])
        ->name('todos.toggle-status');
});
