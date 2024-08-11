using FluentValidation;
using Todos.Domain.Entities;

namespace Todos.Application.Validators;

public class TodoTaskValidator : AbstractValidator<TodoTask>
{
    public TodoTaskValidator()
    {
        RuleFor(x => x.TodoTaskName).MinimumLength(10).WithMessage("TODO must be at least 10 characters long.");
        RuleFor(x => x.TodoTaskName).MaximumLength(450).WithMessage("TODO must not exceed 450 characters.");
    }
}