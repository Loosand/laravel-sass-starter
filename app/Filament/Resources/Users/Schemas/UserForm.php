<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('User Information')
                    ->description('Basic user account information')
                    ->schema([
                        TextInput::make('name')
                            ->label('Full Name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email')
                            ->label('Email Address')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        TextInput::make('password')
                            ->label('Password')
                            ->password()
                            ->required(fn (string $context): bool => $context === 'create')
                            ->dehydrated(fn ($state) => filled($state))
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->minLength(8)
                            ->maxLength(255)
                            ->helperText('Leave blank to keep current password when editing'),
                    ])
                    ->columns(2),
                
                Section::make('Account Status')
                    ->description('Email verification and security settings')
                    ->schema([
                        Toggle::make('email_verified')
                            ->label('Email Verified')
                            ->default(false)
                            ->afterStateUpdated(function ($state, $set) {
                                if ($state) {
                                    $set('email_verified_at', now());
                                } else {
                                    $set('email_verified_at', null);
                                }
                            }),
                        DateTimePicker::make('email_verified_at')
                            ->label('Email Verified At')
                            ->hidden()
                            ->dehydrated(),
                        Toggle::make('two_factor_enabled')
                            ->label('Two Factor Authentication')
                            ->default(false)
                            ->disabled()
                            ->helperText('2FA can only be enabled by the user from their profile'),
                    ])
                    ->columns(2)
                    ->collapsible(),
            ]);
    }
}
