using Moq;
using Xunit;
using Todos.Application.Queries;
using Todos.Application.Queries.Handlers;
using Todos.Domain.Entities;
using Todos.Domain.Helpers;
using Todos.Domain.Interfaces;

namespace Todos.Application.Tests.Queries;

public class GetTodoTasksQueryHandlerTests
{
    private readonly Mock<ITodoTaskRepository> _repositoryMock;
    private readonly GetTodoTasksQueryHandler _handler;

    public GetTodoTasksQueryHandlerTests()
    {
        _repositoryMock = new Mock<ITodoTaskRepository>();
        _handler = new GetTodoTasksQueryHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnPaginatedList_WhenQueryIsValid()
    {
        // Arrange
        var query = new GetTodoTasksQuery
        {
            PageNumber = 1,
            PageSize = 10,
            IsDone = false,
            DeadlineFrom = DateTime.Now.AddDays(-7),
            DeadlineTo = DateTime.Now.AddDays(7),
            TodoTaskName = "Test",
            SortBy = "CreatedDate",
            SortDirection = "asc"
        };

        var paginatedList = new PaginatedList<TodoTask>(
            new List<TodoTask> { new TodoTask { TodoTaskId = 1, TodoTaskName = "Test Task" } },
            1, 1, 10);

        _repositoryMock
            .Setup(r => r.GetTodoTasksAsync(
                query.PageNumber,
                query.PageSize,
                query.IsDone,
                query.DeadlineFrom,
                query.DeadlineTo,
                query.TodoTaskName,
                query.SortBy,
                query.SortDirection))
            .ReturnsAsync(paginatedList);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Single(result.Items);
        Assert.Equal("Test Task", result.Items.First().TodoTaskName);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmptyList_WhenNoTasksFound()
    {
        // Arrange
        var query = new GetTodoTasksQuery
        {
            PageNumber = 1,
            PageSize = 10,
            IsDone = false
        };

        var emptyList = new PaginatedList<TodoTask>(new List<TodoTask>(), 0, 1, 10);

        _repositoryMock
            .Setup(r => r.GetTodoTasksAsync(
                query.PageNumber,
                query.PageSize,
                query.IsDone,
                query.DeadlineFrom,
                query.DeadlineTo,
                query.TodoTaskName,
                query.SortBy,
                query.SortDirection))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result.Items);
    }

    [Fact]
    public async Task Handle_ShouldThrowException_WhenRepositoryFails()
    {
        // Arrange
        var query = new GetTodoTasksQuery
        {
            PageNumber = 1,
            PageSize = 10
        };

        _repositoryMock
            .Setup(r => r.GetTodoTasksAsync(
                query.PageNumber,
                query.PageSize,
                query.IsDone,
                query.DeadlineFrom,
                query.DeadlineTo,
                query.TodoTaskName,
                query.SortBy,
                query.SortDirection))
            .ThrowsAsync(new Exception("Database failure"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _handler.Handle(query, CancellationToken.None));
    }
}