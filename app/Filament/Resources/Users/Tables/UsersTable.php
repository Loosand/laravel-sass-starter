<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->label('Email Address')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                IconColumn::make('email_verified_at')
                    ->label('Verified')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Updated At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('impersonate_action')
                    ->label('Impersonate')
                    ->getStateUsing(function ($record) {
                        if (Auth::user()->canImpersonate() && $record->canBeImpersonated()) {
                            return '<button class="text-blue-600 hover:text-blue-800">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                </svg>
                            </button>';
                        }
                        return '';
                    })
                    ->html()
                    ->alignCenter(),
            ])
            ->filters([
                Filter::make('verified')
                    ->label('Email Verified')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('email_verified_at')),
                Filter::make('unverified')
                    ->label('Email Unverified')
                    ->query(fn (Builder $query): Builder => $query->whereNull('email_verified_at')),
                Filter::make('two_factor_enabled')
                    ->label('2FA Enabled')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('two_factor_confirmed_at')),
            ])
            ->recordActions([
                Action::make('impersonate')
                    ->label('Impersonate')
                    ->icon('heroicon-o-arrows-right-left')
                    ->color('info')
                    ->action(function ($record) {
                        Auth::user()->impersonate($record);
                        return redirect('/');
                    })
                    ->requiresConfirmation()
                    ->modalHeading('Impersonate User')
                    ->modalDescription(fn ($record) => "Are you sure you want to impersonate {$record->name}?")
                    ->modalSubmitActionLabel('Yes, Impersonate')
                    ->visible(fn ($record) => Auth::user()->canImpersonate() && $record->canBeImpersonated()),
                EditAction::make(),
            ])
            ->toolbarActions([])
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(25)
            ->paginated([10, 25, 50, 100]);
    }
}
