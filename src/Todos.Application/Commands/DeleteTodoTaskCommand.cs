using MediatR;
namespace Todos.Application.Commands;

public class DeleteTodoTaskCommand : IRequest<Unit>
{
    public DeleteTodoTaskCommand(int todoTaskId)
    {
        TodoTaskId = todoTaskId;
    }
    public int TodoTaskId { get; set; }
}