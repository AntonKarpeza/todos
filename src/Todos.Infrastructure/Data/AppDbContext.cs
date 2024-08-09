using Microsoft.EntityFrameworkCore;
using Todos.Domain.Entities;

namespace Todos.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<TodoTask> TodoTasks { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}