using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TMS.NET06.TwitterListener.Data.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ListenerTasks",
                columns: table => new
                {
                    TaskId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ListenerOptions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaskOptions_StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TaskOptions_EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TaskOptions_Duration = table.Column<int>(type: "int", nullable: true),
                    TaskOptions_CronSchedule = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListenerTasks", x => x.TaskId);
                });

            migrationBuilder.CreateTable(
                name: "ListenerResults",
                columns: table => new
                {
                    ResultId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaskId = table.Column<int>(type: "int", nullable: false),
                    ResultInFormatJSON = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListenerResults", x => x.ResultId);
                    table.ForeignKey(
                        name: "FK_ListenerResults_ListenerTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "ListenerTasks",
                        principalColumn: "TaskId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListenerResults_TaskId",
                table: "ListenerResults",
                column: "TaskId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListenerResults");

            migrationBuilder.DropTable(
                name: "ListenerTasks");
        }
    }
}
