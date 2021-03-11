using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrighoApp.Controllers
{
    public class SellerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult NewTransaction()
        {
            return View();
        }

        public IActionResult TransactionDetail()
        {
            return View();
        }

        public IActionResult Payment()
        {
            return View();
        }

        public IActionResult Status()
        {
            return View();
        }
    }
}
