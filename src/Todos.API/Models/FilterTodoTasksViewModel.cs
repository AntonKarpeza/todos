using Todos.Domain.Entities;

namespace Todos.API.Models;

public class FilterTodoTasksViewModel
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public bool? IsDone { get; set; }
    public DateTime? DeadlineFrom { get; set; }
    public DateTime? DeadlineTo { get; set; }
    public string? TodoTaskName { get; set; }
    public string? SortBy { get; set; } = nameof(TodoTask.TodoTaskId);
    public string? SortDirection { get; set; } = "desc";
}