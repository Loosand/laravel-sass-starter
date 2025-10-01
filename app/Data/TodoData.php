<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/** @typescript */
#[TypeScript]
class TodoData extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public ?string $description,
        public string $status,
        public string $category,
        public ?string $due_date,
        public string $created_at,
        public string $updated_at,
    ) {
    }
}
