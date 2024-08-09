using MediatR;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;

namespace Todos.Application.Commands.Handlers;

public class CreateTodoTaskCommandHandler : IRequestHandler<CreateTodoTaskCommand, int>
{
    private readonly ITodoTaskRepository _repository;

    public CreateTodoTaskCommandHandler(ITodoTaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(CreateTodoTaskCommand request, CancellationToken cancellationToken)
    {
        var todoTask = new TodoTask
        {
            Deadline = request.Deadline,
            TodoTaskName = request.TodoTaskName,
            CreatedDate = DateTime.Now
        };

        await _repository.AddAsync(todoTask);

        return todoTask.TodoTaskId;
    }
}