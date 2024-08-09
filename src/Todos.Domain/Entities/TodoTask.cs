using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Todos.Domain.Entities;

[Index(nameof(TodoTaskName), nameof(DeletedDate), Name = "Index_TodoTaskName_DeletedDate")]
[Index(nameof(Deadline), nameof(DeletedDate), Name = "Index_Deadline_DeletedDate")]
[Index(nameof(TodoTaskName), nameof(Deadline), nameof(DeletedDate), Name = "Index_TodoTaskName_Deadline_DeletedDate")]
public class TodoTask
{
    [Key]
    public int TodoTaskId { get; set; }
    public string TodoTaskName { get; set; }
    public DateTime? Deadline { get; set; }
    public bool IsDone { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? DeletedDate { get; set; }
    public DateTime? LastModified { get; set; }
}