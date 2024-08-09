using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "Index_Deadline",
                table: "TodoTasks");

            migrationBuilder.DropIndex(
                name: "Index_TodoTaskName",
                table: "TodoTasks");

            migrationBuilder.DropIndex(
                name: "Index_TodoTaskName_Deadline",
                table: "TodoTasks");

            migrationBuilder.CreateIndex(
                name: "Index_Deadline_DeletedDate",
                table: "TodoTasks",
                columns: new[] { "Deadline", "DeletedDate" });

            migrationBuilder.CreateIndex(
                name: "Index_TodoTaskName_Deadline_DeletedDate",
                table: "TodoTasks",
                columns: new[] { "TodoTaskName", "Deadline", "DeletedDate" });

            migrationBuilder.CreateIndex(
                name: "Index_TodoTaskName_DeletedDate",
                table: "TodoTasks",
                columns: new[] { "TodoTaskName", "DeletedDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "Index_Deadline_DeletedDate",
                table: "TodoTasks");

            migrationBuilder.DropIndex(
                name: "Index_TodoTaskName_Deadline_DeletedDate",
                table: "TodoTasks");

            migrationBuilder.DropIndex(
                name: "Index_TodoTaskName_DeletedDate",
                table: "TodoTasks");

            migrationBuilder.CreateIndex(
                name: "Index_Deadline",
                table: "TodoTasks",
                column: "Deadline");

            migrationBuilder.CreateIndex(
                name: "Index_TodoTaskName",
                table: "TodoTasks",
                column: "TodoTaskName");

            migrationBuilder.CreateIndex(
                name: "Index_TodoTaskName_Deadline",
                table: "TodoTasks",
                columns: new[] { "TodoTaskName", "Deadline" });
        }
    }
}
