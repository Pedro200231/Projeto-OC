using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using BACKEND.Controllers;
using BACKEND.Repositories;
using BACKEND.Models;

namespace BACKEND.Repositories
{
    public class UserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ProjetoOC")!;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string sql = "SELECT * FROM Users";
                var users = await sqlConnection.QueryAsync<User>(sql);

                foreach (var user in users)
                {
                    const string insideUsersQuery = "SELECT * FROM InsideUsers WHERE UserID = @UserID";
                    var insideUsers = await sqlConnection.QueryAsync<InsideUser>(insideUsersQuery, new { UserID = user.UserID });
                    user.InsideUsers = insideUsers.ToList();
                }

                return users;
            }
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string sql = "SELECT * FROM Users WHERE Email = @Email";
                return await sqlConnection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
            }
        }

        public async Task<IEnumerable<InsideUser>> GetInsideUsersAsync(int userId)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string insideUsersQuery = "SELECT * FROM InsideUsers WHERE UserID = @UserID";
                return await sqlConnection.QueryAsync<InsideUser>(insideUsersQuery, new { UserID = userId });
            }
        }

        public async Task<int> CheckExistingEmailAsync(string email)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string checkEmailQuery = "SELECT COUNT(*) FROM Users WHERE Email = @Email";
                return await sqlConnection.ExecuteScalarAsync<int>(checkEmailQuery, new { Email = email });
            }
        }

        public async Task InsertUserAsync(string email, string hashPassword, string name)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                const string insertUserQuery = "INSERT INTO Users (Email, Password, Name) VALUES (@Email, @hashPassword, @Name)";
                await sqlConnection.ExecuteAsync(insertUserQuery, new { Email = email, hashPassword, Name = name });
            }
        }
    }
}

