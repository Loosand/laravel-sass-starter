import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { samples } from '@/routes';
import todos from '@/routes/todos';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Samples',
        href: samples().url,
    },
];

const samplePages = [
    {
        title: 'Todo List',
        description: 'A complete todo list application with CRUD operations',
        href: todos.index().url,
        icon: '📝',
    },
];

export default function Samples() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sample Pages" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Sample Pages
                    </h1>
                    <p className="text-muted-foreground">
                        Explore various sample implementations and components
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {samplePages.map((sample) => (
                        <Card
                            key={sample.title}
                            className="transition-all hover:shadow-lg"
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {sample.icon}
                                    </span>
                                    <div>
                                        <CardTitle className="text-xl">
                                            {sample.title}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {sample.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href={sample.href}>View Sample</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {samplePages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 text-6xl">🚧</div>
                        <h3 className="text-lg font-semibold">
                            No samples available yet
                        </h3>
                        <p className="text-muted-foreground">
                            Sample pages will be added here as they are
                            developed.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
