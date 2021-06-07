﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TMS.NET06.TwitterListener.Data;

namespace TMS.NET06.TwitterListener.Data.Migrations
{
    [DbContext(typeof(ListenerManagerContext))]
    partial class ListenerManagerContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.6")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("TMS.NET06.TwitterListener.Data.Models.ListenerResult", b =>
                {
                    b.Property<int>("ResultId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ResultInFormatJSON")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TaskId")
                        .HasColumnType("int");

                    b.HasKey("ResultId");

                    b.HasIndex("TaskId");

                    b.ToTable("ListenerResults");
                });

            modelBuilder.Entity("TMS.NET06.TwitterListener.Data.Models.ListenerTask", b =>
                {
                    b.Property<int>("TaskId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ListenerOptions")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("TaskId");

                    b.ToTable("ListenerTasks");
                });

            modelBuilder.Entity("TMS.NET06.TwitterListener.Data.Models.ListenerResult", b =>
                {
                    b.HasOne("TMS.NET06.TwitterListener.Data.Models.ListenerTask", "Task")
                        .WithMany("Results")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Task");
                });

            modelBuilder.Entity("TMS.NET06.TwitterListener.Data.Models.ListenerTask", b =>
                {
                    b.OwnsOne("TMS.NET06.TwitterListener.Data.Models.TaskOptions", "TaskOptions", b1 =>
                        {
                            b1.Property<int>("ListenerTaskTaskId")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("int")
                                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                            b1.Property<string>("CronSchedule")
                                .HasColumnType("nvarchar(max)");

                            b1.Property<int>("Duration")
                                .HasColumnType("int");

                            b1.Property<DateTime>("EndDate")
                                .HasColumnType("datetime2");

                            b1.Property<DateTime>("StartDate")
                                .HasColumnType("datetime2");

                            b1.HasKey("ListenerTaskTaskId");

                            b1.ToTable("ListenerTasks");

                            b1.WithOwner()
                                .HasForeignKey("ListenerTaskTaskId");
                        });

                    b.Navigation("TaskOptions");
                });

            modelBuilder.Entity("TMS.NET06.TwitterListener.Data.Models.ListenerTask", b =>
                {
                    b.Navigation("Results");
                });
#pragma warning restore 612, 618
        }
    }
}
