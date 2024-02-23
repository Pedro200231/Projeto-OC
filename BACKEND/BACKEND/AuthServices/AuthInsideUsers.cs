// AuthInsideUsers.cs
using Microsoft.AspNetCore.Mvc;
using BACKEND.Models;
using BACKEND.Repositories;
using System.Data.SqlClient;
using Dapper;

namespace BACKEND.AuthServices
{
    public class AuthInsideUsers
    {
        private readonly InsideUserRepository _insideUserRepository;

        public AuthInsideUsers(InsideUserRepository insideUserRepository)
        {
            _insideUserRepository = insideUserRepository;
        }

        public async Task<IActionResult> RegisterAsync(InsideRegisterRequest request)
        {
            try
            {
                using(var sqlConnection = new SqlConnection("sua_string_de_conexao"))
                {
                    const string emailCheckQuery = "SELECT COUNT(*) FROM InsideUsers WHERE Email = @Email AND Removed = 0";
                    var emailExists = await sqlConnection.QueryFirstOrDefaultAsync<int>(emailCheckQuery, new { Email = request.Email });

                    if (emailExists > 0)
                    {
                        return new ConflictObjectResult(new { message = "Email já cadastrado" });
                    }
                }

                var insideUserId = await _insideUserRepository.InsertInsideUserAsync(request);

                var responseData = new
                {
                    token = "seu_token_de_autenticacao",
                    insideUserId = insideUserId
                };

                return new OkObjectResult(responseData);
            }
            catch 
            {
                return new StatusCodeResult(500);
            }
        }
    }
}
