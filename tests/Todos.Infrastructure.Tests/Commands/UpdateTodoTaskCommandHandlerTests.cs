using FluentValidation;
using MediatR;
using Moq;
using FluentValidation.Results;
using Todos.Application.Commands.Handlers;
using Todos.Application.Commands;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;
using Xunit;

namespace Todos.Application.Tests.Commands;

public class UpdateTodoTaskCommandHandlerTests
{
    private readonly Mock<ITodoTaskRepository> _repositoryMock;
    private readonly Mock<IValidator<TodoTask>> _validatorMock;
    private readonly UpdateTodoTaskCommandHandler _handler;

    public UpdateTodoTaskCommandHandlerTests()
    {
        _repositoryMock = new Mock<ITodoTaskRepository>();
        _validatorMock = new Mock<IValidator<TodoTask>>();
        _handler = new UpdateTodoTaskCommandHandler(_repositoryMock.Object, _validatorMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldUpdateTodoTask_WhenValidationPasses()
    {
        // Arrange
        var command = new UpdateTodoTaskCommand(1, "Updated Task", DateTime.Now.AddDays(1));

        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Existing Task",
            CreatedDate = DateTime.Now.AddDays(-2),
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Once);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Once);
        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenTaskIsNotFound()
    {
        // Arrange
        var command = new UpdateTodoTaskCommand(1, "Updated Task", DateTime.Now.AddDays(1)); ;

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((TodoTask)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));

        Assert.Equal($"TodoTask with ID {command.TodoTaskId} not found.", exception.Message);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenTaskIsAlreadyDeleted()
    {
        // Arrange
        var command = new UpdateTodoTaskCommand(1, "Updated Task", DateTime.Now.AddDays(1));

        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Existing Task",
            CreatedDate = DateTime.Now.AddDays(-2),
            DeletedDate = DateTime.Now.AddDays(-1)
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));

        Assert.Equal($"TodoTask with ID {command.TodoTaskId} has already deleted.", exception.Message);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldThrowValidationException_WhenValidationFails()
    {
        // Arrange
        var command = new UpdateTodoTaskCommand(1, "Invalid Task", DateTime.Now.AddDays(1));

        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Existing Task",
            CreatedDate = DateTime.Now.AddDays(-2),
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        var validationResult = new ValidationResult(new[]
        {
            new ValidationFailure("TodoTaskName", "Task name is invalid")
        });

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(command, CancellationToken.None));

        Assert.Equal("Validation failed: \r\n -- TodoTaskName: Task name is invalid Severity: Error", exception.Message);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldThrowArgumentException_WhenInvalidTaskIdIsProvided()
    {
        // Arrange
        var command = new UpdateTodoTaskCommand(0, "Updated Task", DateTime.Now.AddDays(1));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => _handler.Handle(command, CancellationToken.None));

        Assert.Equal("Invalid Task ID", exception.Message);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
        _validatorMock.Verify(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldUpdateLastModified_WhenTaskIsUpdated()
    {
        // Arrange
        var command = new UpdateTodoTaskCommand(1, "Updated Task", DateTime.Now.AddDays(1));

        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Existing Task",
            CreatedDate = DateTime.Now.AddDays(-2),
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.Is<TodoTask>(t => t.LastModified != null && t.LastModified > t.CreatedDate)), Times.Once);
        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenTaskNameIsNull()
    {
        // Arrange
        var command = new UpdateTodoTaskCommand(1, null, DateTime.Now.AddDays(1));

        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Existing Task",
            CreatedDate = DateTime.Now.AddDays(-2),
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        var validationResult = new ValidationResult(new[]
        {
            new ValidationFailure("TodoTaskName", "Task name cannot be null.")
        });

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(validationResult);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() => _handler.Handle(command, CancellationToken.None));

        Assert.Equal("Validation failed: \r\n -- TodoTaskName: Task name cannot be null. Severity: Error", exception.Message);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldCallValidateAsync_WithCorrectTask()
    {
        // Arrange
        var command = new UpdateTodoTaskCommand(1, "Updated Task", DateTime.Now.AddDays(1));

        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Existing Task",
            CreatedDate = DateTime.Now.AddDays(-2),
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        _validatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<TodoTask>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _validatorMock.Verify(v => v.ValidateAsync(It.Is<TodoTask>(t => t.TodoTaskName == "Updated Task" && t.Deadline == command.Deadline), It.IsAny<CancellationToken>()), Times.Once);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Once);
        Assert.Equal(Unit.Value, result);
    }
}