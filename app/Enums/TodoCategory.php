<?php

declare(strict_types=1);

namespace App\Enums;

enum TodoCategory: string
{
    case WORK = 'work';
    case PERSONAL = 'personal';
    case STUDY = 'study';
    case HEALTH = 'health';
    case SHOPPING = 'shopping';
}
