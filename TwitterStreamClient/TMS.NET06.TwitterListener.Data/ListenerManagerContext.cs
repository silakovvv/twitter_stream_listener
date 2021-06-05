using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using TMS.NET06.TwitterListener.Data.Models;

namespace TMS.NET06.TwitterListener.Data
{
    public class ListenerManagerContext : DbContext
    {
        private readonly string _connectionString;

        public ListenerManagerContext(DbContextOptions<ListenerManagerContext> options)
            : base(options)
        {
        }

        internal ListenerManagerContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(this._connectionString);
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ListenerTask>(taskBuilder =>
            {
                taskBuilder.HasKey(task => task.TaskId);
                taskBuilder.OwnsOne(task => task.TaskOptions);
                taskBuilder.Property(task => task.ListenerOptions)
                    .HasConversion(
                        options => JsonSerializer.Serialize(options, null),
                        options => JsonSerializer.Deserialize<ListenerOptions>(options, null));
            });

            modelBuilder.Entity<ListenerResult>()
                    .HasKey(result => result.ResultId);

            modelBuilder.Entity<ListenerResult>()
                    .HasOne(result => result.Task)
                    .WithMany(task => task.Results)
                    .HasForeignKey(result => result.TaskId);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<ListenerTask> ListenerTasks { get; set; }
        public DbSet<ListenerResult> ListenerResults { get; set; }
    }
}
