<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImpersonateController extends Controller
{
    /**
     * Start impersonating a user.
     */
    public function start(Request $request, User $user)
    {
        if (!Auth::user()->canImpersonate()) {
            abort(403, 'You do not have permission to impersonate users.');
        }

        if (!$user->canBeImpersonated()) {
            abort(403, 'This user cannot be impersonated.');
        }

        // 使用我们的自定义方法
        if (Auth::user()->impersonate($user)) {
            return redirect()->route('dashboard')->with('success', "You are now impersonating {$user->name}");
        }

        return back()->with('error', 'Failed to impersonate user.');
    }

    /**
     * Stop impersonating and return to original user.
     */
    public function stop()
    {
        $manager = app(\Lab404\Impersonate\Services\ImpersonateManager::class);
        
        if ($manager->isImpersonating()) {
            $manager->leave();
            return redirect()->route('dashboard')->with('success', 'Stopped impersonating user.');
        }

        return redirect()->route('dashboard');
    }
}

