import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TodoConfig } from '@/constants/todo';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import todos from '@/routes/todos';
import { Filters } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import debounce from 'lodash-es/debounce';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface TodosIndexProps {
    todos: App.Data.TodoData[];
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: Filters;
}

const searchDebounceMs = 300;

export default function TodosIndex({
    todos: todoList,
    pagination,
    filters,
}: TodosIndexProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState<number | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        reset: resetCreate,
    } = useForm({
        title: '',
        description: '',
        status: 'pending',
        category: 'personal',
    });

    const { patch: toggleStatus, processing: toggleProcessing } = useForm();
    const { delete: deleteTodo, processing: deleteProcessing } = useForm();

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(todos.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                resetCreate();
                toast.success('Todo created successfully');
            },
        });
    };

    const handleToggleStatus = (todoId: number) => {
        toggleStatus(todos.toggleStatus({ todo: todoId }).url, {
            preserveScroll: true,
        });
    };

    const handleDeleteClick = (todoId: number) => setTodoToDelete(todoId);

    const handleConfirmDelete = () => {
        if (todoToDelete) {
            deleteTodo(todos.destroy({ todo: todoToDelete }).url, {
                preserveScroll: true,
                onFinish: () => setTodoToDelete(null),
            });
        }
    };

    const handleCancelDelete = () => setTodoToDelete(null);

    const handleFilter = (filterType: 'status' | 'category', value: string) => {
        const filterParams: Record<string, string> = {};

        // preserve other filters
        if (filters.search) filterParams.search = filters.search;
        if (filters.status && filterType !== 'status')
            filterParams.status = filters.status;
        if (filters.category && filterType !== 'category')
            filterParams.category = filters.category;

        // set new filter value
        if (value && value !== 'all') filterParams[filterType] = value;

        router.get(todos.index().url, filterParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Create debounced search function
    const debouncedSearch = debounce((value: string) => {
        router.get(
            todos.index().url,
            {
                search: value || undefined, // Don't send empty string
                ...(filters.status && { status: filters.status }),
                ...(filters.category && { category: filters.category }),
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }, searchDebounceMs);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        debouncedSearch(value);
    };

    const clearSearch = () => {
        // Clear search with preserveState to avoid remounting
        router.get(
            todos.index().url,
            {
                ...(filters.status && { status: filters.status }),
                ...(filters.category && { category: filters.category }),
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Focus the input after request completes
                    searchInputRef.current?.focus();
                },
            },
        );

        // Manually clear the uncontrolled input's value
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
        }
    };

    return (
        <AppLayout>
            <Head title="Todo List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 sm:gap-6 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Todo List
                        </h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Manage your tasks and stay organized
                        </p>
                    </div>
                    <Dialog
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                <span className="sm:inline">Add Todo</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleCreateSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Create New Todo</DialogTitle>
                                    <DialogDescription>
                                        Add a new task to your todo list.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={createData.title}
                                            onChange={(e) =>
                                                setCreateData(
                                                    'title',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter todo title"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            value={createData.description}
                                            onChange={(e) =>
                                                setCreateData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter description (optional)"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">
                                            Category
                                        </Label>
                                        <Select
                                            value={createData.category}
                                            onValueChange={(value) =>
                                                setCreateData(
                                                    'category',
                                                    value as App.Enums.TodoCategory,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TodoConfig.category
                                                    .all()
                                                    .map((category) => (
                                                        <SelectItem
                                                            key={category}
                                                            value={category}
                                                        >
                                                            {
                                                                TodoConfig
                                                                    .category
                                                                    .labels[
                                                                    category
                                                                ]
                                                            }
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setIsCreateDialogOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createProcessing}
                                    >
                                        {createProcessing
                                            ? 'Creating...'
                                            : 'Create Todo'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                    {/* Search Input - Full width on mobile */}
                    <div className="relative w-full">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            ref={searchInputRef}
                            type="search"
                            placeholder="Search todos..."
                            defaultValue={filters.search || ''}
                            onChange={handleSearch}
                            className="w-full pr-10 pl-10"
                        />
                        {filters.search && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                            <Label
                                htmlFor="status-filter"
                                className="text-sm font-medium sm:whitespace-nowrap"
                            >
                                Status:
                            </Label>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) =>
                                    handleFilter('status', value)
                                }
                            >
                                <SelectTrigger
                                    id="status-filter"
                                    className="w-full sm:w-40"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    {TodoConfig.status.all().map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {TodoConfig.status.labels[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                            <Label
                                htmlFor="category-filter"
                                className="text-sm font-medium sm:whitespace-nowrap"
                            >
                                Category:
                            </Label>
                            <Select
                                value={filters.category || 'all'}
                                onValueChange={(value) =>
                                    handleFilter('category', value)
                                }
                            >
                                <SelectTrigger
                                    id="category-filter"
                                    className="w-full sm:w-40"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {TodoConfig.category
                                        .all()
                                        .map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {
                                                    TodoConfig.category.labels[
                                                        category
                                                    ]
                                                }
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Tasks
                            </CardTitle>
                            <span className="text-xl sm:text-2xl">📋</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold sm:text-2xl">
                                {pagination.total}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completed
                            </CardTitle>
                            <span className="text-xl sm:text-2xl">✅</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold sm:text-2xl">
                                {
                                    todoList.filter(
                                        (todo) => todo.status === 'completed',
                                    ).length
                                }
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                In Progress
                            </CardTitle>
                            <span className="text-xl sm:text-2xl">🔄</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold sm:text-2xl">
                                {
                                    todoList.filter(
                                        (todo) => todo.status === 'in_progress',
                                    ).length
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Todo List */}
                <div className="space-y-3 sm:space-y-4">
                    {todoList.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                                <div className="mb-4 text-4xl sm:text-6xl">
                                    📝
                                </div>
                                <h3 className="text-base font-semibold sm:text-lg">
                                    No todos yet
                                </h3>
                                <p className="mb-4 text-center text-sm text-muted-foreground sm:text-base">
                                    Get started by creating your first todo
                                    item.
                                </p>
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="w-full sm:w-auto"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Todo
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        todoList.map((todo) => (
                            <Card
                                key={todo.id}
                                className="transition-all hover:shadow-md"
                            >
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={
                                                todo.status === 'completed'
                                            }
                                            onCheckedChange={() =>
                                                handleToggleStatus(todo.id)
                                            }
                                            disabled={toggleProcessing}
                                            className="mt-1 flex-shrink-0"
                                        />
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="space-y-2">
                                                    <h3
                                                        className={`text-sm font-semibold sm:text-base ${todo.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}
                                                    >
                                                        {todo.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge
                                                            className={cn(
                                                                'text-xs',
                                                                TodoConfig
                                                                    .status
                                                                    .colors[
                                                                    todo.status
                                                                ],
                                                            )}
                                                        >
                                                            {
                                                                TodoConfig
                                                                    .status
                                                                    .labels[
                                                                    todo.status
                                                                ]
                                                            }
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                TodoConfig
                                                                    .category
                                                                    .labels[
                                                                    todo
                                                                        .category
                                                                ]
                                                            }
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <AlertDialog
                                                        open={
                                                            todoToDelete ===
                                                            todo.id
                                                        }
                                                        onOpenChange={(open) =>
                                                            !open &&
                                                            setTodoToDelete(
                                                                null,
                                                            )
                                                        }
                                                    >
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        todo.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleteProcessing
                                                                }
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete Todo
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure
                                                                    you want to
                                                                    delete "
                                                                    {todo.title}
                                                                    "? This
                                                                    action
                                                                    cannot be
                                                                    undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel
                                                                    onClick={
                                                                        handleCancelDelete
                                                                    }
                                                                    disabled={
                                                                        deleteProcessing
                                                                    }
                                                                >
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={
                                                                        handleConfirmDelete
                                                                    }
                                                                    disabled={
                                                                        deleteProcessing
                                                                    }
                                                                >
                                                                    {deleteProcessing
                                                                        ? 'Deleting...'
                                                                        : 'Delete'}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                            {todo.description && (
                                                <p
                                                    className={cn(
                                                        'text-xs text-muted-foreground sm:text-sm',
                                                        todo.status ===
                                                            'completed'
                                                            ? 'line-through'
                                                            : '',
                                                    )}
                                                >
                                                    {todo.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                Created{' '}
                                                {new Date(
                                                    todo.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <p className="text-sm text-muted-foreground">
                            Page {pagination.current_page} of{' '}
                            {pagination.last_page}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
