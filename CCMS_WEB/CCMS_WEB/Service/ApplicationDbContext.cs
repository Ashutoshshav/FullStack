using CCMS_WEB.Models;
using Microsoft.EntityFrameworkCore;

namespace CCMS_WEB.Service
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IMEI_Master>()
            .HasKey(e => e.UID);
        }

        public DbSet<Zone_master> Zone_master { get; set; }
        public DbSet<VisLive> VisLive { get; set; }
        public DbSet<IMEI_Master> IMEI_Master { get; set; }
        public DbSet<Login_Master> Login_Master { get; set; }
    }
}
