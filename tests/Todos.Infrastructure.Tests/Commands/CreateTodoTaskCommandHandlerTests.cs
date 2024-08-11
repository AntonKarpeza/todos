using FluentValidation;
using FluentValidation.Results;
using Moq;
using Todos.Application.Commands;
using Todos.Application.Commands.Handlers;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;
using Xunit;


namespace Todos.Application.Tests.Commands;

public class CreateTodoTaskCommandHandlerTests
{
    private readonly Mock<ITodoTaskRepository> _repositoryMock;
    private readonly Mock<IValidator<TodoTask>> _validatorMock;
    private readonly CreateTodoTaskCommandHandler _handler;

    public CreateTodoTaskCommandHandlerTests()
    {
        _repositoryMock = new Mock<ITodoTaskRepository>();
        _validatorMock = new Mock<IValidator<TodoTask>>();
        _handler = new CreateTodoTaskCommandHandler(_repositoryMock.Object, _validatorMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldAddTodoTask_WhenValidationPasses()
    {
        // Arrange
        var command = new CreateTodoTaskCommand("Test Task 1", DateTime.Now.AddDays(1));

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<TodoTask>()))
            .Callback<TodoTask>(task => task.TodoTaskId = 1)
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<TodoTask>()), Times.Once);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Once);
        Assert.True(result > 0);
    }

    [Fact]
    public async Task Handle_ShouldThrowValidationException_WhenValidationFails()
    {
        // Arrange
        var command = new CreateTodoTaskCommand("Te", DateTime.Now.AddDays(1));

        var validationFailure = new ValidationFailure("TodoTaskName", "TODO must be at least 10 characters long.");
        var validationResult = new ValidationResult(new[] { validationFailure });

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("TODO must be at least 10 characters long.", exception.Errors.First().ErrorMessage);

        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<TodoTask>()), Times.Never);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldThrowValidationException_WhenTodoTaskNameIsNull()
    {
        // Arrange
        var command = new CreateTodoTaskCommand(null, DateTime.Now.AddDays(1));

        var validationFailure = new ValidationFailure("TodoTaskName", "TODO must have a name.");
        var validationResult = new ValidationResult(new[] { validationFailure });

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("TODO must have a name.", exception.Errors.First().ErrorMessage);

        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<TodoTask>()), Times.Never);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldThrowValidationException_WhenDeadlineIsInThePast()
    {
        // Arrange
        var command = new CreateTodoTaskCommand("Valid Task Name", DateTime.Now.AddDays(-1));

        var validationFailure = new ValidationFailure("Deadline", "Deadline must be in the future.");
        var validationResult = new ValidationResult(new[] { validationFailure });

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("Deadline must be in the future.", exception.Errors.First().ErrorMessage);

        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<TodoTask>()), Times.Never);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldAddTodoTask_WhenDeadlineIsMissing()
    {
        // Arrange
        var command = new CreateTodoTaskCommand("Task with no deadline", null);

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<TodoTask>()))
            .Callback<TodoTask>(task => task.TodoTaskId = 1)
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<TodoTask>()), Times.Once);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Once);
        Assert.True(result > 0);
    }

    [Fact]
    public async Task Handle_ShouldAddTodoTask_WhenTodoTaskNameIsMaxLength()
    {
        // Arrange
        var command = new CreateTodoTaskCommand(new string('a', 450), DateTime.Now.AddDays(1));

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<TodoTask>()))
            .Callback<TodoTask>(task => task.TodoTaskId = 1)
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<TodoTask>()), Times.Once);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Once);
        Assert.True(result > 0);
    }

    [Fact]
    public async Task Handle_ShouldThrowValidationException_WhenTodoTaskNameExceedsMaxLength()
    {
        // Arrange
        var command = new CreateTodoTaskCommand(new string('a', 451), DateTime.Now.AddDays(1));

        var validationFailure = new ValidationFailure("TodoTaskName", "TODO must not exceed 450 characters.");
        var validationResult = new ValidationResult(new[] { validationFailure });

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("TODO must not exceed 450 characters.", exception.Errors.First().ErrorMessage);

        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<TodoTask>()), Times.Never);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}