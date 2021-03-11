using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrighoApp.Models
{
    public class Message
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string MessageBody { get; set; }
    }

    public class Reconcile
    {
        public string FullName { get; set; }
        public string BankName { get; set; }
        public string AccountName { get; set; }
        public string AccountNumber { get; set; }
        public string MobileNumber { get; set; }
        public string TransactionNumber { get; set; }
        public string TransactionDescription { get; set; }
        public string AgreedPrice { get; set; }
        public string TransactionDate { get; set; }
    }

    public class WebMessage
    {
        public string MessageContent { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string EmailAddress { get; set; }
    }
}
