using MediatR;

namespace Todos.Application.Commands;

public class UpdateTodoTaskCommand : IRequest<Unit>
{
    public UpdateTodoTaskCommand(int todoTaskId, string todoTaskName, DateTime? deadline)
    {
        TodoTaskId = todoTaskId;
        TodoTaskName = todoTaskName;
        Deadline = deadline;
    }
    public int TodoTaskId { get; set; }
    public string TodoTaskName { get; set; }
    public DateTime? Deadline { get; set; }
}