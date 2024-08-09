using MediatR;
using Todos.Domain.Interfaces;

namespace Todos.Application.Commands.Handlers;

public class UpdateTodoTaskCommandHandler : IRequestHandler<UpdateTodoTaskCommand, Unit>
{
    private readonly ITodoTaskRepository _repository;

    public UpdateTodoTaskCommandHandler(ITodoTaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(UpdateTodoTaskCommand request, CancellationToken cancellationToken)
    {
        var existingTask = await _repository.GetByIdAsync(request.TodoTaskId);

        if (existingTask == null)
        {
            throw new Exception($"TodoTask with ID {request.TodoTaskId} not found.");
        }

        existingTask.Deadline = request.Deadline;
        existingTask.TodoTaskName = request.TodoTaskName;
        existingTask.LastModified = DateTime.Now;

        await _repository.UpdateAsync(existingTask);

        return Unit.Value;
    }
}