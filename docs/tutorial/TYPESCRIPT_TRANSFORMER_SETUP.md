# TypeScript Transformer Setup

This project is configured with Spatie's TypeScript Transformer to automatically generate TypeScript types from PHP classes.

## References

- **GitHub Repository**: [spatie/typescript-transformer](https://github.com/spatie/typescript-transformer)
- **Official Documentation**: [TypeScript Transformer v2](https://spatie.be/docs/typescript-transformer/v2/introduction)

## Usage

### Generating Types

Run the following command to generate TypeScript types:

```bash
php artisan types:generate
```

Or use the npm script:

```bash
npm run types:generate
```

### Creating PHP Classes for Type Generation

#### Data Transfer Objects (DTOs)

Create PHP classes that extend `Spatie\LaravelData\Data` and add the `@typescript` annotation or `#[TypeScript]` attribute:

```php
<?php

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
```

#### Enums

PHP enums are automatically converted to TypeScript types:

```php
<?php

namespace App\Enums;

enum TodoStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}

enum TodoCategory: string
{
    case WORK = 'work';
    case PERSONAL = 'personal';
    case STUDY = 'study';
    case HEALTH = 'health';
    case SHOPPING = 'shopping';
}
```

### Generated Types

Types are generated in `resources/js/types/generated.d.ts` and are automatically imported in `resources/js/types/index.d.ts`.

### Build Integration

The type generation is automatically integrated into the build process:

- `npm run build` - Generates types before building
- `npm run build:ssr` - Generates types before SSR build

## Configuration

The configuration file is located at `config/typescript-transformer.php`. Key settings:

- `auto_discover_types`: Paths to scan for PHP classes (default: `app/`)
- `output_file`: Where to write generated types (default: `resources/js/types/generated.d.ts`)
- `default_type_replacements`: Type mappings (e.g., `DateTime` → `string`)

## Examples

After running `php artisan types:generate`, you can use the generated types in your TypeScript/React code:

```typescript
import { App } from '@/types';

// Use the generated TodoData type
const todo: App.Data.TodoData = {
    id: 1,
    title: 'Complete TypeScript setup',
    description: 'Set up TypeScript transformer for the Laravel project',
    status: 'in_progress',
    category: 'work',
    due_date: '2025-10-15',
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-10-01T00:00:00Z',
};

// Use the generated enum types
const status: App.Enums.TodoStatus = {
    name: 'IN_PROGRESS',
    value: 'in_progress',
};

const category: App.Enums.TodoCategory = {
    name: 'WORK',
    value: 'work',
};
```

## Complete Todo Application Example

This project includes a complete Todo application demonstrating TypeScript Transformer usage:

### Backend Components

- **Model**: `App\Models\Todo` - Eloquent model with enum casting
- **Data Transfer Object**: `App\Data\TodoData` - Spatie Data class with TypeScript generation
- **Enums**: `App\Enums\TodoStatus` and `App\Enums\TodoCategory` - PHP enums
- **Controller**: `App\Http\Controllers\TodoController` - Full CRUD operations
- **Requests**: Form validation classes for store/update operations
- **Factory**: `Database\Factories\TodoFactory` - Test data generation
- **Migration**: Database schema for todos table

### Frontend Integration

Example React component using generated types:

```typescript
// TodoCard.tsx
type TodoData = App.Data.TodoData; // Generated type

interface TodoCardProps {
    todo: TodoData;
    onToggleStatus?: (todo: TodoData) => void;
}

export function TodoCard({ todo, onToggleStatus }: TodoCardProps) {
    // Full type safety with IDE autocomplete
    return (
        <div>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <span>Status: {todo.status}</span>
            <span>Category: {todo.category}</span>
        </div>
    );
}
```

### Available Routes

```php
// Generated routes (require authentication)
GET    /todos           - List todos with filtering
POST   /todos           - Create new todo
GET    /todos/{id}      - Show specific todo
PUT    /todos/{id}      - Update todo
DELETE /todos/{id}      - Delete todo
PATCH  /todos/{id}/toggle-status - Toggle todo status
```

### Testing the Setup

1. Run migrations: `php artisan migrate`
2. Generate test data: `Todo::factory(10)->create()`
3. Generate types: `php artisan types:generate`
4. Use generated types in your React components with full IntelliSense support

### Generated TypeScript Output

The transformer generates the following types:

```typescript
declare namespace App.Data {
    export type TodoData = {
        id: number;
        title: string;
        description: string | null;
        status: string;
        category: string;
        due_date: string | null;
        created_at: string;
        updated_at: string;
    };
}

declare namespace App.Enums {
    export type TodoCategory = {
        name: string;
        value: string;
    };
    export type TodoStatus = {
        name: string;
        value: string;
    };
}
```
