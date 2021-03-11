using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrighoApp.Services
{
    public class OvedTransacts
    {
        public int Id { get; internal set; }
        public string SellerAccountName { get; internal set; }
        public string SellerAccountNumber { get; internal set; }
        public string SellerBankName { get; internal set; }
        public object SellerMobileNumber { get; internal set; }
        public string ConfirmationCode { get; internal set; }
        public string TotalCost { get; internal set; }
        public string ShippingCost { get; internal set; }
        public string AgreedPrice { get; internal set; }
        public string TransactionDescription { get; internal set; }
        public object AhhtCommission { get; internal set; }
    }
}
