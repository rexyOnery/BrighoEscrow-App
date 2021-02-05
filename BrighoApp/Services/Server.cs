using BrighoApp.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BrighoApp.Services
{
    public class Server
    {
         

        static HttpClient client = new HttpClient();

        static async Task<String> GetSendSmsAsync(string path)
        {
            String responseStr = null;
            HttpResponseMessage response = await client.GetAsync(path);
            if (response.IsSuccessStatusCode)
            {
                responseStr = await response.Content.ReadAsStringAsync();
            }
            return responseStr;
        }

        static string _message_out = "";
        static async Task RunAsync(string phone, string message)
        {
            try
            {
                // Make a get request
                String apiresponse = await GetSendSmsAsync("http://api.ebulksms.com:8080/sendsms?username=ovedeotite@gmail.com&apikey=cd70b93db9894f817beed10ca61493c6816fd3b7&sender=Brigho&messagetext=" + message + "&flash=0&recipients=" + phone);
                _message_out = apiresponse;
            }
            catch (Exception e)
            {
                _message_out  = "Error";
            }
        }

        internal static async Task<bool> AddUser<T>(Account account) where T : class
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var user = _context.Accounts
                    .Where(c => c.Username == account.Username);

                if (user.Count() == 0)
                {
                    string passwordHash;
                    PasswordHashing.CreatePasswordHash(account.Password, out passwordHash);
                    account.Password = passwordHash;
                    account.UserType = "user";
                    _context.Accounts.Add(account);
                    await _context.SaveChangesAsync();

                    return true;
                }

                return false;

            }
        }

        internal static async Task<bool> Login<T>(Account account) where T : class
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _user = _context.Accounts.FirstOrDefault(c => c.Username.Equals(account.Username));

                if (!PasswordHashing.VerifyPasswordHash(account.Password, _user.Password))
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        internal static async Task<IEnumerable<Account>> Forgot<T>(string username) where T : class
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _code = await _context.Accounts
                    .Where(c => c.Username == username)
                    .ToListAsync();

                if (_code.Count != 0)
                {
                    RandomGenerator generator = new RandomGenerator();
                    var Reset_Pin = generator.RandomNumber(1000, 9999).ToString();

                    string message_ = "Your Brigho Password Reset Pin: " + Reset_Pin;
                    // sendSMS(username, message_);
                    //RunAsync(username, message_).Wait();

                    SendMessageBySMS(username, message_);

                    //var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://api.bulksmslive.com/v2/app/sms");
                    //httpWebRequest.ContentType = "application/json";
                    //httpWebRequest.Method = "POST";
                    //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

                    //using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    //{
                    //    string email = "ovedeotite@gmail.com";
                    //    string password = "Stefny";
                    //    string message = message_;
                    //    string sender_name = "Brigho";
                    //    string recipients = username;
                    //    string forcednd = "1";
                    //    string json = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"message\":\"" + message + "\",\"sender_name\":\"" + sender_name + "\",\"recipients\":\"" + recipients + "\",\"forcednd\":\"" + forcednd + "\"}";
                    //    streamWriter.Write(json);
                    //    streamWriter.Flush();
                    //    streamWriter.Close();
                    //}

                    //var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                    //using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    //{
                    //    var result = streamReader.ReadToEnd();
                    //    Console.WriteLine(result);
                    //    _message_out = result;
                    //}

                    var _update_code = _context.Accounts.FirstOrDefault(c => c.Username.Equals(username));
                    _update_code.RecoveryCode = Reset_Pin;
                    _context.Accounts.Update(_update_code);
                    await _context.SaveChangesAsync();

                    List<Account> accounts = new List<Account>();
                    Account account = new Account
                    {
                        RecoveryCode = _message_out
                    };
                    accounts.Add(account);
                    return accounts;
                }

                return _code;
            }
        }

        internal static async Task<bool> FingerprintPhone<T>(string username) where T : class
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _code = await _context.Accounts
                    .Where(c => c.Username == username)
                    .ToListAsync();

                if (_code.Count != 0)
                {
                    return true;
                }

                return false;
            }
        }

        internal static async Task<bool> ChangePassword<T>(Account account) where T : class
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _code = _context.Accounts
                    .FirstOrDefault(c => c.Username == account.Username);

                if (_code != null)
                {
                    string passwordHash;
                    PasswordHashing.CreatePasswordHash(account.Password, out passwordHash);
                    account.Password = passwordHash;
                    _context.Accounts.Update(_code);
                    await _context.SaveChangesAsync();
                    return true;
                }

                return false;
            }
        }

        

        internal static async Task<ActionResult<IEnumerable<Account>>> RecoveryCode<T>(string code) where T : class
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {

                return await _context.Accounts
                    .Where(c => c.RecoveryCode == code)
                    .ToListAsync();
            }
        }


        internal static async Task<bool> Reset<T>(Account account) where T : class
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {

                var _reset = _context.Accounts
                    .FirstOrDefault(c => c.Username == account.Username);

                if (_reset != null)
                {
                    string passwordHash;
                    PasswordHashing.CreatePasswordHash(account.Password, out passwordHash);
                    _reset.Password = passwordHash;

                    _context.Accounts.Update(_reset);
                    await _context.SaveChangesAsync();

                    return true;
                }
                return false;
            }
        }

        internal static async Task<bool> DeclineTransaction(int transactioncode)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _buyerCon = await _context.Ahhttransactions
                    .FirstOrDefaultAsync(x => x.Id == transactioncode);

                if (_buyerCon != null)
                {
                    _buyerCon.TransactionStatus = "dangers";
                    _buyerCon.Reasons = "Declined: Buyer declined the transaction.";
                    _context.Ahhttransactions.Update(_buyerCon);

                    await _context.SaveChangesAsync();

                    string msg = "Brigho transaction with number " + _buyerCon.SellertTransactionCode + " has been declined by the Buyer. Kindly contact Buyer";
                    sendSMS(_buyerCon.SellerMobileNumber, msg);
                    return true;

                }

                return false;
            }
        }

        internal static async Task<List<Ahhttransaction>> PostTransaction<T>(Ahhttransaction ahhttransaction) where T : class
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                RandomGenerator generator = new RandomGenerator();

                Ahhttransaction model = new Ahhttransaction
                {
                    AhhtCommission = ahhttransaction.AhhtCommission,
                    SellerBankName = ahhttransaction.SellerBankName,
                    SellerAccountName = ahhttransaction.SellerAccountName,
                    SellerAccountNumber = ahhttransaction.SellerAccountNumber,
                    SellerMobileNumber = ahhttransaction.SellerMobileNumber,
                    BuyerMobileNumber = ahhttransaction.BuyerMobileNumber,
                    TransactionDescription = ahhttransaction.TransactionDescription,
                    AgreedPrice = ahhttransaction.AgreedPrice,
                    ShippingCost = ahhttransaction.ShippingCost,
                    TotalCost = ahhttransaction.TotalCost,
                    Paid = false,
                    ConfirmationCode = "none",
                    BuyerCodeConfirmed = false,
                    SellerCodeConfirmed = false,
                    Viewed = false,
                    Deleted = false,
                    Processed = false,
                    Completed = false,
                    TransactionStatus = "warning",
                    Reasons = "Pending: Buyer is yet to make payment",
                    TransactionDate = generator.Month(DateTime.Now.Month) + " " + DateTime.Now.Day + ", " + DateTime.Now.Year // + " " + DateTime.Now.AddHours(-1).ToLocalTime().ToLongTimeString()

                };


                _context.Ahhttransactions.Add(model);
                _context.SaveChanges();


                int id = model.Id;
                var _codes = _context.Ahhttransactions.Find(id);

                //var Trans_Code = id + "" + generator.RandomNumber(1000, 9999);
                //try { Trans_Code = Trans_Code.Substring(0, 6); } catch { }

                var Seller_Trans_Code = id + "" + generator.RandomNumber(1000, 9999);
                try { Seller_Trans_Code = Seller_Trans_Code.Substring(0, 6); } catch { }

                _codes.TransactionCode = Seller_Trans_Code;
                _codes.SellertTransactionCode = Seller_Trans_Code;
                _context.SaveChanges();

                string desc = "";
                desc = ahhttransaction.TransactionDescription.Length > 90 ? ahhttransaction.TransactionDescription.Substring(0, 80) + "..." : ahhttransaction.TransactionDescription;

                string message_ = "Brigho Transaction: " + desc + ". Go to https://tinyurl.com/kuauewej to complete transaction";
                //sendSMS(ahhttransaction.BuyerMobileNumber, message_);
                //RunAsync(ahhttransaction.BuyerMobileNumber, message_).Wait();

                SendMessageBySMS(ahhttransaction.BuyerMobileNumber, message_);

                return await _context.Ahhttransactions
                    .Where(c => c.Id.Equals(id))
                    .ToListAsync();
            }
        }

        private static void SendMessageBySMS(string phoneNumber, string message_)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://api.bulksmslive.com/v2/app/sms");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string email = "ovedeotite@gmail.com";
                string password = "Stefny";
                string message = message_;
                string sender_name = "BRIGHO";
                string recipients = phoneNumber;
                string forcednd = "1";
                string json = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"message\":\"" + message + "\",\"sender_name\":\"" + sender_name + "\",\"recipients\":\"" + recipients + "\",\"forcednd\":\"" + forcednd + "\"}";
                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                Console.WriteLine(result);
                _message_out = result;
            }
        }

        internal static async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetRefundInfo(string confirmcode)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var stat = await _context.Ahhttransactions
                    .Where(c => c.ConfirmationCode == confirmcode)
                    .Select(c => RefundDTO(c))
                    .ToListAsync();

                return stat;
            }
        }

        private static Ahhttransaction RefundDTO(Ahhttransaction user) =>
       new Ahhttransaction
       {
           AgreedPrice = user.AgreedPrice,
           AhhtCommission = user.AhhtCommission,
           ShippingCost = user.ShippingCost,
           TotalCost = user.TotalCost
       };


        internal static async Task<ActionResult<IEnumerable<Ahhttransaction>>> ConfirmStatus(string confirmcode)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var stat = await _context.Ahhttransactions
                    .Where(c => c.SellertTransactionCode == confirmcode)
                    .Select(c => StatusDTO(c))
                    .ToListAsync();

                return stat;
            }
        }

        private static Ahhttransaction StatusDTO(Ahhttransaction user) =>
       new Ahhttransaction
       {
           Paid = user.Paid,
           TransactionDescription = user.TransactionDescription,
           SellerCodeConfirmed = user.SellerCodeConfirmed,
           TransactionStatus = user.TransactionStatus
       };

        internal static async Task<ActionResult<IEnumerable<Ahhttransaction>>> ConfirmDeliveryCode(string transcode)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                RandomGenerator randomGenerator = new RandomGenerator();
                var _buyerPaid = _context.Ahhttransactions
                   .FirstOrDefault(c => c.ConfirmationCode == transcode);

                try
                {
                    if (_buyerPaid != null)
                    {
                        if ((bool)_buyerPaid.Paid)
                        {
                            _buyerPaid.SellerCodeConfirmed = true;
                            _buyerPaid.TransactionStatus = "success";
                            _buyerPaid.Reasons = "Completed: Buyer has collected the item(s) on " + randomGenerator.Month(DateTime.Now.Month) + " " + DateTime.Now.Day + ", " + DateTime.Now.Year;
                            _context.Ahhttransactions.Update(_buyerPaid);
                            _context.SaveChanges();

                            //string desc = "";
                            //try { desc =_buyerPaid.TransactionDescription.Substring(0,80); } catch { desc = _buyerPaid.TransactionDescription; }
                            //string msg = "Your Brigho transaction: '" + desc + "' with number "+_buyerPaid.TransactionCode+" has been collected by the buyer";
                            string msg = "Brigho transaction with number " + _buyerPaid.SellertTransactionCode + " has been collected by the Buyer. Brigho will credit your account within 30hrs.";
                            SendMessageBySMS(_buyerPaid.SellerMobileNumber, msg);


                        }
                    }
                }
                catch { }

                var res = await _context.Ahhttransactions
                    .Where(c => c.ConfirmationCode == transcode)
                    .Select(c => DeliveryDTO(c))
                    .ToListAsync();


                return res;

            }
        }

        internal static async Task<bool> BuyerAcceptPayment(Ahhttransaction ahhttransaction)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var trans = _context.Ahhttransactions.FirstOrDefault(c => c.TransactionCode == ahhttransaction.TransactionCode);

                if (trans != null)
                {
                    /*trans.BuyerAccountName = ahhttransaction.BuyerAccountName;
                      trans.BuyerAccountNumber = ahhttransaction.BuyerAccountNumber;
                      trans.BuyerBankName = ahhttransaction.BuyerBankName;
                      trans.BuyerEmailAddress = ahhttransaction.BuyerEmailAddress;
                    */

                    //not part of block commnet
                    //trans.BuyerMobileNumber = ahhttransaction.BuyerMobileNumber;

                    //_context.Ahhttransactions.Update(trans);
                    //await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
        }

        internal static async Task<bool> BuyerRequestRefund(Ahhttransaction ahhttransaction)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var trans = _context.Ahhttransactions.FirstOrDefault(c => c.ConfirmationCode == ahhttransaction.TransactionCode);

                if (trans != null)
                {
                    trans.BuyerAccountName = ahhttransaction.BuyerAccountName;
                    trans.BuyerAccountNumber = ahhttransaction.BuyerAccountNumber;
                    trans.BuyerBankName = ahhttransaction.BuyerBankName;
                    trans.BuyerEmailAddress = ahhttransaction.BuyerEmailAddress;
                    //trans.BuyerMobileNumber = ahhttransaction.BuyerMobileNumber;
                    trans.TransactionStatus = "danger";
                    trans.Reasons = "Declined: Buyer returned the item(s).";

                    string msg = "Brigho transaction number " + trans.SellertTransactionCode + " has been returned. Contact your agent to retrieve your item(s). Brigho will refund your cost of delivery.";

                    sendSMS(trans.SellerMobileNumber, msg);

                    _context.Ahhttransactions.Update(trans);
                    await _context.SaveChangesAsync();

                    return true;
                }
                return false;
            }
        }

        internal static async Task<List<Ahhttransaction>> GetSellerConfirmation(string transaction_code)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _sellerCon = await _context.Ahhttransactions
                    .Where(x => x.TransactionCode == transaction_code)
                    .Select(x => SellerDTO(x))
                    .ToListAsync();

                if (_sellerCon.Count != 0)
                {
                    var spec = _context.Ahhttransactions.FirstOrDefault(c => c.TransactionCode == transaction_code);
                    spec.SellerCodeConfirmed = true;
                    _context.Ahhttransactions.Update(spec);
                    await _context.SaveChangesAsync();

                    string message_ = "Your Brigho Payment Confirmation Number: " + transaction_code;
                    //sendSMS(_sellerCon.FirstOrDefault().BuyerMobileNumber, message_);
                }

                return _sellerCon;
            }
        }

        public static async Task<List<Ahhttransaction>> GetBuyerTransaction(string transaction_code)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _buyerCon = await _context.Ahhttransactions
                    .Where(x => x.TransactionCode == transaction_code)
                    .Select(x => SellerDTO(x))
                    .ToListAsync();

                if (_buyerCon.Count != 0)
                {
                    var spec = _context.Ahhttransactions.FirstOrDefault(c => c.TransactionCode == transaction_code);
                    spec.BuyerCodeConfirmed = true;
                    _context.Ahhttransactions.Update(spec);

                    await _context.SaveChangesAsync();

                }

                return _buyerCon;
            }
        }

        public static async Task<bool> SetBuyerPayment(string tranid)
        {
            RandomGenerator randomGenerator = new RandomGenerator();
            bool _confirmed = false;
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _buyerPaid = _context.Ahhttransactions
                    .FirstOrDefault(c => c.TransactionCode == tranid);

                RandomGenerator rnd = new RandomGenerator();
                if (_buyerPaid != null)
                {
                    string confirmation_code = rnd.RandomNumber(1000, 9999).ToString();
                    confirmation_code = _buyerPaid.Id + "" + confirmation_code;

                    _buyerPaid.ConfirmationCode = confirmation_code.Length > 6 ? confirmation_code.Substring(0, 6) : confirmation_code;
                    _buyerPaid.Paid = true;
                    _buyerPaid.PaymentDate = randomGenerator.Month(DateTime.Now.Month) + " " + DateTime.Now.Day + ", " + DateTime.Now.Year;
                    _buyerPaid.Reasons = "Pending: Buyer has made payment. Kindly send item(s) to buyer using Delivery Number: " + _buyerPaid.ConfirmationCode;
                    //_buyerPaid.TransactionDate = rnd.Month(DateTime.Now.Month) + " " + DateTime.Now.Day + ", " + DateTime.Now.Year + " " + DateTime.Now.ToLongTimeString();
                    _context.Ahhttransactions.Update(_buyerPaid);

                    await _context.SaveChangesAsync();
                    _confirmed = true;

                    //string message_ = "Your Brigho Transaction with the Number: " + _buyerPaid.SellertTransactionCode + " was accepted and payment made. Kindly send the item(s) to the buyer. Buyer Delivery Number is: "+_buyerPaid.ConfirmationCode;
                    string message_ = "Brigho transaction with number " + _buyerPaid.SellertTransactionCode + " has been paid for by the Buyer. Kindly send item(s) to Buyer using Delivery Number " + _buyerPaid.ConfirmationCode;
                    SendMessageBySMS(_buyerPaid.SellerMobileNumber, message_);

                    string buyerMsg = "Your payment of N" + _buyerPaid.TotalCost + " has been received. And the Seller notified";

                    // SendMessageBySMS(_buyerPaid.BuyerMobileNumber, message_);

                }

                return _confirmed;
            }
        }

        private static Ahhttransaction SellerDTO(Ahhttransaction user) =>
       new Ahhttransaction
       {
           Id = user.Id,
           SellerAccountName = user.SellerAccountName,
           SellerAccountNumber = user.SellerAccountNumber,
           SellerBankName = user.SellerBankName,
           SellerMobileNumber = user.SellerMobileNumber,
           TransactionDescription = user.TransactionDescription,
           AgreedPrice = user.AgreedPrice,
           AhhtCommission = user.AhhtCommission,
           ShippingCost = user.ShippingCost,
           TotalCost = user.TotalCost,
           Paid = user.Paid
       };


        private static void sendSMS(string Phone, string message_code)
        {
            string admin_message = message_code;
            string phone = Phone;

            //string url = "https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=z8JT6uJ5rPksUGLBWzGs6KUTa5JFttdT4qIyYjnsIrvg4N2uPklYhK9DNpxy&from=EXCELLENTUT&to=" + phone +"& body="+message + "&dnd=1"; 

            string sender = "BRIGHO";
            string to = phone;
            string token = "f7DpAIbD3BDtlLkOEONdkT0R1bCdqYtVy4gakVH4cPF8edvA4NoVfz3ePs7lDITAB8NCFaDvugyFwTncpCj6mCDwIWN0K7Ckulk7";
            int routing = 3;
            int type = 0;
            string baseurl = "https://smartsmssolutions.com/api/json.php?";
            string url = baseurl + "message=" + admin_message + "&to=" + to + "&sender=" + sender + "&type=" + type + "&routing=" + routing + "&token=" + token;

            HttpWebRequest webReq = (HttpWebRequest)WebRequest.Create(string.Format(url));
            webReq.Method = "GET";
            HttpWebResponse webResponse = (HttpWebResponse)webReq.GetResponse();
            Stream answer = webResponse.GetResponseStream();
            StreamReader _recivedAnswer = new StreamReader(answer);
            var ans = _recivedAnswer.ReadToEnd();

        }


        internal static async Task<List<Ahhttransaction>> GetDeliveryCode(string transcode)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                return await _context.Ahhttransactions
                    .Where(c => c.TransactionCode == transcode)
                    .Select(c => DeliveryDTO(c))
                    .ToListAsync(); ;

            }
        }

        private static Ahhttransaction DeliveryDTO(Ahhttransaction user) =>
       new Ahhttransaction
       {
           TransactionDate = user.TransactionDate,
           ConfirmationCode = user.ConfirmationCode,
           TransactionDescription = user.TransactionDescription,
           BuyerAccountName = user.BuyerAccountName,
           BuyerBankName = user.BuyerBankName,
           SellerCodeConfirmed = user.SellerCodeConfirmed,
           SellertTransactionCode = user.SellertTransactionCode
       };



        internal static async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetSellerTransactions(string phone)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _tranCon = await _context.Ahhttransactions
                    .Where(x => x.SellerMobileNumber == phone)// && x.SellerCodeConfirmed == false)
                    .OrderByDescending(x => x.Id)
                    .Select(x => SellerTransactionDTO(x))
                    .ToListAsync();

                return _tranCon;
            }
        }

        private static Ahhttransaction SellerTransactionDTO(Ahhttransaction user) =>
       new Ahhttransaction
       {
           Id = user.Id,
           TransactionDate = user.TransactionDate,
           TransactionCode = user.TransactionCode,
           TransactionStatus = user.TransactionStatus,
           TransactionDescription = user.TransactionDescription,
           SellertTransactionCode = user.SellertTransactionCode
       };


        internal static async Task<ActionResult<IEnumerable<Ahhttransaction>>> GetBuyerTransactions(string phone)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _tranCon = await _context.Ahhttransactions
                    .Where(x => x.BuyerMobileNumber == phone)// && x.SellerCodeConfirmed == false)
                    .OrderByDescending(x => x.Id)
                    .Select(x => SellerTransactionDTO(x))
                    .ToListAsync();

                return _tranCon;
            }
        }

        internal static async Task<ActionResult<IEnumerable<Ahhttransaction>>> SellerTransactionDetails(int id)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _tranCon = await _context.Ahhttransactions
                    .Where(x => x.Id == id)
                    .Select(x => SellerTransactionDetailsDTO(x))
                    .ToListAsync();

                return _tranCon;
            }
        }

        private static Ahhttransaction SellerTransactionDetailsDTO(Ahhttransaction user) =>
       new Ahhttransaction
       {
           TransactionDate = user.TransactionDate,
           SellertTransactionCode = user.SellertTransactionCode,
           ConfirmationCode = user.ConfirmationCode,
           TransactionDescription = user.TransactionDescription,
           TotalCost = user.TotalCost,
           SellerAccountName = user.SellerAccountName,
           SellerAccountNumber = user.SellerAccountNumber,
           SellerBankName = user.SellerBankName,
           SellerMobileNumber = user.SellerMobileNumber,
           BuyerMobileNumber = user.BuyerMobileNumber,
           TransactionStatus = user.TransactionStatus,
           Reasons = user.Reasons,
           Paid = user.Paid,
           SellerCodeConfirmed = user.SellerCodeConfirmed,
           ShippingCost = user.ShippingCost,
           Processed = user.Processed,
           RefundDate = user.RefundDate
       };

        internal static async Task<ActionResult<IEnumerable<Ahhttransaction>>> BuyerTransactionDetails(int id)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                var _tranCon = await _context.Ahhttransactions
                    .Where(x => x.Id == id)
                    .Select(x => BuyerTransactionDetailsDTO(x))
                    .ToListAsync();

                //update item viewed
                var _viewed = _context.Ahhttransactions.Find(id);
                _viewed.Viewed = true;
                _context.Ahhttransactions.Update(_viewed);
                _context.SaveChanges();

                return _tranCon;
            }
        }

        private static Ahhttransaction BuyerTransactionDetailsDTO(Ahhttransaction user) =>
       new Ahhttransaction
       {
           TransactionDate = user.TransactionDate,
           TransactionCode = user.TransactionCode,
           ConfirmationCode = user.ConfirmationCode,
           TransactionDescription = user.TransactionDescription,
           TotalCost = user.TotalCost,
           AgreedPrice = user.AgreedPrice,
           AhhtCommission = user.AhhtCommission,
           ShippingCost = user.ShippingCost,
           BuyerAccountName = user.BuyerAccountName,
           BuyerAccountNumber = user.BuyerAccountNumber,
           BuyerBankName = user.BuyerBankName,
           BuyerMobileNumber = user.BuyerMobileNumber,
           SellerMobileNumber = user.SellerMobileNumber,
           TransactionStatus = user.TransactionStatus,
           Reasons = user.Reasons,
           Paid = user.Paid,
           Processed = user.Processed,
           RefundDate = user.RefundDate
       };


        internal static bool SendMail(Message message)
        {

            MailMessage m = new MailMessage();
            SmtpClient sc = new SmtpClient();
            m.From = new MailAddress("inquiries@brigho.com");
            m.To.Add("inquiries@brigho.com");
            m.Subject = message.Name;
            m.Body = "Email: " + message.Email + "<br/><br />" + message.MessageBody;
            m.IsBodyHtml = true;
            sc.Host = "mail.brigho.com";
            string str1 = "gmail.com";
            string str2 = message.Email.ToLower();
            if (str2.Contains(str1))
            {
                try
                {
                    sc.Port = 8889;
                    sc.Credentials = new System.Net.NetworkCredential("inquiries@brigho.com", "Stefny101.Brigho2021");
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
                    sc.Credentials = new System.Net.NetworkCredential("inquiries@brigho.com", "Stefny101.Brigho2021");
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

        internal static async Task<List<Ahhttransaction>> GetCurrentDasboad()
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                return await _context.Ahhttransactions
                    .ToListAsync();
            }
        }

        internal static int CheckBuyerCount(string phone)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                int ctx = 0;
                try
                {
                    var _ctx = _context.Ahhttransactions
                        .Where(c => c.BuyerMobileNumber.Equals(phone))
                        .Select(x => SellerTransactionDTO(x))
                    .ToList();

                    ctx = _ctx.Count(c => c.TransactionStatus.Equals("warning"));

                }
                catch
                {
                    return 0;
                }
                return ctx;
            }
        }
        internal static int CheckSellerCount(string phone)
        {
            using (var _context = new DB_A5DE44_HoldingContext())
            {
                int ctx = 0;
                try
                {
                    var _ctx = _context.Ahhttransactions
                        .Where(c => c.SellerMobileNumber.Equals(phone))
                    .Select(x => SellerTransactionDTO(x))
                    .ToList();

                    ctx = _ctx.Count(c => c.TransactionStatus.Equals("warning"));
                }
                catch
                {
                    return 0;
                }
                return ctx;
            }
        }

    }
}
 