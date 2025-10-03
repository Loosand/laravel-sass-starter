import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface ImpersonationData {
    isImpersonating: boolean;
    currentUser?: {
        id: number;
        name: string;
        email: string;
    } | null;
    originalUser?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    impersonation?: ImpersonationData;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    isAdmin?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Filters {
    search?: string;
    status?: App.Enums.TodoStatus;
    category?: App.Enums.TodoCategory;
    [key: string]: unknown;
}
