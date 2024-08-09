using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TodoTaskName",
                table: "TodoTasks",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Deadline",
                table: "TodoTasks",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<string>(
                name: "TodoTaskName",
                table: "TodoTasks",
                type: "nvarchar(200)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Deadline",
                table: "TodoTasks",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
