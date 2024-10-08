import { create, StateCreator } from "zustand";
import { v4 as uuidv4 } from "uuid";

import { Task, TaskStatus } from "../../interfaces";
import { devtools, persist } from "zustand/middleware";
// import { produce } from "immer";
import { immer } from "zustand/middleware/immer";
import { firebaseStorage } from "../storages/firebase.storage";

interface TaskState {
  draggingTaskId?: string;
  tasks: Record<string, Task>;
  getTaskStatus: (status: TaskStatus) => Task[];
  getTasksCount: () => number;
  addTask: (title: string, status: TaskStatus) => void;
  setDraggingTaskId: (taskId: string) => void;
  removeDraggingTaskId: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
}

const storeAPI: StateCreator<
  TaskState,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
  draggingTaskId: undefined,
  tasks: {
    "ABC-1": { id: "ABC-1", title: "Task 1", status: "open" },
    "ABC-2": { id: "ABC-2", title: "Task 2", status: "in-progress" },
    "ABC-3": { id: "ABC-3", title: "Task 3", status: "open" },
    "ABC-4": { id: "ABC-4", title: "Task 4", status: "open" },
  },
  getTasksCount: () => {
    return Object.values(get().tasks).length;
  },
  getTaskStatus: (status: TaskStatus) => {
    const tasks = get().tasks;
    return Object.values(tasks).filter((task) => task.status === status);
  },
  addTask: (title: string, status: TaskStatus) => {
    const newTask = { id: uuidv4(), title, status: status };

    // Using immer middleware
    set((state) => {
      state.tasks[newTask.id] = newTask;
    });

    // Require install immer package
    // set(
    //   produce((state: TaskState) => {
    //     state.tasks[newTask.id] = newTask;
    //   })
    // );

    // Native way
    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]: newTask,
    //   },
    // }));
  },
  setDraggingTaskId: (draggingTaskId: string) => {
    set({ draggingTaskId: draggingTaskId });
  },
  removeDraggingTaskId: () => {
    set({ draggingTaskId: undefined });
  },
  changeTaskStatus: (taskId: string, status: TaskStatus) => {
    set((state) => {
      state.tasks[taskId] = {
        ...state.tasks[taskId],
        status,
      };
    });
  },
  onTaskDrop: (status: TaskStatus) => {
    const taskId = get().draggingTaskId;
    if (!taskId) return;

    get().changeTaskStatus(taskId, status);
    get().removeDraggingTaskId();
  },
});

export const useTaskStore = create<TaskState>()(
  devtools(
    persist(immer(storeAPI), { name: "task-store", storage: firebaseStorage })
  )
);
