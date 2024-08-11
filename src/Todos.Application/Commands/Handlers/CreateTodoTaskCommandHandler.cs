using FluentValidation;
using MediatR;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;

namespace Todos.Application.Commands.Handlers;

public class CreateTodoTaskCommandHandler : IRequestHandler<CreateTodoTaskCommand, int>
{
    private readonly ITodoTaskRepository _repository;
    private readonly IValidator<TodoTask> _validator;

    public CreateTodoTaskCommandHandler(ITodoTaskRepository repository, IValidator<TodoTask> validator)
    {
        _repository = repository;
        _validator = validator;
    }

    public async Task<int> Handle(CreateTodoTaskCommand request, CancellationToken cancellationToken)
    {
        var todoTask = new TodoTask
        {
            Deadline = request.Deadline,
            TodoTaskName = request.TodoTaskName,
            CreatedDate = DateTime.Now
        };

        var validationResult = await _validator.ValidateAsync(todoTask, cancellationToken);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        await _repository.AddAsync(todoTask);

        return todoTask.TodoTaskId;
    }
}