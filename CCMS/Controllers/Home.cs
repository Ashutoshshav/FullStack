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
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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
                // Parse input
                var imeiNo = requestData.TryGetProperty("IMEI_no", out var IMEI_noElement) ? IMEI_noElement.GetString() : null;
                var newStatus = requestData.TryGetProperty("Status", out var StatusElement) ? StatusElement.GetString() : null;
                var response = requestData.TryGetProperty("ResponseSts", out var ResponseStsElement) ? ResponseStsElement.GetString() : null;

                if (imeiNo == null || response == null)
                    return Json(new { success = false, message = "Invalid input." });

                // Check in cache first (if applicable)
                var imeiRecord = await context.IMEI_Master.FirstOrDefaultAsync(i => i.IMEI_no == imeiNo);

                if (imeiRecord != null)
                {
                    imeiRecord.Response = response;
                    await context.SaveChangesAsync();

                    // Return minimal response
                    return Json(new
                    {
                        success = true,
                        message = "Status updated successfully.",
                        data = new { imeiRecord.IMEI_no, imeiRecord.Status, imeiRecord.Response }
                    });
                }
                else
                {
                    return Json(new { success = false, message = "IMEI not found." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        //public async Task<IActionResult> UpdateIMEIStatus([FromBody] JsonElement requestData)
        //{
        //    try
        //    {
        //        var imeiNo = requestData.TryGetProperty("IMEI_no", out var IMEI_noElement)
        //            ? IMEI_noElement.GetString()
        //            : null;

        //        var newStatus = requestData.TryGetProperty("Status", out var StatusElement)
        //            ? StatusElement.GetString()
        //            : null;

        //        var Response = requestData.TryGetProperty("ResponseSts", out var ResponseStsElement)
        //            ? ResponseStsElement.GetString()
        //            : null;

        //        Console.WriteLine($"IMEI No: {imeiNo}");
        //        Console.WriteLine($"New Status: {newStatus}");
        //        Console.WriteLine($"Response: {Response}");

        //        // Find the record by IMEI_No
        //        var imeiRecord = await context.IMEI_Master.FirstOrDefaultAsync(i => i.IMEI_no == imeiNo);
        //        Console.WriteLine($"IMEI No: { imeiRecord}");
        //        if (imeiRecord != null)
        //        {
        //            //imeiRecord.Status = newStatus;
        //            imeiRecord.Response = Response; // Update the status
        //            await context.SaveChangesAsync(); // Save changes to the database

        //            // Return success response with the updated record
        //            return Json(new
        //            {
        //                success = true,
        //                message = "Status updated successfully.",
        //                data = imeiRecord // Send the updated record
        //            });
        //        }
        //        else
        //        {
        //            // Return error response if the IMEI is not found
        //            return Json(new { success = false, message = "IMEI not found." });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        // Handle exceptions and return an error response
        //        return Json(new { success = false, message = ex.Message });
        //    }
        //}

        [HttpGet]
        public IActionResult Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                ViewBag.Message = "Please enter a search query.";
                return View("Index");
            }

            // Perform the search across all columns
            var results = context.IMEI_Master
                .Where(row => EF.Functions.Like(row.IMEI_no, $"%{query}%") ||
                              EF.Functions.Like(row.Location, $"%{query}%") ||
                              EF.Functions.Like(row.Zone, $"%{query}%"))
                .ToList();

            return View("SearchResults", results);
        }

        [HttpGet]
        public async Task<IActionResult> UpdateStatus()
        {
            // Fetch necessary data upfront
            var networkData = await context.Network.ToListAsync();
            var networkStsData = await context.NetworkSts.FirstOrDefaultAsync(); // Assuming only one row is relevant
            var imeiData = await context.IMEI_Master.ToDictionaryAsync(im => im.IMEI_no); // Preload all IMEI records

            if (networkStsData == null)
            {
                return NotFound("NetworkSts data not found.");
            }

            var deviceOfflineThreshold = networkStsData.DeviceOffline;

            // Create a list to hold updated IMEI records
            var updatedIMEIs = new List<IMEI_Master>();

            foreach (var device in networkData)
            {
                if (imeiData.TryGetValue(device.IMEI_no, out var imeiRecord))
                {
                    // Update status based on condition
                    imeiRecord.Status = device.DUR > deviceOfflineThreshold ? "2" : "1";
                    updatedIMEIs.Add(imeiRecord);
                }
                else
                {
                    Console.WriteLine($"IMEI record not found for IMEI_no: {device.IMEI_no}");
                }
            }

            // Bulk update IMEI records
            context.IMEI_Master.UpdateRange(updatedIMEIs);
            await context.SaveChangesAsync();

            return Ok("Statuses updated successfully.");
        }

        //[HttpGet]
        //public async Task<IActionResult> updateStatus()
        //{
        //    // Fetch data from the NetworkSts table using the context
        //    var data1 = await context.NetworkSts.ToListAsync(); // Ensure NetworkSts is part of your DbContext

        //    // Fetch data from the Network table using the context
        //    var data = await context.Network.ToListAsync(); // Ensure Network is part of your DbContext

        //    Console.WriteLine($"NetworkSts Data: {data1}");
        //    Console.WriteLine($"Network Data: {data}");

        //    foreach (var device in data)
        //    {
        //        // Example of a change: set DeviceOffline to 0 if DeviceNA is greater than 1000
        //        if (device.DUR > data1[0].DeviceOffline)
        //        {
        //            // Find the record where IMEI_No is equal to imeiNo
        //            var imeiRecord = await context.IMEI_Master
        //                                          .FirstOrDefaultAsync(im => im.IMEI_no == device.IMEI_no);

        //            if (imeiRecord == null)
        //            {
        //                // If no record is found, return a NotFound result
        //                return NotFound("IMEI record not found.");
        //            }

        //            // Update the status
        //            imeiRecord.Status = "2";

        //            // Save changes to the database
        //            await context.SaveChangesAsync();
        //        } else
        //        {
        //            var imeiRecord = await context.IMEI_Master
        //                                          .FirstOrDefaultAsync(im => im.IMEI_no == device.IMEI_no);

        //            imeiRecord.Status = "1";

        //            await context.SaveChangesAsync();
        //        }
        //    }

        // Return the data as a JSON response
        //var responseData = new
        //    {
        //        NetworkSts = data1,
        //        Network = data
        //    };

        //    return Json(responseData);
        //}
    }
}
