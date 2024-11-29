using System.Linq;
using CCMS.Models;
using CCMS.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using static System.Runtime.InteropServices.JavaScript.JSType;
using CCMS.CustomModel;
using System.Text.Json;

namespace CCMS.Controllers
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

        // Action to display the view
        [Authorize]
        public async Task<IActionResult> Index()
        {
            var wards = await context.Zone_master
                                     .Where(w => !string.IsNullOrEmpty(w.Ward))
                                     .Select(w => new { w.RecordID, w.Ward })
                                     .Distinct()
                                     .ToListAsync();

            var model = new ZoneWardViewModel
            {
                Wards = new SelectList(wards, "RecordID", "Ward")
            };

            return View(model);
        }

        // Action to fetch wards based on selected zone
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetWardsByZone(string zoneIds)
        {
            var zoneIdList = zoneIds;

            // Fetch wards where Zone matches any of the zoneIds
            Console.WriteLine(zoneIdList);
            if(zoneIdList != null)
            {
                var wards = await context.Zone_master
                                          .Where(w => zoneIdList.Contains(w.Zone) && !string.IsNullOrEmpty(w.Ward))
                                          .Select(w => new { w.RecordID, w.Ward })
                                          .ToListAsync();
                return Json(wards); // Return the result as JSON for AJAX
            } else
            {
                var wards = await context.Zone_master
                                     .Where(w => !string.IsNullOrEmpty(w.Ward))
                                     .Select(w => new { w.RecordID, w.Ward })
                                     .Distinct()
                                     .ToListAsync();
                return Json(wards); // Return the result as JSON for AJAX
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> DeviceData(string IMEI)
        {
            var Data = await context.VisLive
                                         .Where(w => w.IMEI_no == IMEI)
                                         .FirstOrDefaultAsync();

            var deviceData = await context.IMEI_Master
                                         .Where(w => w.IMEI_no == IMEI)
                                         .FirstOrDefaultAsync();

            var alldata = new DataModel
            {
                visLive_s = Data,
                IMEI_Master_s = deviceData
            };

            Console.WriteLine($"IMEI: {IMEI}");
            Console.WriteLine($"IMEI: {deviceData}");

            //var result = Tuple.Create(Data, deviceData);

            return View(alldata);
        }

        [Authorize]
        public async Task<IActionResult> IMEIs()
        {
            var data = await context.IMEI_Master.ToListAsync();
            return Json(data);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> filterDeveices([FromBody] JsonElement requestData)
        {
            try
            {
                var zones = requestData.TryGetProperty("zones", out var zonesElement) && zonesElement.ValueKind == JsonValueKind.Array
                    ? zonesElement.EnumerateArray().Select(x => x.ToString()).ToList()
                    : null;

                var wards = requestData.TryGetProperty("wards", out var wardsElement) && wardsElement.ValueKind == JsonValueKind.Array
                    ? wardsElement.EnumerateArray().Select(x => x.ToString()).ToList()
                    : null;

                var status = requestData.TryGetProperty("status", out var statusElement) && statusElement.ValueKind == JsonValueKind.Array
                    ? statusElement.EnumerateArray().Select(x => x.ToString()).ToList()
                    : null;

                Console.WriteLine(zones);
                Console.WriteLine(wards);
                Console.WriteLine(status);

                // Query the Devices table with conditional filtering
                var devicesQuery = context.IMEI_Master.AsQueryable();

                // If zones is not null, filter by zones
                if (zones != null && zones.Any())
                {
                    devicesQuery = devicesQuery.Where(d => zones.Contains(d.Zone));
                }

                // If wards is not null, filter by wards
                if (wards != null && wards.Any())
                {
                    devicesQuery = devicesQuery.Where(d => wards.Contains(d.Ward));
                }

                // If wards is not null, filter by wards
                if (status != null && status.Any())
                {
                    devicesQuery = devicesQuery.Where(d => status.Contains(d.Status));
                }

                // Execute the query
                var devices = await devicesQuery
                    .Select(d => new { d.IMEI_no, d.Location, d.Status, d.Zone, d.Ward })
                    .ToListAsync();

                Console.WriteLine(devices);
                return Json(devices);
                //// Query the Devices table
                //var devices = await context.IMEI_Master
                //    .Where(d => (zones == null || zones.Contains(d.Zone)) &&
                //                (wards == null || wards.Contains(d.Ward)))
                //    .Select(d => new { d.IMEI_no, d.Location, d.Status, d.Zone, d.Ward })
                //    .ToListAsync();

                //Console.WriteLine(devices);
                //return Json(devices);
            }
            catch (Exception ex) 
            {
                // Log the error for debugging
                Console.WriteLine($"Error: {ex.Message}");

                // Return a simplified error response
                return StatusCode(500, new
                {
                    Message = "An error occurred while processing the request.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpdateIMEIStatus([FromBody] JsonElement requestData)
        {
            try
            {
                var imeiNo = requestData.TryGetProperty("IMEI_no", out var IMEI_noElement)
                    ? IMEI_noElement.GetString()
                    : null;

                var newStatus = requestData.TryGetProperty("Status", out var StatusElement)
                    ? StatusElement.GetString()
                    : null;

                //Console.WriteLine($"IMEI No: {imeiNo}");
                //Console.WriteLine($"New Status: {newStatus}");

                // Find the record by IMEI_No
                var imeiRecord = await context.IMEI_Master.FirstOrDefaultAsync(i => i.IMEI_no == imeiNo);
                Console.WriteLine($"IMEI No: { imeiRecord}");
                if (imeiRecord != null)
                {
                    imeiRecord.Status = newStatus; // Update the status
                    await context.SaveChangesAsync(); // Save changes to the database

                    // Return success response with the updated record
                    return Json(new
                    {
                        success = true,
                        message = "Status updated successfully.",
                        data = imeiRecord // Send the updated record
                    });
                }
                else
                {
                    // Return error response if the IMEI is not found
                    return Json(new { success = false, message = "IMEI not found." });
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions and return an error response
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
