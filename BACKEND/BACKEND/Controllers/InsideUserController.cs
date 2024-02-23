// InsideUserController.cs
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using BACKEND.Repositories;
using BACKEND.Models;
using System.Data.SqlClient;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InsideUserController : ControllerBase
    {
        private readonly InsideUserRepository _insideUserRepository;

        public InsideUserController(IConfiguration configuration)
        {
            _insideUserRepository = new InsideUserRepository(configuration);
        }

        [HttpGet("GetInsideUsersById/{userId}")]
        public async Task<ActionResult<IEnumerable<InsideUser>>> GetInsideUsers(int userId)
        {
            try
            {
                var insideUsers = await _insideUserRepository.GetInsideUsersAsync(userId);
                return Ok(insideUsers);
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpGet("GetInsideUsersID")]
        public async Task<IActionResult> GetInsideUsersID(int insideUserId, int UserId)
        {
            try
            {
                var insideUser = await _insideUserRepository.GetInsideUserByIdAndUserIdAsync(insideUserId, UserId);

                if (insideUser != null)
                {
                    return Ok(new
                    {
                        Id = insideUser.Id,
                        Name = insideUser.Name,
                        Idade = insideUser.Idade,
                        Email = insideUser.Email,
                        Endereco = insideUser.Endereco,
                        Status = insideUser.Status,
                        Interesses = insideUser.Interesses,
                        Curiosidades = insideUser.Curiosidades,
                        Valores = insideUser.Valores,
                    });
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpGet("GetInsideUsers/{id}")]
        public async Task<ActionResult> GetInsideUsersByID(int id)
        {
            try
            {
                var insideUser = await _insideUserRepository.GetInsideUserByIdAsync(id);

                if (insideUser != null)
                {
                    return Ok(insideUser);
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpGet("userlog/{userId}")]
        public async Task<ActionResult<IEnumerable<UserLog>>> GetUserLog(int userId)
        {
            try
            {
                var userLog = await _insideUserRepository.GetUserLogAsync(userId);
                return Ok(userLog);
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpGet("UserLog/details/{logId}")]
        public async Task<IActionResult> GetUserLogDetails(int logId)
        {
            try
            {
                var logDetails = await _insideUserRepository.GetUserLogDetailsAsync(logId);

                if (logDetails != default)
                {
                    return Ok(logDetails);
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPost("insideregister")]
        public async Task<IActionResult> Inside([FromBody] InsideRegisterRequest request)
        {
            try
            {
                var newInsideUserId = await _insideUserRepository.InsertInsideUserAsync(request);
                var userInfo = await _insideUserRepository.GetUserInfoByIdAsync(newInsideUserId);
                await _insideUserRepository.InsertUserLogAsync(userInfo.UserId, newInsideUserId, "Usuário Criado");

                var responseData = new
                {
                    Id = newInsideUserId,
                    Name = request.Name,
                    Idade = request.Idade,
                    Email = request.Email,
                    Endereco = request.Endereco,
                    Status = request.Status,
                    Interesses = request.Interesses,
                    Curiosidades = request.Curiosidades,
                    Valores = request.Valores
                };

                return Ok(responseData);
            }
            catch
            {
                return StatusCode(500, new { message = "Email já cadastrado!!" });
            }
        }

        [HttpDelete("insideregister/{id}")]
        public async Task<IActionResult> DeleteInsideUser(int id)
        {
            try
            {
                var userExists = await _insideUserRepository.CheckUserExistsAndNotRemovedAsync(id);

                if (!userExists)
                {
                    return NotFound(new { message = "Usuário não encontrado ou já removido." });
                }

                var userInfo = await _insideUserRepository.GetUserInfoByIdAsync(id);
                await _insideUserRepository.RemoveInsideUserAsync(id);
                await _insideUserRepository.InsertUserLogAsync(userInfo.UserId, id, "Usuário Removido");

                return Ok(new { message = "Usuário marcado como removido com sucesso." });
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPut("insideregister/{id}")]
        public async Task<IActionResult> UpdateInsideUser(int id, [FromBody] InsideRegisterRequest request)
        {
            try
            {
                var userExists = await _insideUserRepository.CheckUserExistsAndNotRemovedAsync(id);

                if (!userExists)
                {
                    return NotFound(new { message = "Usuário não encontrado ou já removido." });
                }

                var emailExists = await _insideUserRepository.CheckEmailExistsAndNotRemovedAsync(request.Email, id);

                if (emailExists)
                {
                    return BadRequest(new { message = "Já existe um usuário cadastrado com esse email." });
                }


                var beforeUpdateUser = await _insideUserRepository.GetInsideUserByIdAsync(id);
                await _insideUserRepository.UpdateInsideUserAsync(id, request);
                var afterUpdateUser = await _insideUserRepository.GetInsideUserByIdAsync(id);
                var userInfo = await _insideUserRepository.GetUserInfoByIdAsync(id);

                await _insideUserRepository.InsertUserLogWithDetailsAsync(userInfo.UserId, id, "Usuário Atualizado", beforeUpdateUser, afterUpdateUser);

                var updatedUser = await _insideUserRepository.GetInsideUserByIdAsync(id);

                return Ok(new
                {
                    Id = updatedUser?.Id,
                    Name = updatedUser?.Name,
                    Idade = updatedUser?.Idade,
                    Endereco = updatedUser?.Endereco,
                    Status = updatedUser?.Status,
                    Email = updatedUser!.Email,
                    Interesses = updatedUser?.Interesses,
                    Curiosidades = updatedUser?.Curiosidades,
                    Valores = updatedUser?.Valores
                });
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}
