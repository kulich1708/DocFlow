using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DocFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class DeleteIdFromDocumentDraft : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Draft_CreatedAt",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "Draft_Id",
                table: "Documents");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Draft_CreatedAt",
                table: "Documents",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Draft_Id",
                table: "Documents",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
