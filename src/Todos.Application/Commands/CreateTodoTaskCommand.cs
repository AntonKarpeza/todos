using MediatR;

namespace Todos.Application.Commands;

public class CreateTodoTaskCommand : IRequest<int>
{
    public CreateTodoTaskCommand(string todoTaskName, DateTime? deadline)
    {
        TodoTaskName = todoTaskName;
        Deadline = deadline;
    }
    public string TodoTaskName { get; set; }
    public DateTime? Deadline { get; set; }
}