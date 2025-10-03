<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\TodoCategory;
use App\Enums\TodoStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'category',
        'due_date',
    ];

    protected $casts = [
        'status' => TodoStatus::class,
        'category' => TodoCategory::class,
        'due_date' => 'date',
    ];
}
