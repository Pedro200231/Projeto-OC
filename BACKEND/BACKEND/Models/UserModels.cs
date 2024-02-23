using BACKEND.Controllers;

namespace BACKEND.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
        public List<InsideUser> InsideUsers { get; set; } = new List<InsideUser>();
    }
}

namespace BACKEND.Models
{
    public class UserLoginRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
    }
}

namespace BACKEND.Models
{
    public class UserRegisterRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; } 
        public string? Name { get; set; }
    }
}