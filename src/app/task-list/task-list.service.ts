import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { NewTaskData, Priority, Status, Task } from './task-item/task-item.model';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TasksService {
    private jsonUrl = 'assets/mock-tasks.json';
    private http = inject(HttpClient);
    private tasks = signal<Task[]>([]);
    private destroyRef = inject(DestroyRef);

    filteredTasks = signal<Task[]>([]);
    allTasks = this.filteredTasks.asReadonly();


    filterByStatus(status: Status | 'no filter') {
        if (status === 'no filter') {
            this.filteredTasks.set(this.tasks());
            return;
        }
        this.filteredTasks.set(
            this.tasks().filter((task) => task.status === status)
        );
    }

    filterById(id: number) {
        return this.allTasks().find((task) => task.id === id);
    }

    fetchTasks() {
        const tasks = localStorage.getItem('tasks');

        if (tasks) {
            this.tasks.set(JSON.parse(tasks));
            this.filteredTasks.set(this.tasks());
            return;
        }

        const subscription = this.http.get<Task[]>(this.jsonUrl).subscribe(data => {
            this.tasks.set(
                data.map((task) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate,
                    status: task.status as Status,
                    priority: task.priority as Priority,
                }))
            );
            this.filteredTasks.set(this.tasks());
        });

        this.destroyRef.onDestroy(() => {
            subscription.unsubscribe();
        });
    }

    addTask(taskData: NewTaskData, id?: number) {
        this.tasks.update((prevTasks) => [
            {
                id: id ? id : this.tasks().length + 1,
                title: taskData.title,
                description: taskData.description,
                dueDate: taskData.dueDate,
                status: taskData.status,
                priority: taskData.priority,
            },
            ...prevTasks,
        ]);
        this.saveTasks();
        this.filteredTasks.set(this.tasks());
    }

    removeTask(id: number) {
        this.tasks.update((prevTasks) =>
            prevTasks.filter((task) => task.id !== id)
        );
        this.saveTasks();
        this.filteredTasks.set(this.tasks());
    }

    private saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks()));
    }

}
