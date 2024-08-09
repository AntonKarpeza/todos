using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Todos.Application.Commands;
using Todos.Application.Commands.Handlers;
using Todos.Application.Queries;
using Todos.Application.Queries.Handlers;
using Todos.Domain.Entities;
using Todos.Domain.Helpers;
using Todos.Domain.Interfaces;
using Todos.Infrastructure.Repositories;

namespace Todos.Infrastructure.IoC;

public class NativeInjectorBootStrapper
{
    public static void RegisterServices(IServiceCollection services)
    {
        // Register repositories
        services.AddScoped<ITodoTaskRepository, TodoTaskRepository>();

        // Register MediatR Commands
        services.AddTransient<IRequestHandler<CreateTodoTaskCommand, int>, CreateTodoTaskCommandHandler>();
        services.AddTransient<IRequestHandler<DeleteTodoTaskCommand, Unit>, DeleteTodoTaskCommandHandler>();
        services.AddTransient<IRequestHandler<ToggleIsDoneTodoTaskCommand, Unit>, ToggleIsDoneTodoTaskCommandHandler>();
        services.AddTransient<IRequestHandler<UpdateTodoTaskCommand, Unit>, UpdateTodoTaskCommandHandler>();

        // Register MediatR Queries
        services.AddTransient<IRequestHandler<GetTodoTasksQuery, PaginatedList<TodoTask>>, GetTodoTasksQueryHandler>();
        services.AddTransient<IRequestHandler<GetTodoTaskByIdQuery, TodoTask?>, GetTodoTaskByIdQueryHandler>();
    }
}