using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models;

public partial class QAdbContext : DbContext
{
    public QAdbContext()
    {
    }

    public QAdbContext(DbContextOptions<QAdbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AccordionCategory> AccordionCategory { get; set; }

    public virtual DbSet<QAPair> QAPair { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccordionCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Accordio__3214EC0788023D0F");

            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<QAPair>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QAPair__3214EC07A015130D");

            entity.Property(e => e.Answer).HasMaxLength(500);
            entity.Property(e => e.Question).HasMaxLength(200);

            entity.HasOne(d => d.Category).WithMany(p => p.QAPair)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QAPair_Category");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
