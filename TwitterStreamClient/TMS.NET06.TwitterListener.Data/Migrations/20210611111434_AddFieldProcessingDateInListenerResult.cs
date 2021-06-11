using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TMS.NET06.TwitterListener.Data.Migrations
{
    public partial class AddFieldProcessingDateInListenerResult : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ProcessingDate",
                table: "ListenerResults",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProcessingDate",
                table: "ListenerResults");
        }
    }
}
