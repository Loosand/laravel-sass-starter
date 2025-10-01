declare namespace App.Data {
    export type TodoData = {
        id: number;
        title: string;
        description: string | null;
        status: string;
        category: string;
        due_date: string | null;
        created_at: string;
        updated_at: string;
    };
}
declare namespace App.Enums {
    export type TodoCategory = {
        name: string;
        value: string;
    };
    export type TodoStatus = {
        name: string;
        value: string;
    };
}
