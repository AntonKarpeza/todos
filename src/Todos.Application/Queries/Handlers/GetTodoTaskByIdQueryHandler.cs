﻿using MediatR;
using Todos.Domain.Entities;
using Todos.Domain.Interfaces;

namespace Todos.Application.Queries.Handlers;

public class GetTodoTaskByIdQueryHandler : IRequestHandler<GetTodoTaskByIdQuery, TodoTask?>
{
    private readonly ITodoTaskRepository _repository;

    public GetTodoTaskByIdQueryHandler(ITodoTaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<TodoTask?> Handle(GetTodoTaskByIdQuery request, CancellationToken cancellationToken)
    {
        if (request.TodoTaskId == 0)
        {
            throw new ArgumentException("Invalid Task ID");
        }

        return await _repository.GetByIdAsync(request.TodoTaskId);
    }
}