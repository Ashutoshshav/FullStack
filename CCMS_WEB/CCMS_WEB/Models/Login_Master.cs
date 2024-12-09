using System.ComponentModel.DataAnnotations;

namespace CCMS_WEB.Models
{
    public class Login_Master
    {
        [Key]
        public string User_Name { get; set; }
        public string Password { get; set; }
    }
}
