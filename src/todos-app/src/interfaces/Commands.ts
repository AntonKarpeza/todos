export interface CreateTodoTaskCommand {
    todoTaskName: string;
    deadline: string;
  }
  
  export interface UpdateTodoTaskCommand {
    todoTaskId: number;
    todoTaskName: string;
    deadline: string;
  }
  
  export interface ToggleTodoTaskCommand {
    todoTaskId: number;
  }
  
  export interface DeleteTodoTaskCommand {
    todoTaskId: number;
  }