using MediatR;
namespace Todos.Application.Commands;

public class ToggleIsDoneTodoTaskCommand : IRequest<Unit>
{
    public ToggleIsDoneTodoTaskCommand(int todoTaskId)
    {
        TodoTaskId = todoTaskId;
    }
    public int TodoTaskId { get; set; }
}