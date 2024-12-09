using CCMS_WEB.Service;
using CCMS_WEB.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace CCMS_WEB.Controllers
{
    public class Home : Controller
    {
        private readonly ApplicationDbContext context;
        private readonly IConfiguration _configuration;

        public Home(ApplicationDbContext context, IConfiguration configuration)
        {
            this.context = context;
            _configuration = configuration;
        }

        public async Task<IActionResult> Index()
        {
            var wards = await context.Zone_master
                                     .Where(w => !string.IsNullOrEmpty(w.Ward))
                                     .Select(w => new { w.RecordID, w.Ward })
                                     .Distinct()
                                     .ToListAsync();

            ViewBag.Wards = wards;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
