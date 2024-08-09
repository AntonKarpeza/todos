using Todos.Domain.Entities;
using Todos.Domain.Helpers;

namespace Todos.Domain.Interfaces;

public interface ITodoTaskRepository
{
    Task<TodoTask?> GetByIdAsync(int todoTaskId);
    Task<PaginatedList<TodoTask>> GetTodoTasksAsync(int pageNumber, int pageSize, bool? isDone, DateTime? deadlineFrom, DateTime? deadlineTo, string? todoTaskName, string? sortBy, string? sortDirection);
    Task AddAsync(TodoTask todoTask);
    Task UpdateAsync(TodoTask todoTask);
}