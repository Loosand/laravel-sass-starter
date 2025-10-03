import { Button } from '@/components/ui/button';
import impersonate from '@/routes/impersonate';
import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

interface ImpersonateExitButtonProps {
    isImpersonating: boolean;
}

export default function ImpersonateExitButton({
    isImpersonating,
}: ImpersonateExitButtonProps) {
    if (!isImpersonating) {
        return null;
    }

    const handleExitImpersonation = () => {
        router.get(
            impersonate.leave(),
            {},
            {
                onSuccess: () => {
                    console.log('Successfully stopped impersonating');
                },
                onError: (errors) => {
                    console.error('Failed to stop impersonating:', errors);
                },
            },
        );
    };

    return (
        <div className="fixed right-10 bottom-10 z-50">
            <div className="max-w-sm rounded-lg border border-yellow-400 bg-yellow-100 p-3 shadow-lg">
                <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-yellow-800">
                        Impersonating Mode
                    </span>
                </div>

                <Button
                    onClick={handleExitImpersonation}
                    size="sm"
                    variant="outline"
                    className="w-full cursor-pointer gap-2 border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800"
                >
                    <LogOut className="size-3" />
                    Exit Impersonation
                </Button>
            </div>
        </div>
    );
}
