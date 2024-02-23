using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BACKEND.Repositories;
using BACKEND.Models; 


namespace BACKEND.AuthServices
{
    public class AuthService
    {
        private readonly UserRepository _userRepository;

        public AuthService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IActionResult> AuthenticateAsync(UserLoginRequest request)
        {
            var user = await _userRepository.GetUserByEmailAsync(request.Email!);

            if (user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                var insideUsers = await _userRepository.GetInsideUsersAsync(user.UserID);

                var responseData = new
                {
                    token = "seu_token_de_autenticacao",
                    userId = user.UserID,
                    name = user.Name,
                    insideUsers = insideUsers.ToList()
                };

                return new OkObjectResult(responseData);
            }

            return new UnauthorizedObjectResult(new { message = "Credenciais inválidas" });
        }

        public async Task<IActionResult> RegisterAsync(UserRegisterRequest request)
        {
            var emailExists = await _userRepository.CheckExistingEmailAsync(request.Email!);

            if (emailExists > 0)
            {
                return new ConflictObjectResult(new { message = "Email já cadastrado" });
            }

            string hashPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            await _userRepository.InsertUserAsync(request.Email!, hashPassword, request.Name!);

            var responseData = new
            {
                token = "seu_token_de_autenticacao",
            };

            return new OkObjectResult(responseData);
        }
    }
}
