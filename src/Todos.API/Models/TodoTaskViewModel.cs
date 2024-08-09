namespace Todos.API.Models;

public class TodoTaskViewModel
{
    public int TodoTaskId { get; set; }
    public string TodoTaskName { get; set; }
    public DateTime? Deadline { get; set; }
    public bool? IsDone { get; set; }
}