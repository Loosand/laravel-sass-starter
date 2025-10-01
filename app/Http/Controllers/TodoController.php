<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Data\TodoData;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
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
        $todos = Todo::query()
            ->when($request->get('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->get('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Todos/Index', [
            'todos' => TodoData::collect($todos->items()),
            'pagination' => [
                'current_page' => $todos->currentPage(),
                'last_page' => $todos->lastPage(),
                'total' => $todos->total(),
            ],
            'filters' => $request->only(['status', 'category']),
        ]);
    }

    public function show(Todo $todo): Response
    {
        return Inertia::render('Todos/Show', [
            'todo' => TodoData::from($todo),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Todos/Create');
    }

    public function store(StoreTodoRequest $request): JsonResponse
    {
        $todo = Todo::create($request->validated());

        return response()->json([
            'message' => 'Todo created successfully',
            'todo' => TodoData::from($todo),
        ], 201);
    }

    public function edit(Todo $todo): Response
    {
        return Inertia::render('Todos/Edit', [
            'todo' => TodoData::from($todo),
        ]);
    }

    public function update(UpdateTodoRequest $request, Todo $todo): JsonResponse
    {
        $todo->update($request->validated());

        return response()->json([
            'message' => 'Todo updated successfully',
            'todo' => TodoData::from($todo->fresh()),
        ]);
    }

    public function destroy(Todo $todo): JsonResponse
    {
        $todo->delete();

        return response()->json([
            'message' => 'Todo deleted successfully',
        ]);
    }

    public function toggleStatus(Todo $todo): JsonResponse
    {
        $newStatus = match ($todo->status->value) {
            'pending' => 'in_progress',
            'in_progress' => 'completed',
            'completed' => 'pending',
            default => 'pending',
        };

        $todo->update(['status' => $newStatus]);

        return response()->json([
            'message' => 'Todo status updated successfully',
            'todo' => TodoData::from($todo->fresh()),
        ]);
    }
}
