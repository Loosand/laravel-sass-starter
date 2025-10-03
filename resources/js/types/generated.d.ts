declare namespace App.Data {
export type TodoData = {
id: number;
title: string;
description: string | null;
status: App.Enums.TodoStatus;
category: App.Enums.TodoCategory;
due_date: string | null;
created_at: string;
updated_at: string;
};
}
declare namespace App.Enums {
export type TodoCategory = 'work' | 'personal' | 'study' | 'health' | 'shopping';
export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
}
