using Todos.Domain.Entities;
using Todos.Domain.Helpers;
using Todos.Domain.Interfaces;
using Todos.Infrastructure.Data;
using System.Linq.Dynamic.Core;

namespace Todos.Infrastructure.Repositories;

public class TodoTaskRepository : ITodoTaskRepository
{
    private readonly AppDbContext _context;

    public TodoTaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TodoTask?> GetByIdAsync(int todoTaskId)
    {
        return await _context.TodoTasks.FindAsync(todoTaskId);
    }

    public async Task<PaginatedList<TodoTask>> GetTodoTasksAsync(int pageNumber, int pageSize, bool? isDone, DateTime? deadlineFrom, DateTime? deadlineTo, string? todoTaskName, string? sortBy, string? sortDirection)
    {
        var query = _context.TodoTasks
            .Where(t => t.DeletedDate == null)
            .AsQueryable();

        if (isDone.HasValue)
        {
            query = query.Where(t => t.IsDone == isDone.Value);
        }

        if (deadlineFrom.HasValue)
        {
            query = query.Where(t => t.Deadline >= deadlineFrom.Value);
        }

        if (deadlineTo.HasValue)
        {
            query = query.Where(t => t.Deadline <= deadlineTo.Value);
        }

        if (!string.IsNullOrEmpty(todoTaskName))
        {
            query = query.Where(t => t.TodoTaskName.Contains(todoTaskName));
        }

        if (!string.IsNullOrEmpty(sortBy))
        {
            var direction = sortDirection?.ToLower() == "asc" ? "ascending" : "descending";
            query = query.OrderBy($"{sortBy} {direction}");
        }

        return await PaginatedList<TodoTask>.CreateAsync(query, pageNumber, pageSize);
    }

    public async Task AddAsync(TodoTask todoTask)
    {
        _context.TodoTasks.Add(todoTask);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(TodoTask todoTask)
    {
        _context.TodoTasks.Update(todoTask);
        await _context.SaveChangesAsync();
    }
}