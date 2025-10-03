<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminOnlyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('admin/login') || $request->is('admin/logout')) {
            return $next($request);
        }

        if (!Auth::check()) {
            return redirect('/admin/login');
        }

        if (!Auth::user()->isAdmin()) {
            return redirect('/')->with('error', 'Access denied. Admin privileges required.');
        }

        return $next($request);
    }
}
