<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleImpersonateData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $manager = app(\Lab404\Impersonate\Services\ImpersonateManager::class);
        
        if (Auth::check()) {
            $isImpersonating = $manager->isImpersonating();
            $currentUser = Auth::user();
            $originalUser = null;
            
            if ($isImpersonating) {
                // 获取原始用户信息
                $originalUserId = session()->get('impersonate.original_id');
                if ($originalUserId) {
                    $originalUser = \App\Models\User::find($originalUserId);
                }
            }
            
            Inertia::share([
                'impersonation' => [
                    'isImpersonating' => $isImpersonating,
                    'currentUser' => $currentUser ? [
                        'id' => $currentUser->id,
                        'name' => $currentUser->name,
                        'email' => $currentUser->email,
                    ] : null,
                    'originalUser' => $originalUser ? [
                        'id' => $originalUser->id,
                        'name' => $originalUser->name,
                        'email' => $originalUser->email,
                    ] : null,
                ]
            ]);
        }

        return $next($request);
    }
}
