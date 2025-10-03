<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\TodoCategory;
use App\Enums\TodoStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTodoRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (!auth()->check()) {
            return false;
        }

        $todo = $this->route('todo');
        return $todo && $todo->user_id === auth()->id();
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'required', Rule::enum(TodoStatus::class)],
            'category' => ['sometimes', 'required', Rule::enum(TodoCategory::class)],
            'due_date' => ['sometimes', 'nullable', 'date', 'after:today'],
        ];
    }
}
