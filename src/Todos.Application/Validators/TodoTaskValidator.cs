using FluentValidation;
using Todos.Domain.Entities;

namespace Todos.Application.Validators;

public class TodoTaskValidator : AbstractValidator<TodoTask>
{
    public TodoTaskValidator()
    {
        RuleFor(x => x.TodoTaskName).MinimumLength(10).WithMessage("Task name must be at least 10 characters long.");
    }
}