using FluentValidation;
using MediatR;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;

namespace Todos.Application.Commands.Handlers;

public class UpdateTodoTaskCommandHandler : IRequestHandler<UpdateTodoTaskCommand, Unit>
{
    private readonly ITodoTaskRepository _repository;
    private readonly IValidator<TodoTask> _validator;

    public UpdateTodoTaskCommandHandler(ITodoTaskRepository repository, IValidator<TodoTask> validator)
    {
        _repository = repository;
        _validator = validator;
    }

    public async Task<Unit> Handle(UpdateTodoTaskCommand request, CancellationToken cancellationToken)
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

        existingTask.Deadline = request.Deadline;
        existingTask.TodoTaskName = request.TodoTaskName;
        existingTask.LastModified = DateTime.Now;

        var validationResult = await _validator.ValidateAsync(existingTask, cancellationToken);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        await _repository.UpdateAsync(existingTask);

        return Unit.Value;
    }
}