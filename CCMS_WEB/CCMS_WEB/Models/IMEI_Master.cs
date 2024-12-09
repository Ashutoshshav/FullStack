using System.ComponentModel.DataAnnotations;

namespace CCMS_WEB.Models
{
    public class IMEI_Master
    {
        [Key]
        public string UID { get; set; }
        public string? IMEI_no { get; set; }
        public string? Status { get; set; }
        public string? Zone { get; set; }
        public string? Ward { get; set; }
        public string? Location { get; set; }
        public string? NoOfStreetlight { get; set; }
    }
}
