export type EmployeeForm = {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
};

export type Employee = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
};