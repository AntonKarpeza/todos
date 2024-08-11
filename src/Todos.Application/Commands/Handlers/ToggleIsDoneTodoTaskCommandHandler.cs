using MediatR;
using Todos.Domain.Interfaces;

namespace Todos.Application.Commands.Handlers;

public class ToggleIsDoneTodoTaskCommandHandler : IRequestHandler<ToggleIsDoneTodoTaskCommand, Unit>
{
    private readonly ITodoTaskRepository _repository;

    public ToggleIsDoneTodoTaskCommandHandler(ITodoTaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(ToggleIsDoneTodoTaskCommand request, CancellationToken cancellationToken)
    {
        if (request.TodoTaskId == 0)
        {
            throw new ArgumentException("Invalid Task ID");
        }

        var existingTask = await _repository.GetByIdAsync(request.TodoTaskId);

        if (existingTask == null)
        {
            throw new Exception($"TodoTask with ID {request.TodoTaskId} not found.");
        }

        existingTask.IsDone = !existingTask.IsDone;
        existingTask.LastModified = DateTime.Now;

        await _repository.UpdateAsync(existingTask);

        return Unit.Value;
    }
}