using MediatR;
using Todos.Domain.Entities;
namespace Todos.Application.Queries;

public class GetTodoTaskByIdQuery : IRequest<TodoTask>
{
    public GetTodoTaskByIdQuery(int todoTaskId)
    {
        TodoTaskId = todoTaskId;
    }
    public int TodoTaskId { get; set; }
}