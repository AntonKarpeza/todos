using MediatR;
using Moq;
using Todos.Application.Commands.Handlers;
using Todos.Application.Commands;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;
using Xunit;

namespace Todos.Application.Tests.Commands;

public class ToggleIsDoneTodoTaskCommandHandlerTests
{
    private readonly Mock<ITodoTaskRepository> _repositoryMock;
    private readonly ToggleIsDoneTodoTaskCommandHandler _handler;

    public ToggleIsDoneTodoTaskCommandHandlerTests()
    {
        _repositoryMock = new Mock<ITodoTaskRepository>();
        _handler = new ToggleIsDoneTodoTaskCommandHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldToggleIsDone_WhenTaskExists()
    {
        // Arrange
        var command = new ToggleIsDoneTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            IsDone = false,
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Once);
        _repositoryMock.Verify(r => r.UpdateAsync(It.Is<TodoTask>(t => t.IsDone == true)), Times.Once);
        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenTaskNotFound()
    {
        // Arrange
        var command = new ToggleIsDoneTodoTaskCommand(1);

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
    public async Task Handle_ShouldThrowArgumentException_WhenTaskIdIsInvalid()
    {
        // Arrange
        var command = new ToggleIsDoneTodoTaskCommand(0);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("Invalid Task ID", exception.Message);

        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Never);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldUpdateLastModified_WhenTaskIsToggled()
    {
        // Arrange
        var command = new ToggleIsDoneTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            IsDone = false,
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.Is<TodoTask>(t => t.LastModified.HasValue && t.LastModified.Value <= DateTime.Now)), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldToggleIsDoneBack_WhenTaskIsAlreadyDone()
    {
        // Arrange
        var command = new ToggleIsDoneTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            IsDone = true,
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.Is<TodoTask>(t => t.IsDone == false)), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldNotUpdateTask_WhenTaskIsAlreadyDeleted()
    {
        // Arrange
        var command = new ToggleIsDoneTodoTaskCommand(1);
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

        // Act
        await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldUpdateTaskEvenIfNoChangesMade()
    {
        // Arrange
        var command = new ToggleIsDoneTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            IsDone = true,
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        // Act
        await _handler.Handle(command, CancellationToken.None);
        await _handler.Handle(command, CancellationToken.None); // Toggle back

        // Assert
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<TodoTask>()), Times.Exactly(2));
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenRepositoryUpdateFails()
    {
        // Arrange
        var command = new ToggleIsDoneTodoTaskCommand(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            IsDone = false,
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        _repositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<TodoTask>()))
            .ThrowsAsync(new Exception("Repository Update Failed"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
        Assert.Equal("Repository Update Failed", exception.Message);
    }
}