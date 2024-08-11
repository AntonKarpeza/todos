using Moq;
using Todos.Application.Queries.Handlers;
using Todos.Application.Queries;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;
using Xunit;

namespace Todos.Application.Tests.Queries;

public class GetTodoTaskByIdQueryHandlerTests
{
    private readonly Mock<ITodoTaskRepository> _repositoryMock;
    private readonly GetTodoTaskByIdQueryHandler _handler;

    public GetTodoTaskByIdQueryHandlerTests()
    {
        _repositoryMock = new Mock<ITodoTaskRepository>();
        _handler = new GetTodoTaskByIdQueryHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnTodoTask_WhenTaskExists()
    {
        // Arrange
        var query = new GetTodoTaskByIdQuery(1);
        var expectedTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            CreatedDate = DateTime.Now
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(expectedTask);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedTask.TodoTaskId, result.TodoTaskId);
        Assert.Equal(expectedTask.TodoTaskName, result.TodoTaskName);
        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenTaskDoesNotExist()
    {
        // Arrange
        var query = new GetTodoTaskByIdQuery(1);

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((TodoTask?)null);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Null(result);
        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldThrowArgumentException_WhenTaskIdIsInvalid()
    {
        // Arrange
        var query = new GetTodoTaskByIdQuery(0);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _handler.Handle(query, CancellationToken.None));

        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenTaskIsDeleted()
    {
        // Arrange
        var query = new GetTodoTaskByIdQuery(1);
        var deletedTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Deleted Task",
            CreatedDate = DateTime.Now.AddDays(-2),
            DeletedDate = DateTime.Now.AddDays(-1)
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(deletedTask);

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _handler.Handle(query, CancellationToken.None));

        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldReturnTask_WhenTaskIsNotDeleted()
    {
        // Arrange
        var query = new GetTodoTaskByIdQuery(1);
        var existingTask = new TodoTask
        {
            TodoTaskId = 1,
            TodoTaskName = "Test Task",
            CreatedDate = DateTime.Now,
            DeletedDate = null
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(existingTask);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(existingTask.TodoTaskId, result?.TodoTaskId);
        Assert.Equal(existingTask.TodoTaskName, result?.TodoTaskName);
        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Once);
    }
}