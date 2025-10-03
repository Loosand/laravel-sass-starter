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
import { Card, CardContent } from '@/components/ui/card';
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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        has_more_pages: boolean;
        prev_page_url: string | null;
        next_page_url: string | null;
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

    const handlePageChange = (page: number) => {
        const params: Record<string, string | number> = { page };

        // Preserve current filters
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;
        if (filters.category) params.category = filters.category;

        router.get(todos.index().url, params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Todo List" />
            <div className="mx-40 flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
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

                <div className="flex gap-4">
                    <Card className="flex-1 border-border/50 bg-card/50 p-0">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Total Tasks
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {pagination.total}
                                    </p>
                                </div>
                                <span className="text-lg">📋</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 border-border/50 bg-card/50 p-0">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Completed
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {
                                            todoList.filter(
                                                (todo) =>
                                                    todo.status === 'completed',
                                            ).length
                                        }
                                    </p>
                                </div>
                                <span className="text-lg">✅</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 border-border/50 bg-card/50 p-0">
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        In Progress
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {
                                            todoList.filter(
                                                (todo) =>
                                                    todo.status ===
                                                    'in_progress',
                                            ).length
                                        }
                                    </p>
                                </div>
                                <span className="text-lg">🔄</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-2">
                    {todoList.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-6">
                                <div className="mb-3 text-3xl">📝</div>
                                <h3 className="text-sm font-medium">
                                    No todos yet
                                </h3>
                                <p className="mb-3 text-center text-xs text-muted-foreground">
                                    Get started by creating your first todo
                                    item.
                                </p>
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="w-full sm:w-auto"
                                >
                                    <Plus className="mr-2 h-3 w-3" />
                                    Add Your First Todo
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        todoList.map((todo) => (
                            <Card key={todo.id} className="p-0">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={
                                                todo.status === 'completed'
                                            }
                                            onCheckedChange={() =>
                                                handleToggleStatus(todo.id)
                                            }
                                            disabled={toggleProcessing}
                                            className="flex-shrink-0"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                                <h3
                                                    className={cn(
                                                        'truncate text-sm font-medium',
                                                        todo.status ===
                                                            'completed' &&
                                                            'text-muted-foreground line-through',
                                                    )}
                                                >
                                                    {todo.title}
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    <Badge
                                                        className={cn(
                                                            'h-5 px-2 text-xs',
                                                            TodoConfig.status
                                                                .colors[
                                                                todo.status
                                                            ],
                                                        )}
                                                    >
                                                        {
                                                            TodoConfig.status
                                                                .labels[
                                                                todo.status
                                                            ]
                                                        }
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="h-5 px-2 text-xs"
                                                    >
                                                        {
                                                            TodoConfig.category
                                                                .labels[
                                                                todo.category
                                                            ]
                                                        }
                                                    </Badge>
                                                    <span className="ml-4 inline-block text-xs text-muted-foreground">
                                                        {new Date(
                                                            todo.created_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <p
                                                className={cn(
                                                    'mt-1 line-clamp-2 text-xs text-muted-foreground',
                                                    todo.status ===
                                                        'completed' &&
                                                        'line-through',
                                                )}
                                            >
                                                {todo.description}
                                            </p>
                                        </div>

                                        <AlertDialog
                                            open={todoToDelete === todo.id}
                                            onOpenChange={(open) =>
                                                !open && setTodoToDelete(null)
                                            }
                                        >
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            todo.id,
                                                        )
                                                    }
                                                    disabled={deleteProcessing}
                                                    className="flex-shrink-0 p-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="size-4 opacity-60" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete Todo
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to
                                                        delete "{todo.title}"?
                                                        This action cannot be
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
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {pagination.last_page > 1 && (
                    <div className="flex flex-col items-center gap-2">
                        <Pagination>
                            <PaginationContent>
                                {pagination.current_page > 1 && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e: React.MouseEvent) => {
                                                e.preventDefault();
                                                handlePageChange(
                                                    pagination.current_page - 1,
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}

                                {/* First page */}
                                {pagination.current_page > 3 && (
                                    <>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(1);
                                                }}
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        {pagination.current_page > 4 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                    </>
                                )}

                                {/* Previous page */}
                                {pagination.current_page > 1 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(
                                                    pagination.current_page - 1,
                                                );
                                            }}
                                        >
                                            {pagination.current_page - 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {/* Current page */}
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        isActive
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {pagination.current_page}
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Next page */}
                                {pagination.current_page <
                                    pagination.last_page && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(
                                                    pagination.current_page + 1,
                                                );
                                            }}
                                        >
                                            {pagination.current_page + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {/* Last page */}
                                {pagination.current_page <
                                    pagination.last_page - 2 && (
                                    <>
                                        {pagination.current_page <
                                            pagination.last_page - 3 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(
                                                        pagination.last_page,
                                                    );
                                                }}
                                            >
                                                {pagination.last_page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}

                                {pagination.current_page <
                                    pagination.last_page && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e: React.MouseEvent) => {
                                                e.preventDefault();
                                                handlePageChange(
                                                    pagination.current_page + 1,
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>

                        <p className="text-xs text-muted-foreground">
                            Showing {pagination.from || 0} to{' '}
                            {pagination.to || 0} of {pagination.total} results
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
