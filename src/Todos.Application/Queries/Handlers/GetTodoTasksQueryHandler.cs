using MediatR;
using Todos.Domain.Helpers;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;

namespace Todos.Application.Queries.Handlers;

public class GetTodoTasksQueryHandler : IRequestHandler<GetTodoTasksQuery, PaginatedList<TodoTask>>
{
    private readonly ITodoTaskRepository _repository;

    public GetTodoTasksQueryHandler(ITodoTaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<PaginatedList<TodoTask>> Handle(GetTodoTasksQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetTodoTasksAsync(
            request.PageNumber,
            request.PageSize,
            request.IsDone,
            request.DeadlineFrom,
            request.DeadlineTo,
            request.TodoTaskName,
            request.SortBy,
            request.SortDirection);
    }
}

//dotnet ef migrations add CreateIndex -s ../Todos.API
// dotnet ef database update -s ../Todos.API