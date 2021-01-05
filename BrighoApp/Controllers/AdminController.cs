using BrighoApp.Models;
using BrighoApp.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrighoApp.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult LoginSelect()
        {
            return View();
        }

        public IActionResult Register()
        {
            return View();
        }

        public IActionResult Forgot()
        {
            return View();
        }

        public IActionResult Pin()
        {
            return View();
        }

        public IActionResult ResetPassword()
        {
            return View();
        }

        public async Task<bool> Login(Account account)
        {

            return await Server.Login<Account>(account);
        }

        public async Task<IEnumerable<Account>> ForgotPassword(string Username)
        { 
            return await Server.Forgot<Account>(Username);
        }

        public async Task<bool> FingerprintPhone(string Username)
        {
            return await Server.FingerprintPhone<Account>(Username);
        }

        public async Task<bool> ChangePassword(Account account)
        {
            return await Server.ChangePassword<Account>(account);
        }

        public async Task<ActionResult<IEnumerable<Account>>> RecoveryCode(string RecoveryCode)
        {
            Account account = new Account
            {
               RecoveryCode = RecoveryCode
            };
            return await Server.RecoveryCode<Account>(account.RecoveryCode);
        }

        public async Task<ActionResult<bool>> Reset(string Username, string Password)
        {
            Account account = new Account
            {
                Username = Username,
                Password = Password
            };
            return await Server.Reset<Account>(account);
        }

        public async Task<ActionResult<bool>> AddUser(string Username, string Password)
        {
            Account account = new Account
            {
                Username = Username,
                Password = Password
            };
            return await Server.AddUser<Account>(account);
        }
    }
}
