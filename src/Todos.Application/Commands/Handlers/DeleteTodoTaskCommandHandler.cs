using MediatR;
using Todos.Domain.Interfaces;

namespace Todos.Application.Commands.Handlers;

public class DeleteTodoTaskCommandHandler : IRequestHandler<DeleteTodoTaskCommand, Unit>
{
    private readonly ITodoTaskRepository _repository;

    public DeleteTodoTaskCommandHandler(ITodoTaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeleteTodoTaskCommand request, CancellationToken cancellationToken)
    {
        if (request.TodoTaskId <= 0)
        {
            throw new ArgumentException("Invalid Task ID");
        }

        var existingTask = await _repository.GetByIdAsync(request.TodoTaskId);

        if (existingTask == null)
        {
            throw new Exception($"TodoTask with ID {request.TodoTaskId} not found.");
        }

        if (existingTask.DeletedDate != null)
        {
            throw new Exception($"TodoTask with ID {request.TodoTaskId} has already deleted.");
        }

        existingTask.DeletedDate = DateTime.Now;

        await _repository.UpdateAsync(existingTask);

        return Unit.Value;
    }
}