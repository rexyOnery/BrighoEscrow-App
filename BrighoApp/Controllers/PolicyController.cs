using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrighoApp.Controllers
{
    public class PolicyController : Controller
    {
        //brigho return policy and terms
        public IActionResult Index()
        {
            return View();
        }
    }
}
