using BrighoApp.Models;
using BrighoApp.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BrighoApp.Controllers
{
    public class UtilityController : Controller
    {
        private static IHostingEnvironment _hostingEnvironment;


        public UtilityController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost]
        [Route("newuser")]
        public async Task<bool> AddUser(Account account)
        {

            return await Server.AddUser<Account>(account);
        }

        [HttpPost]
        [Route("login")]
        public async Task<bool> Login(Account account)
        {

            return await Server.Login<Account>(account);
        }

        [HttpGet]
        [Route("forgot")]
        public async Task<IEnumerable<Account>> Forgot(string username)
        {

            return await Server.Forgot<Account>(username);
        }

        [HttpGet]
        [Route("recovery")]
        public async Task<ActionResult<IEnumerable<Account>>> RecoveryCode(string code)
        {

            return await Server.RecoveryCode<Account>(code);
        }

        [HttpPut]
        [Route("reset")]
        public async Task<ActionResult<bool>> Reset(Account account)
        {

            return await Server.Reset<Account>(account);
        }

         
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> PostTransaction(Ahhttransaction ahhttransaction)
        {

            return await Server.PostTransaction<Ahhttransaction>(ahhttransaction);
        }

        [HttpGet]
        [Route("getsellerconfirmation")]
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetSellerConfirmation(string confirmation)
        {
            return await Server.GetSellerConfirmation(confirmation);
        }

       
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetBuyerTransaction(string transactioncode)
        {
            return await Server.GetBuyerTransaction(transactioncode);
        }


         
        public async Task<bool> DeclineTransaction(int transactioncode)
        {
            return await Server.DeclineTransaction(transactioncode);
        }

       
        public async Task<ActionResult<bool>> BuyerAcceptPayment(Ahhttransaction ahhttransaction)
        {
            return await Server.BuyerAcceptPayment(ahhttransaction);
        }

        
        public async Task<ActionResult<bool>> BuyerRequestRefund(Ahhttransaction ahhttransaction)
        {
            return await Server.BuyerRequestRefund(ahhttransaction);
        }

     
        public async Task<ActionResult<bool>> SetBuyerPayment(string id)
        {
            return await Server.SetBuyerPayment(id);
        }


        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetDeliveryCode(string transcode)
        {
            return await Server.GetDeliveryCode(transcode);
        }

        
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> ConfirmDeliveryCode(string confirmcode)
        {
            return await Server.ConfirmDeliveryCode(confirmcode);
        }


        
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> ConfirmStatus(string confirmcode)
        {
            return await Server.ConfirmStatus(confirmcode);
        }


        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetSellerTransactions(string phone)
        {
            return await Server.GetSellerTransactions(phone);
        }


        
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetBuyerTransactions(string phone)
        {
            return await Server.GetBuyerTransactions(phone);
        }

         
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> SellerTransactionDetails(int id)
        {
            return await Server.SellerTransactionDetails(id);
        }

       
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> BuyerTransactionDetails(int id)
        {
            return await Server.BuyerTransactionDetails(id);
        }


        public async Task<int> CheckBuyerCount(string phone)
        {
            return Server.CheckBuyerCount(phone);
        }

        public async Task<int> CheckSellerCount(string phone)
        {
            return Server.CheckSellerCount(phone);
        }

        public async Task<bool> SendWebMessage(WebMessage message)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;

            string fullPath = Path.Combine(webRootPath, "webmail.html");
            StreamReader reader = new StreamReader(fullPath);
            string readFile = reader.ReadToEnd();
            string myString = "";
            myString = readFile;


            myString = myString.Replace("$$Title$$", message.Title);
            myString = myString.Replace("$$Name$$", message.Name);
            myString = myString.Replace("$$EmailAddress$$", message.EmailAddress);
            myString = myString.Replace("$$Message$$", message.MessageContent);

            MailMessage m = new MailMessage();
            SmtpClient sc = new SmtpClient();
            m.From = new MailAddress("contact@brigho.com");
            m.To.Add("contact@brigho.com");
            m.Subject = message.Title;
            m.Body = myString.ToString();
            m.IsBodyHtml = true;
            sc.Host = "mail.brigho.com";
            string str1 = "gmail.com";
            string str2 = message.EmailAddress;
            if (str2.Contains(str1))
            {
                try
                {
                    sc.Port = 8889;
                    sc.Credentials = new System.Net.NetworkCredential("contact@brigho.com", "Stefny101.Brigho2021");
                    sc.EnableSsl = false;
                    sc.Send(m);
                    return true;
                }
                catch (Exception e)
                {
                    var err = e;
                    return false;
                }
            }
            else
            {
                try
                {
                    sc.Port = 25;
                    sc.Credentials = new System.Net.NetworkCredential("contact@brigho.com", "Stefny101.Brigho2021");
                    sc.EnableSsl = false;
                    sc.Send(m);
                    return true;
                }
                catch (Exception e)
                {
                    var s = e.ToString();
                    return false;
                }
            }

        }

        public async Task<bool> SendMessage(Message message)
        {
            return Server.SendMail(message);
        }

        public async Task<bool> PostSettlementOtherTransaction(Reconcile reconcile)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;

            string fullPath = Path.Combine(webRootPath, "complaint.html");
            StreamReader reader = new StreamReader(fullPath);
            string readFile = reader.ReadToEnd();
            string myString = "";
            myString = readFile;

             
            myString = myString.Replace("$$Description$$", reconcile.TransactionDescription); 
            myString = myString.Replace("$$MobileNumber$$", reconcile.MobileNumber);
            myString = myString.Replace("$$TransactionNumber$$", reconcile.TransactionNumber); 

            MailMessage m = new MailMessage();
            SmtpClient sc = new SmtpClient();
            m.From = new MailAddress("reconciliation@brigho.com");
            m.To.Add("reconciliation@brigho.com");
            m.Subject = "Transaction Complaint";
            m.Body = myString.ToString();
            m.IsBodyHtml = true;
            sc.Host = "mail.brigho.com";
            string str1 = "gmail.com";
            string str2 = "reconciliation@gmail.com";
            if (str2.Contains(str1))
            {
                try
                {
                    sc.Port = 8889;
                    sc.Credentials = new System.Net.NetworkCredential("reconciliation@brigho.com", "Stefny101.Brigho2021");
                    sc.EnableSsl = false;
                    sc.Send(m);
                    return true;
                }
                catch (Exception e)
                {
                    var err = e;
                    return false;
                }
            }
            else
            {
                try
                {
                    sc.Port = 25;
                    sc.Credentials = new System.Net.NetworkCredential("reconciliation@brigho.com", "Stefny101.Brigho2021");
                    sc.EnableSsl = false;
                    sc.Send(m);
                    return true;
                }
                catch (Exception e)
                {
                    var s = e.ToString();
                    return false;
                }
            }

        }

        public async Task<bool> PostSettlementTransaction(Reconcile reconcile)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;

            string fullPath = Path.Combine(webRootPath, "reconcile.html");
            StreamReader reader = new StreamReader(fullPath);
            string readFile = reader.ReadToEnd();
            string myString = "";
            myString = readFile;


            myString = myString.Replace("$$LinkName$$", reconcile.AccountName);
            //myString = myString.Replace("$$Description$$", reconcile.TransactionDescription);
            myString = myString.Replace("$$BankName$$", reconcile.BankName);
            myString = myString.Replace("$$AccountName$$", reconcile.AccountName);
            myString = myString.Replace("$$AccountNumber$$", reconcile.AccountNumber);
            myString = myString.Replace("$$MobileNumber$$", reconcile.MobileNumber);
            myString = myString.Replace("$$TransactionNumber$$", reconcile.TransactionNumber);
            myString = myString.Replace("$$TransactionDate$$", reconcile.TransactionDate);
            //myString = myString.Replace("$$Price$$", reconcile.AgreedPrice);

            MailMessage m = new MailMessage();
            SmtpClient sc = new SmtpClient();
            m.From = new MailAddress("reconciliation@brigho.com");
            m.To.Add("reconciliation@brigho.com");
            m.Subject = "Settlement & Reconciliation";
            m.Body = myString.ToString();
            m.IsBodyHtml = true;
            sc.Host = "mail.brigho.com";
            string str1 = "gmail.com";
            string str2 = "reconciliation@gmail.com";
            if (str2.Contains(str1))
            {
                try
                {
                    sc.Port = 8889;
                    sc.Credentials = new System.Net.NetworkCredential("reconciliation@brigho.com", "Stefny101.Brigho2021");
                    sc.EnableSsl = false;
                    sc.Send(m);
                    return true;
                }
                catch (Exception e)
                {
                    var err = e;
                    return false;
                }
            }
            else
            {
                try
                {
                    sc.Port = 25;
                    sc.Credentials = new System.Net.NetworkCredential("reconciliation@brigho.com", "Stefny101.Brigho2021");
                    sc.EnableSsl = false;
                    sc.Send(m);
                    return true;
                }
                catch(Exception e)
                {
                    var s = e.ToString();
                    return false;
                }
            }
             
        }
         
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetRefundInfo(string transcode)
        {
            return await Server.GetRefundInfo(transcode);
        }

        [HttpGet]
        [Route("getcurrentdashboard")]
        public async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetCurrentDasboad()
        {
            return await Server.GetCurrentDasboad();
        }
    }
}
