// InsideUserRepository.cs
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using BACKEND.Models;

namespace BACKEND.Repositories
{
    public class InsideUserRepository
    {
        private readonly string _connectionString;

        public InsideUserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ProjetoOC")!;
        }

        public async Task<IEnumerable<InsideUser>> GetInsideUsersAsync(int userId)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string insideUsersQuery = "SELECT * FROM InsideUsers WHERE UserID = @UserID AND Removed = 0";
                return await sqlConnection.QueryAsync<InsideUser>(insideUsersQuery, new { UserID = userId });
            }
        }

        public async Task<InsideUser> GetInsideUserByIdAsync(int id)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string insideUserQuery = "SELECT * FROM InsideUsers WHERE Id = @Id";
                return await sqlConnection.QueryFirstOrDefaultAsync<InsideUser>(insideUserQuery, new { Id = id });
            }
        }

        public async Task<InsideUser> GetInsideUserByIdAndUserIdAsync(int insideUserId, int UserId)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string insideUserQuery = "SELECT * FROM InsideUsers WHERE Id = @Id AND UserID = @UserId";
                return await sqlConnection.QueryFirstOrDefaultAsync<InsideUser>(insideUserQuery, new { Id = insideUserId, UserId = UserId });
            }
        }

        public async Task<IEnumerable<UserLog>> GetUserLogAsync(int userId)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string userLogQuery = @"
                    SELECT UserLog.*, InsideUsers.Email AS TargetEmail
                    FROM UserLog
                    INNER JOIN InsideUsers ON UserLog.InsideUserId = InsideUsers.Id
                    WHERE UserLog.UserId = @UserId
                    ORDER BY UserLog.Timestamp DESC";

                return await sqlConnection.QueryAsync<UserLog>(userLogQuery, new { UserId = userId });
            }
        }

        public async Task<LogDetailsResponse> GetUserLogDetailsAsync(int logId)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string logDetailsQuery = @"
                    SELECT BeforeData, AfterData
                    FROM UserLog
                    WHERE Id = @LogId";

                return await sqlConnection.QueryFirstOrDefaultAsync<LogDetailsResponse>(logDetailsQuery, new { LogId = logId });
            }
        }

        public async Task<int> InsertInsideUserAsync(InsideRegisterRequest request)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string emailCheckQuery = "SELECT COUNT(*) FROM InsideUsers WHERE Email = @Email AND Removed = 0";
                var emailExists = await sqlConnection.QueryFirstOrDefaultAsync<int>(emailCheckQuery, new { Email = request.Email });

                if (emailExists > 0)
                {
                    throw new InvalidOperationException("Email já cadastrado");
                }

                const string insertQuery = @"
                    INSERT INTO InsideUsers (UserID, Name, Idade, Email, Endereco, [Status], Interesses, Curiosidades, Valores, DataCadastro)
                    VALUES (@UserID, @Name, @Idade, @Email, @Endereco, @Status, @Interesses, @Curiosidades, @Valores, @DataCadastro);
                    SELECT SCOPE_IDENTITY();";

                return await sqlConnection.ExecuteScalarAsync<int>(insertQuery, new
                {
                    UserId = request.UserId,
                    Name = request.Name,
                    Idade = request.Idade,
                    Email = request.Email,
                    Endereco = request.Endereco,
                    Status = request.Status,
                    Interesses = request.Interesses,
                    Curiosidades = request.Curiosidades,
                    Valores = request.Valores,
                    DataCadastro = DateTime.Now
                });
            }
        }

        public async Task<bool> CheckUserExistsAndNotRemovedAsync(int id)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string userCheckQuery = "SELECT COUNT(*) FROM InsideUsers WHERE Id = @Id AND Removed = 0";
                var userExists = await sqlConnection.QueryFirstOrDefaultAsync<int>(userCheckQuery, new { Id = id });

                return userExists > 0;
            }
        }

        public async Task<bool> CheckEmailExistsAndNotRemovedAsync(string email, int id)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string userCheckQuery = "SELECT COUNT(*) FROM InsideUsers WHERE Email = @Email AND Removed = 0 AND Id <> @Id";
                var emailExists = await sqlConnection.QueryFirstOrDefaultAsync<int>(userCheckQuery, new { Email = email, Id = id });

                return emailExists > 0;
            }
        }

        public async Task RemoveInsideUserAsync(int id)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string updateQuery = "UPDATE InsideUsers SET Removed = 1 WHERE Id = @Id";
                await sqlConnection.ExecuteAsync(updateQuery, new { Id = id });
            }
        }

        public async Task UpdateInsideUserAsync(int id, InsideRegisterRequest request)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string updateQuery = @"
                    UPDATE InsideUsers
                    SET Name = @Name,
                        Status = @Status,
                        Email = @Email,
                        Endereco = @Endereco,
                        Idade = @Idade,
                        Interesses = @Interesses,
                        Curiosidades = @Curiosidades,
                        Valores = @Valores
                    WHERE Id = @Id";

                await sqlConnection.ExecuteAsync(updateQuery, new
                {
                    Id = id,
                    Name = request.Name,
                    Status = request.Status,
                    Email = request.Email,
                    Endereco = request.Endereco,
                    Idade = request.Idade,
                    Interesses = request.Interesses,
                    Curiosidades = request.Curiosidades,
                    Valores = request.Valores
                });
            }
        }

        public async Task InsertUserLogAsync(int userId, int insideUserId, string action)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string logInsertQuery = @"
                    INSERT INTO UserLog (UserId, InsideUserId, Action, Timestamp)
                    VALUES (@UserId, @InsideUserId, @Action, @Timestamp)";

                await sqlConnection.ExecuteAsync(logInsertQuery, new
                {
                    UserId = userId,
                    InsideUserId = insideUserId,
                    Action = action,
                    Timestamp = DateTime.Now
                });
            }
        }

        public async Task InsertUserLogWithDetailsAsync(int userId, int insideUserId, string action, InsideUser beforeData, InsideUser afterData)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string logInsertQuery = @"
                    INSERT INTO UserLog (UserId, InsideUserId, Action, Timestamp, BeforeData, AfterData)
                    VALUES (@UserId, @InsideUserId, @Action, @Timestamp, @BeforeData, @AfterData)";

                await sqlConnection.ExecuteAsync(logInsertQuery, new
                {
                    UserId = userId,
                    InsideUserId = insideUserId,
                    Action = action,
                    Timestamp = DateTime.Now,
                    BeforeData = JsonConvert.SerializeObject(beforeData),
                    AfterData = JsonConvert.SerializeObject(afterData)
                });
            }
        }

        public async Task<(int UserId, string Email)> GetUserInfoByIdAsync(int insideUserId)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string getUserInfoQuery = @"
                    SELECT UserId, Email
                    FROM InsideUsers
                    WHERE Id = @InsideUserId";

                return await sqlConnection.QueryFirstOrDefaultAsync<(int UserId, string Email)>(getUserInfoQuery, new { InsideUserId = insideUserId });
            }
        }
    }
}
