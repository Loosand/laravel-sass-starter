import { CheckCircle, Clock, XCircle } from 'lucide-react';

/**
 * Centralized Todo Configuration Object
 *
 * This object provides a unified interface for all todo-related constants,
 * making it easier to manage and access todo configurations.
 */
export const TodoConfig = {
    /**
     * Status-related configurations
     */
    status: {
        /**
         * Color mappings for different todo statuses (for main pages with dark mode support)
         */
        colors: {
            pending:
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            in_progress:
                'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            completed:
                'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            cancelled:
                'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        } as Record<App.Enums.TodoStatus, string>,

        /**
         * Simplified color mappings for TodoCard component
         */
        cardColors: {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        } as Record<App.Enums.TodoStatus, string>,

        /**
         * Icon mappings for different todo statuses
         */
        icons: {
            pending: Clock,
            in_progress: Clock,
            completed: CheckCircle,
            cancelled: XCircle,
        } as Record<App.Enums.TodoStatus, typeof Clock>,

        /**
         * Human readable labels for todo statuses
         */
        labels: {
            pending: 'Pending',
            in_progress: 'In Progress',
            completed: 'Completed',
            cancelled: 'Cancelled',
        } as Record<App.Enums.TodoStatus, string>,

        /**
         * Get status configuration by status value
         */
        get: (status: App.Enums.TodoStatus) => ({
            color: TodoConfig.status.colors[status],
            cardColor: TodoConfig.status.cardColors[status],
            icon: TodoConfig.status.icons[status],
            label: TodoConfig.status.labels[status],
        }),

        /**
         * Get all available statuses
         */
        all: (): App.Enums.TodoStatus[] => [
            'pending',
            'in_progress',
            'completed',
            'cancelled',
        ],
    },

    /**
     * Category-related configurations
     */
    category: {
        /**
         * Color mappings for TodoCard component
         */
        colors: {
            work: 'bg-purple-100 text-purple-800',
            personal: 'bg-pink-100 text-pink-800',
            study: 'bg-indigo-100 text-indigo-800',
            health: 'bg-green-100 text-green-800',
            shopping: 'bg-orange-100 text-orange-800',
        } as Record<App.Enums.TodoCategory, string>,

        /**
         * Human readable labels for todo categories
         */
        labels: {
            personal: 'Personal',
            work: 'Work',
            shopping: 'Shopping',
            health: 'Health',
            study: 'Study',
        } as Record<App.Enums.TodoCategory, string>,

        /**
         * Get category configuration by category value
         */
        get: (category: App.Enums.TodoCategory) => ({
            color: TodoConfig.category.colors[category],
            label: TodoConfig.category.labels[category],
        }),

        /**
         * Get all available categories
         */
        all: (): App.Enums.TodoCategory[] => [
            'work',
            'personal',
            'study',
            'health',
            'shopping',
        ],
    },

    /**
     * Utility methods for working with todos
     */
    utils: {
        /**
         * Check if a status is considered "active" (not completed or cancelled)
         */
        isActiveStatus: (status: App.Enums.TodoStatus): boolean =>
            status === 'pending' || status === 'in_progress',

        /**
         * Check if a status is considered "finished" (completed or cancelled)
         */
        isFinishedStatus: (status: App.Enums.TodoStatus): boolean =>
            status === 'completed' || status === 'cancelled',

        /**
         * Get the next logical status for a todo
         */
        getNextStatus: (
            currentStatus: App.Enums.TodoStatus,
        ): App.Enums.TodoStatus | null => {
            const statusFlow: Record<
                App.Enums.TodoStatus,
                App.Enums.TodoStatus | null
            > = {
                pending: 'in_progress',
                in_progress: 'completed',
                completed: null,
                cancelled: null,
            };
            return statusFlow[currentStatus];
        },

        /**
         * Sort todos by priority (status-based)
         */
        getStatusPriority: (status: App.Enums.TodoStatus): number => {
            const priorities: Record<App.Enums.TodoStatus, number> = {
                in_progress: 1,
                pending: 2,
                completed: 3,
                cancelled: 4,
            };
            return priorities[status];
        },
    },
} as const;
