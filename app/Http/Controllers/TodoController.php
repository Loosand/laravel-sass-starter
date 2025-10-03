<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Data\TodoData;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Example controller for the Todo model.
 */
class TodoController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search');

        $todos = Todo::query()
            ->when($search, function ($query, $searchTerm) {
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'like', "%{$searchTerm}%")
                      ->orWhere('description', 'like', "%{$searchTerm}%");
                });
            })
            ->when($request->get('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->get('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('samples/todos/index', [
            'todos' => collect($todos->items())->map(fn($todo) => TodoData::fromModel($todo)),
            'pagination' => [
                'current_page' => $todos->currentPage(),
                'last_page' => $todos->lastPage(),
                'per_page' => $todos->perPage(),
                'total' => $todos->total(),
                'from' => $todos->firstItem(),
                'to' => $todos->lastItem(),
                'has_more_pages' => $todos->hasMorePages(),
                'prev_page_url' => $todos->previousPageUrl(),
                'next_page_url' => $todos->nextPageUrl(),
            ],
            'filters' => $request->only(['status', 'category', 'search']),
        ]);
    }

    public function store(StoreTodoRequest $request)
    {
        Todo::create($request->validated());

        return redirect()->route('todos.index')->with('success', 'Todo created successfully');
    }
    
    public function update(UpdateTodoRequest $request, Todo $todo)
    {
        $todo->update($request->validated());

        return redirect()->route('todos.index')->with('success', 'Todo updated successfully');
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();

        return redirect()->route('todos.index')->with('success', 'Todo deleted successfully');
    }

    public function toggleStatus(Todo $todo)
    {
        $newStatus = match ($todo->status->value) {
            'pending' => 'in_progress',
            'in_progress' => 'completed',
            'completed' => 'pending',
            default => 'pending',
        };

        $todo->update(['status' => $newStatus]);

        return redirect()->route('todos.index')->with('success', 'Todo status updated successfully');
    }
}
