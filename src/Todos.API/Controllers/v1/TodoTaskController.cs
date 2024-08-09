using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Todos.Application.Commands;
using Todos.Application.Queries;
using Todos.API.Models;
using AutoMapper;

namespace Todos.API.Controllers.v1;

[ApiController]
[Route("v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class TodoTaskController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public TodoTaskController(IMediator mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedListViewModel<TodoTaskViewModel>>> GetTodoTasks([FromQuery] FilterTodoTasksViewModel filter)
    {
        var query = _mapper.Map<GetTodoTasksQuery>(filter);
        var todoTasks = await _mediator.Send(query);
        var result = _mapper.Map<PaginatedListViewModel<TodoTaskViewModel>>(todoTasks);
        return Ok(result);
    }

    [HttpGet("{todoTaskId}")]
    public async Task<ActionResult<TodoTaskViewModel>> GetTodoTask(int todoTaskId)
    {
        var todoTask = await _mediator.Send(new GetTodoTaskByIdQuery(todoTaskId));
        if (todoTask.TodoTaskId == 0)
        {
            return NotFound();
        }
        var todoTaskViewModel = _mapper.Map<TodoTaskViewModel>(todoTask);
        return Ok(todoTaskViewModel);
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateTodoTask(TodoTaskViewModel todoTask)
    {
        var todoTaskId = await _mediator.Send(new CreateTodoTaskCommand(todoTask.TodoTaskName, todoTask.Deadline));
        return Ok(todoTaskId);
    }

    [HttpDelete("{todoTaskId}")]
    public async Task<IActionResult> DeleteTodoTask(int todoTaskId)
    {
        await _mediator.Send(new DeleteTodoTaskCommand(todoTaskId));
        return NoContent();
    }

    [HttpPatch("{todoTaskId}/status")]
    public async Task<IActionResult> ToggleIsDoneTodoTask(int todoTaskId)
    {
        await _mediator.Send(new ToggleIsDoneTodoTaskCommand(todoTaskId));
        return NoContent();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTodoTask(TodoTaskViewModel todoTask)
    {
        if (todoTask.TodoTaskId == 0)
        {
            return BadRequest();
        }

        await _mediator.Send(new UpdateTodoTaskCommand(todoTask.TodoTaskId, todoTask.TodoTaskName, todoTask.Deadline));
        return NoContent();
    }
}