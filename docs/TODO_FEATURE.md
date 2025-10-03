# Todo Feature Documentation

## Overview

This Laravel application includes a complete Todo management system with CRUD operations, filtering, and a modern React frontend.

## Features

### Backend Features

- ✅ Create new todos
- ✅ Update existing todos
- ✅ Delete todos
- ✅ Toggle todo status (pending → in_progress → completed → pending)
- ✅ Filter todos by status and category
- ✅ Pagination support
- ✅ Data validation with Form Requests
- ✅ Enum-based status and category management

### Frontend Features

- ✅ Modern React UI with Tailwind CSS
- ✅ Create todo modal with form validation
- ✅ Status and category filtering
- ✅ Real-time status toggling with checkboxes
- ✅ Delete confirmation
- ✅ Statistics dashboard
- ✅ Responsive design
- ✅ Empty state handling

## Database Structure

### Todos Table

- `id` - Primary key
- `title` - Todo title (required, max 255 chars)
- `description` - Optional description (max 1000 chars)
- `status` - Enum: pending, in_progress, completed, cancelled
- `category` - Enum: work, personal, study, health, shopping
- `due_date` - Optional due date
- `created_at` - Timestamp
- `updated_at` - Timestamp

## API Endpoints

### Todo Routes

- `GET /todos` - List todos with filtering and pagination
- `POST /todos` - Create new todo
- `PATCH /todos/{todo}` - Update todo
- `DELETE /todos/{todo}` - Delete todo
- `PATCH /todos/{todo}/toggle-status` - Toggle todo status

### Filter Parameters

- `status` - Filter by status (pending, in_progress, completed, cancelled)
- `category` - Filter by category (work, personal, study, health, shopping)

## Usage Instructions

### Setup

1. Run migrations: `php artisan migrate`
2. Seed sample data: `php artisan db:seed`
3. Access the todo list at `/todos` (requires authentication)

### Creating Todos

1. Click "Add Todo" button
2. Fill in the required title and optional description
3. Select a category
4. Click "Create Todo"

### Managing Todos

- **Toggle Status**: Click the checkbox to cycle through statuses
- **Delete**: Click the trash icon and confirm
- **Filter**: Use the status and category dropdowns
- **Clear Filters**: Click "Clear Filters" when filters are active

### Status Flow

- **Pending** → **In Progress** → **Completed** → **Pending** (cycles)

## Code Structure

### Backend

- `app/Models/Todo.php` - Eloquent model
- `app/Http/Controllers/TodoController.php` - Controller with CRUD operations
- `app/Http/Requests/StoreTodoRequest.php` - Create validation
- `app/Http/Requests/UpdateTodoRequest.php` - Update validation
- `app/Data/TodoData.php` - Data transfer object
- `app/Enums/TodoStatus.php` - Status enumeration
- `app/Enums/TodoCategory.php` - Category enumeration
- `database/factories/TodoFactory.php` - Factory for testing/seeding
- `routes/todos.php` - Todo routes

### Frontend

- `resources/js/pages/samples/todos/Index.tsx` - Main todo page
- `resources/js/routes/todos/index.ts` - Generated route helpers
- `resources/js/pages/samples/index.tsx` - Sample pages index

## Customization

### Adding New Categories

1. Update `app/Enums/TodoCategory.php`
2. Update frontend category labels in `Index.tsx`
3. Update seeder if needed

### Adding New Status Types

1. Update `app/Enums/TodoStatus.php`
2. Update frontend status labels and colors in `Index.tsx`
3. Update toggle logic in controller if needed

### Styling

- All styles use Tailwind CSS classes
- Component library: shadcn/ui
- Icons: Lucide React

## Testing

The application includes:

- Form request validation
- Factory for generating test data
- Database seeder with sample todos
- Frontend form validation
- Error handling and user feedback

## Security

- All routes require authentication (`auth` middleware)
- Email verification required (`verified` middleware)
- CSRF protection on all forms
- Input validation and sanitization
- SQL injection prevention through Eloquent ORM
