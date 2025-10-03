import ImpersonateExitButton from '@/components/impersonate-exit-button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const { props } = usePage<SharedData>();
    const isOpen = props.sidebarOpen;
    const impersonation = props.impersonation;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                {children}
                <Toaster />

                <ImpersonateExitButton
                    isImpersonating={impersonation?.isImpersonating || false}
                />
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            {children}
            <Toaster />
            <ImpersonateExitButton
                isImpersonating={impersonation?.isImpersonating || false}
            />
        </SidebarProvider>
    );
}
