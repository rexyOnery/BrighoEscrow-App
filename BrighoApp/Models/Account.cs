using System;
using System.Collections.Generic;

#nullable disable

namespace BrighoApp.Models
{
    public partial class Account
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string RecoveryCode { get; set; }
        public string UserType { get; set; }
    }
}
