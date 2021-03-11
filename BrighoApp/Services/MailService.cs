using BrighoApp.Models;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BrighoApp.Services
{
    public class MailService
    {
        [Obsolete]
        private static IHostingEnvironment _hostingEnvironment;

        [Obsolete]
        public MailService(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [Obsolete]
        internal static bool PostSettlementTransaction(Reconcile reconcile)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;

            string fullPath = Path.Combine(webRootPath, "reconcile.html");
            StreamReader reader = new StreamReader(fullPath);
            string readFile = reader.ReadToEnd();
            string myString = "";
            myString = readFile;

            myString.Replace("$$LinkName$$", reconcile.AccountName);
            myString.Replace("$$Description$$", reconcile.TransactionDescription);
            myString.Replace("$$BankName$$", reconcile.BankName);
            myString.Replace("$$AccountName$$", reconcile.AccountName);
            myString.Replace("$$AccountNumber$$", reconcile.AccountNumber);
            myString.Replace("$$MobileNumber$$", reconcile.MobileNumber);
            myString.Replace("$$TransactionNumber$$", reconcile.TransactionNumber);
            myString.Replace("$$TransactionDate$$", reconcile.TransactionDate);
            myString.Replace("$$Price$$", reconcile.AgreedPrice);

            MailMessage m = new MailMessage();
            SmtpClient sc = new SmtpClient();
            m.From = new MailAddress("reconciliation@brigho.com");
            m.To.Add("reconciliation@brigho.com");
            m.Subject = "Settlement & Reconciliation Notice for " + reconcile.FullName;
            m.Body = myString.ToString();
            m.IsBodyHtml = true;
            sc.Host = "mail.brigho.com";
            string str1 = "gmail.com";
            string str2 = "reconciliation@brigho.com";
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
                catch
                {
                    return false;
                }
            }
        }

    }
}
