using Moq;
using Xunit;
using Todos.Domain.Interfaces;
using Todos.Application.Commands;
using Todos.Application.Commands.Handlers;
using Todos.Domain.Entities;
using MediatR;

namespace Todos.Application.Tests.Commands;

public class DeleteTodoTaskCommandHandlerTests
{
    private readonly Mock<ITodoTaskRepository> _repositoryMock;
    private readonly DeleteTodoTaskCommandHandler _handler;

    public DeleteTodoTaskCommandHandlerTests()
    {
        _repositoryMock = new Mock<ITodoTaskRepository>();
        _handler = new DeleteTodoTaskCommandHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldDeleteTodoTask_WhenTaskExistsAndIsNotDeleted()
    {
        // Arrange
        var command = new DeleteTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        _repositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<TodoTask>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.Is<TodoTask>(t => t.DeletedDate != null)), Times.Once);
        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenTodoTaskIdIsZero()
    {
        // Arrange
        var command = new DeleteTodoTaskCommand(0);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _handler.Handle(command, CancellationToken.None));

        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Never);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenTaskDoesNotExist()
    {
        // Arrange
        var command = new DeleteTodoTaskCommand(1);

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((TodoTask)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("TodoTask with ID 1 not found.", exception.Message);

        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Once);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenTaskIsAlreadyDeleted()
    {
        // Arrange
        var command = new DeleteTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            CreatedDate = DateTime.Now,
            DeletedDate = DateTime.Now.AddDays(-1)
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("TodoTask with ID 1 has already deleted.", exception.Message);

        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldSetCorrectDeletedDate_WhenTaskIsDeleted()
    {
        // Arrange
        var command = new DeleteTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.Is<TodoTask>(t => t.DeletedDate.HasValue && t.DeletedDate.Value <= DateTime.Now)), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldNotDelete_WhenRepositoryThrowsException()
    {
        // Arrange
        var command = new DeleteTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        _repositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<TodoTask>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("Database error", exception.Message);

        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Once);
    }


    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenTaskIsDeletedSuccessfully()
    {
        // Arrange
        var command = new DeleteTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        _repositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<TodoTask>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(Unit.Value, result);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldThrowArgumentException_WhenTaskIdIsNegative()
    {
        // Arrange
        var command = new DeleteTodoTaskCommand(-1);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("Invalid Task ID", exception.Message);

        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Never);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }
}