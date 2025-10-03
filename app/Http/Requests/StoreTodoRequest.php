<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\TodoCategory;
use App\Enums\TodoStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTodoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::enum(TodoStatus::class)],
            'category' => ['required', Rule::enum(TodoCategory::class)],
            'due_date' => ['nullable', 'date', 'after:today'],
        ];
    }
}
