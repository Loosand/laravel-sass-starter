import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

// Using the generated TypeScript types
type TodoData = App.Data.TodoData;

interface TodoCardProps {
    todo: TodoData;
    onToggleStatus?: (todo: TodoData) => void;
    onDelete?: (todo: TodoData) => void;
}

const statusConfig = {
    pending: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Pending',
    },
    in_progress: {
        icon: Clock,
        color: 'bg-blue-100 text-blue-800',
        label: 'In Progress',
    },
    completed: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        label: 'Completed',
    },
    cancelled: {
        icon: XCircle,
        color: 'bg-red-100 text-red-800',
        label: 'Cancelled',
    },
};

const categoryConfig = {
    work: 'bg-purple-100 text-purple-800',
    personal: 'bg-pink-100 text-pink-800',
    study: 'bg-indigo-100 text-indigo-800',
    health: 'bg-green-100 text-green-800',
    shopping: 'bg-orange-100 text-orange-800',
};

export function TodoCard({ todo, onToggleStatus, onDelete }: TodoCardProps) {
    const StatusIcon =
        statusConfig[todo.status as keyof typeof statusConfig]?.icon || Clock;
    const statusStyle =
        statusConfig[todo.status as keyof typeof statusConfig]?.color || '';
    const statusLabel =
        statusConfig[todo.status as keyof typeof statusConfig]?.label ||
        todo.status;
    const categoryStyle =
        categoryConfig[todo.category as keyof typeof categoryConfig] || '';

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">{todo.title}</CardTitle>
                        {todo.description && (
                            <CardDescription className="mt-1">
                                {todo.description}
                            </CardDescription>
                        )}
                    </div>
                    <div className="ml-4 flex gap-2">
                        <Badge className={statusStyle}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusLabel}
                        </Badge>
                        <Badge variant="outline" className={categoryStyle}>
                            {todo.category}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {todo.due_date && (
                            <span>
                                Due:{' '}
                                {new Date(todo.due_date).toLocaleDateString()}
                            </span>
                        )}
                        <span className="ml-2">
                            Created:{' '}
                            {new Date(todo.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {onToggleStatus && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onToggleStatus(todo)}
                            >
                                Toggle Status
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(todo)}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
