<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Auth;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('impersonate')
                ->label('Impersonate User')
                ->icon('heroicon-o-user-circle')
                ->color('warning')
                ->action(function () {
                    Auth::user()->impersonate($this->getRecord());
                    
                    return redirect('/');
                })
                ->requiresConfirmation()
                ->modalHeading('Impersonate User')
                ->modalDescription(fn () => "Are you sure you want to impersonate {$this->getRecord()->name}?")
                ->modalSubmitActionLabel('Yes, Impersonate')
                ->visible(fn () => Auth::user()->canImpersonate() && $this->getRecord()->canBeImpersonated()),
            DeleteAction::make(),
        ];
    }
}
