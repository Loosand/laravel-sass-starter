<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\TodoCategory;
use App\Enums\TodoStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'category',
        'due_date',
        'user_id',
    ];

    protected $casts = [
        'status' => TodoStatus::class,
        'category' => TodoCategory::class,
        'due_date' => 'date',
    ];

    /**
     * Get the user that owns the todo.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
