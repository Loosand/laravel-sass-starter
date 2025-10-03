<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('samples')->group(function () {
    Route::resource('todos', TodoController::class)->only(['index', 'store', 'update', 'destroy']);
    
    Route::patch('todos/{todo}/toggle-status', [TodoController::class, 'toggleStatus'])
        ->name('todos.toggle-status');
});
