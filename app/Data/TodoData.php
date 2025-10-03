<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\TodoCategory;
use App\Enums\TodoStatus;
use App\Models\Todo;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
class TodoData extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public ?string $description,
        public TodoStatus $status,
        public TodoCategory $category,
        public ?string $due_date,
        public string $created_at,
        public string $updated_at,
    ) {
    }

    public static function fromModel(Todo $todo): self
    {
        return new self(
            id: $todo->id,
            title: $todo->title,
            description: $todo->description,
            status: $todo->status,
            category: $todo->category,
            due_date: $todo->due_date ? $todo->due_date->format('Y-m-d') : null,
            created_at: $todo->created_at->toISOString(),
            updated_at: $todo->updated_at->toISOString(),
        );
    }
}
