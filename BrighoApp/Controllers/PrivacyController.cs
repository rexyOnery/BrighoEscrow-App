using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace BrighoApp.Controllers
{
    public class PrivacyController : Controller
    {
        //Added the contact, privacy, policy pages
        public IActionResult Index()
        {
            return View();
        }
    }
}
