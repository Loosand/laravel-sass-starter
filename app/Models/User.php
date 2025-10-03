<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Lab404\Impersonate\Models\Impersonate;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, Impersonate;

    /**
     * Admin email addresses
     *
     * @var array<string>
     */
    protected static $adminEmails = [
        'admin@example.com',
        'loosand@163.com'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Determine if the user can impersonate other users.
     *
     * @return bool
     */
    public function canImpersonate()
    {
        // For example, only allow admin users to impersonate
        // You can customize this logic based on your requirements
        return $this->hasRole('admin');
    }

    /**
     * Determine if the user can be impersonated.
     *
     * @return bool
     */
    public function canBeImpersonated()
    {
        // For example, prevent admin users from being impersonated
        // You can customize this logic based on your requirements
        return !$this->hasRole('admin');
    }

    /**
     * Check if the user is an admin based on email address.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return in_array($this->email, static::$adminEmails);
    }

    /**
     * Check if user has a specific role.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole($role)
    {
        if ($role === 'admin') {
            return $this->isAdmin();
        }
        
        // Add other role checking logic here if needed
        return false;
    }

    /**
     * Impersonate another user.
     *
     * @param User $user
     * @return bool
     */
    public function impersonate(User $user)
    {
        if (!$this->canImpersonate()) {
            return false;
        }

        if (!$user->canBeImpersonated()) {
            return false;
        }

        $manager = app(\Lab404\Impersonate\Services\ImpersonateManager::class);
        return $manager->take($this, $user);
    }

    /**
     * Stop impersonating and return to original user.
     *
     * @return bool
     */
    public function stopImpersonating()
    {
        $manager = app(\Lab404\Impersonate\Services\ImpersonateManager::class);
        return $manager->leave();
    }

    /**
     * Check if currently impersonating another user.
     *
     * @return bool
     */
    public function isImpersonating()
    {
        $manager = app(\Lab404\Impersonate\Services\ImpersonateManager::class);
        return $manager->isImpersonating();
    }

    /**
     * Get the todos for the user.
     */
    public function todos(): HasMany
    {
        return $this->hasMany(Todo::class);
    }
}
