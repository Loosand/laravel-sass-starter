<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Lab404\Impersonate\Models\Impersonate;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, Impersonate;

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
     * Check if user has a specific role.
     * This is a placeholder method - implement according to your role system.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole($role)
    {
        // Implement your role checking logic here
        // This is just a placeholder
        return false;
    }
}
