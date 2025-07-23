export type Status = 'To Do' | 'In Progress' | 'Done';

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';


export interface Task {
    id: number;
    title: string;
    description: string;
    status: Status;
    dueDate: string;
    priority: Priority;
}

export interface NewTaskData {
    title: string;
    description: string;
    status: Status;
    dueDate: string;
    priority: Priority;
}
