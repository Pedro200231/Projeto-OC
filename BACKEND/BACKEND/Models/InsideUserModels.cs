using BACKEND.Controllers;

namespace BACKEND.Models
{   public class UserIdRequest
    {
        public int UserId { get; set; }
    }
}

namespace BACKEND.Models
{
    public class InsideUser
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int? Idade { get; set; }
        public string? Email { get; set; }
        public string? Endereco { get; set; }
        public string? Status { get; set; }
        public string? Interesses { get; set; }
        public string? Curiosidades { get; set; }
        public string? Valores { get; set; }
        public DateTime DataCadastro { get; set; }

    }
}

namespace BACKEND.Models
{
    public class InsideRegisterRequest
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        public int? Idade { get; set; }
        public string? Email { get; set; }
        public string? Endereco { get; set; }
        public string? Status { get; set; }
        public string? Interesses { get; set; }
        public string? Curiosidades { get; set; }
        public string? Valores { get; set; }
        public DateTime DataCadastro { get; set; }
    }
}
namespace BACKEND.Models
{
    public class UserLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Action { get; set; }
        public string? TargetEmail { get; set; }
        public int InsideUserId { get; set; }
        public DateTime Timestamp { get; set; }
    }
}

namespace BACKEND.Models
{
    public class LogDetailsResponse
    {
        public string? BeforeData { get; set; }
        public string? AfterData { get; set; }
    }
}