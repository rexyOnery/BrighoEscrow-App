
///////////////////////////////////////////////////////////////////////////
// Loader
$(document).ready(function () {
    
    var todaysDate = new Date(); // Gets today's date
    
    var year = todaysDate.getFullYear();                        // YYYY
    
    var month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);  // MM
     
    var day = ("0" + todaysDate.getDate()).slice(-2);           // DD
     
    var maxDate = (year + "-" + month + "-" + day); // Results in "YYYY-MM-DD" for today's date 
    
    $('#transaction_date').attr('max', maxDate);


    //try { document.createEvent("TouchEvent");  }
    //catch (e) { location.href = "http://www.brigho.com"; }

    if (localStorage.getItem('phone') != null) {
        $("#ephone").val(localStorage.getItem('phone'));
    }

    $("#phone_number").val(localStorage.getItem('phone'));

    setTimeout(() => {
        $("#loader").fadeToggle(250);
    }, 800); // hide delay when page load
     
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Go Back
$(".goBack").click(function () {
    window.history.go(-1);
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Input
$(".clear-input").click(function () {
    $(this).parent(".input-wrapper").find(".form-control").focus();
    $(this).parent(".input-wrapper").find(".form-control").val("");
    $(this).parent(".input-wrapper").removeClass("not-empty");
});
// active
$(".form-group .form-control").focus(function () {
    $(this).parent(".input-wrapper").addClass("active");
}).blur(function () {
    $(this).parent(".input-wrapper").removeClass("active");
})
// empty check
$(".form-group .form-control").keyup(function () {
    var inputCheck = $(this).val().length;
    if (inputCheck > 0) {
        $(this).parent(".input-wrapper").addClass("not-empty");
    }
    else {
        $(this).parent(".input-wrapper").removeClass("not-empty");
    }
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Searchbox Toggle
$(".toggle-searchbox").click(function () {
    $("#search").fadeToggle(200);
    $("#search .form-control").focus();
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Owl Carousel
$('.carousel-full').owlCarousel({
    loop: true,
    margin: 8,
    nav: false,
    items: 1,
    dots: false,
});
$('.carousel-single').owlCarousel({
    stagePadding: 30,
    loop: true,
    margin: 16,
    nav: false,
    items: 1,
    dots: false,
});
$('.carousel-multiple').owlCarousel({
    stagePadding: 32,
    loop: true,
    margin: 16,
    nav: false,
    items: 2,
    dots: false,
});
$('.carousel-small').owlCarousel({
    stagePadding: 32,
    loop: true,
    margin: 8,
    nav: false,
    items: 4,
    dots: false,
});
$('.carousel-slider').owlCarousel({
    loop: true,
    margin: 8,
    nav: false,
    items: 1,
    dots: true,
});
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
$('.custom-file-upload input[type="file"]').each(function () {
    // Refs
    var $fileUpload = $(this),
        $filelabel = $fileUpload.next('label'),
        $filelabelText = $filelabel.find('span'),
        filelabelDefault = $filelabelText.text();
    $fileUpload.on('change', function (event) {
        var name = $fileUpload.val().split('\\').pop(),
            tmppath = URL.createObjectURL(event.target.files[0]);
        if (name) {
            $filelabel
                .addClass('file-uploaded')
                .css('background-image', 'url(' + tmppath + ')');
            $filelabelText.text(name);
        } else {
            $filelabel.removeClass('file-uploaded');
            $filelabelText.text(filelabelDefault);
        }
    });
});
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
// Notification
// trigger notification
function notification(target, time) {
    var a = "#" + target;
    $(".notification-box").removeClass("show");
    setTimeout(() => {
        $(a).addClass("show");
    }, 300);
    if (time) {
        time = time + 300;
        setTimeout(() => {
            $(".notification-box").removeClass("show");
        }, time);
    }
};
// close button notification
$(".notification-box .close-button").click(function (event) {
    event.preventDefault();
    $(".notification-box.show").removeClass("show");
});
// tap to close notification
$(".notification-box.tap-to-close .notification-dialog").click(function () {
    $(".notification-box.show").removeClass("show");
});
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
// Toast
// trigger toast
function toastbox(target, time) {
    var a = "#" + target;
    $(".toast-box").removeClass("show");
    setTimeout(() => {
        $(a).addClass("show");
    }, 100);
    if (time) {
        time = time + 100;
        setTimeout(() => {
            $(".toast-box").removeClass("show");
        }, time);
    }
};
// close button toast
$(".toast-box .close-button").click(function (event) {
    event.preventDefault();
    $(".toast-box.show").removeClass("show");
});
// tap to close toast
$(".toast-box.tap-to-close").click(function () {
    $(this).removeClass("show");
});
///////////////////////////////////////////////////////////////////////////


var uri = "http://mobile.brigho.com/api/ahhtapi";
//var uri = "http://localhost:49244/api/ahhtapi";


const showHidden = async () => {
    $("#btnVerify").addClass('hidden');
    $("#btnProgress").removeClass('hidden');
    if ($("#seller_transaction_code").val() != "") {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        try {

            $.ajax({
                type: "GET",
                url: "/Utility/GetBuyerTransaction/",
                contentType: "application/json; charset=utf-8",
                data: {
                    'transactioncode': $("#seller_transaction_code").val()
                },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (!Object.keys(data).length) {
                        $("#no-item").removeClass('hidden');
                        $("#btnVerify").removeClass('hidden');
                        $("#btnProgress").addClass('hidden');
                    }
                    else {

                        data.forEach(item => {
                            if (item.paid == true) {
                                $("#DialogIconedInfo").modal('show');
                            }
                            else {
                                $("#agreed_price").val(formatMoney(parseFloat(item.agreedPrice)));
                                $("#shipping").val(formatMoney(parseFloat(item.shippingCost)));
                                $("#commission").val(formatMoney(parseFloat(item.ahhtCommission)));
                                $("#transaction_cost").val(formatMoney(parseFloat(item.totalCost)));
                                document.getElementById('trans-id').value = item.id;

                                $("#showHidden").removeClass("hidden");
                                $("#hideSMS").addClass('hidden');
                                $("#btnVerify").removeClass('hidden');
                                $("#btnProgress").addClass('hidden');
                            }
                        });
                        $("#btnVerify").removeClass('hidden');
                        $("#btnProgress").addClass('hidden');
                    }
                },
                error: function (err) {
                    $("#veriSpinner").addClass('hidden');
                    $("#DialogIconedDanger").modal('show');
                }
            });
             


        } catch (error) {
            console.log(error);
            $("#btnVerify").removeClass('hidden');
            $("#btnProgress").addClass('hidden');
        }
    } else {
        $("#showHidden").addClass("hidden");
        $("#btnVerify").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}

if ($("#brighoShow").length != 0) {
    var _query = location.search.split('=');
    $("#seller_transaction_code").val(_query[1]);

    showHidden();
}

if ($("#brighoStatus").length != 0) {
    var _query = location.search.split('=');
    $("#smscode").val(_query[1]);

}

$("#btncancel").click(function () {
    $("#btnProgress").removeClass('hidden');
    //document.getElementById('btnVerify').style.display = 'none';
    $("#btnSat").addClass('hidden');
    declineAction($("#trans-id").val());
})


const declineAction = async (id) => {
    $("#btnProgress").removeClass('hidden');
    $("#btnAccept").addClass('hidden');
    $("#btnDecline").addClass('hidden');
    if ($("#seller_transaction_code").val() != "") {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        try {
            //const res = await fetch(uri + "/decline?transactioncode=" + id, requestOptions);
            //if (!res.ok) {
            //    throw new Error(res.status);
            //}
            //const data = await res.json();

            $("#DialogIconedDangerDeclined").modal('show');


        } catch (error) {
            console.log(error);
            $("#btnProgress").addClass('hidden');
            $("#btnAccept").removeClass('hidden');
            $("#btnDecline").removeClass('hidden');
        }
    } else {
        $("#showHidden").addClass("hidden");
        $("#btnProgress").addClass('hidden');
        $("#btnAccept").removeClass('hidden');
        $("#btnDecline").removeClass('hidden');
    }
}
var doDecline = function () {

    decline($("#trans-id").val());
}

const decline = async (id) => {
    $("#btnProgress").removeClass('hidden');
    $("#btnAccept").addClass('hidden');
    $("#btnDecline").addClass('hidden');
    if ($("#seller_transaction_code").val() != "") {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        try {

            $.ajax({
                type: "GET",
                url: "/Utility/DeclineTransaction/",
                contentType: "application/json; charset=utf-8",
                data: {
                    'transactioncode': id
                },
                dataType: "json",
                success: function (data) {
                    location.href = "/buyer";
                },
                error: function (err) {
                    $("#btnProgress").addClass('hidden');
                    $("#btnAccept").removeClass('hidden');
                    $("#btnDecline").removeClass('hidden');
                }
            });
             

        } catch (error) {
            console.log(error);
            $("#btnProgress").addClass('hidden');
            $("#btnAccept").removeClass('hidden');
            $("#btnDecline").removeClass('hidden');
        }
    } else {
        $("#showHidden").addClass("hidden");
        $("#btnProgress").addClass('hidden');
        $("#btnAccept").removeClass('hidden');
        $("#btnDecline").removeClass('hidden');
    }
}

function formatMoney(number, decPlaces, decSep, thouSep) {

    return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
     
}

function formatPrice() {
    var agreed_price = $("#agreed_price").val();
    $("#agreed_price").val(formatMoney(parseFloat(agreed_price)));
}

var showButton = function () {
    if ($('#chkTOC').is(":checked")) {

        $('#btnSubmit').attr("disabled", false);
    } else {
        $('#btnSubmit').attr("disabled", true);
    }
}

var showSubmitButton = function () {
    if ($('#chkTOC').is(":checked")) {
        if ($("#transaction_cost").val() != "" && $("#transaction_cost").val() != "0") {
            $('#btnSubmit').attr("disabled", false);
        }
    } else {
        $('#btnSubmit').attr("disabled", true);
    }
}

var showReconSubmitButton = function () {
    if ($('#chkTOC').is(":checked")) { 
            $("#btnSettlementSubmit").attr("disabled", false); 
    } else { 
        $("#btnSettlementSubmit").attr("disabled", true);
    }
}
var showReconSubmitCompButton = function () {
    if ($('#chkTOComp').is(":checked")) {
        $("#btnSettlementCompSubmit").attr("disabled", false);
    } else {
        $("#btnSettlementCompSubmit").attr("disabled", true);
    }
}

$("#btnSubmit").click(function () {
    var commission = "";//parseFloat($("#commission").val().split('.')[0].replace(',', ''));//parseFloat($("#commission").val());
    var agreed_price = "";//parseFloat($("#agreed_price").val().split('.')[0].replace(',', ''));// parseFloat($("#agreed_price").val());
    var shipping = "";//parseFloat($("#shipping").val());
    var transactioncost = "";

    if ($("#account_number").val().length != 10) {
        $("#DialogIconedInvalidAccount").modal('show');
        $("#account_number").focus();
        return false;
    }
    if ($("#buyer_phone_number").val().length != 11) {
        $("#DialogIconedInvalidPhone").modal('show');
        $("#buyer_phone_number").focus();
        return false;
    }

    if ($("#shipping").val() != "0.00") {
        var ship_p = $("#shipping").val().split('.')[0];
        var split_s = ship_p.split(',');
        var s = "";
        split_s.forEach(sitem => {
            s += sitem;
        })
        shipping = parseFloat(s);
    }
    if ($("#agreed_price").val() != "0.00") {
        var agree_p = $("#agreed_price").val().split('.')[0];
        var split_p = agree_p.split(',');
        var n = "";
        split_p.forEach(item => {
            n += item;
        })
        agreed_price = parseFloat(n);
    }
    if ($("#commission").val() != "0.00") {
        var commission_p = $("#commission").val().split('.')[0];
        var split_c = commission_p.split(',');
        var c = "";
        split_c.forEach(citem => {
            c += citem;
        })
        commission = parseFloat(c);
    }
    if ($("#transaction_cost").val() != "0.00") {
        var transaction_p = $("#transaction_cost").val().split('.')[0];
        var split_t = transaction_p.split(',');
        var t = "";
        split_t.forEach(titem => {
            t += titem;
        })
        transactioncost = parseFloat(t);
    }

   
     
    var user = {
        SellerBankName: $("#bank_name").val(),
        SellerAccountName: $("#account_name").val(),
        SellerAccountNumber: $("#account_number").val(),
        SellerMobileNumber: $("#phone_number").val(),
        BuyerMobileNumber: $("#buyer_phone_number").val(),
        TransactionDescription: $("#transaction_description").val(),
        AgreedPrice: agreed_price.toString(),
        ShippingCost: shipping.toString(),
        AHHTCommission: commission.toString(),
        TotalCost: transactioncost.toString()
    };
    if (user.AgreedPrice == "") {
        $("#errMsg").html('Please enter the price you agreed with the Buyer');
        $("#agreed_price").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.SellerAccountName == "") {
        $("#errMsg").html('Please enter the Seller Account Name');
        $("#account_name").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.SellerBankName == "") {
        $("#errMsg").html('Please select the Seller Bank Name');
        $("#bank_name").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.SellerAccountNumber == "") {
        $("#errMsg").html('Please enter the Seller Account Number');
        $("#account_number").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }

    if (user.BuyerMobileNumber == "") {
        $("#errMsg").html('Please enter the Buyer Mobile Number');
        $("#buyer_phone_number").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.TransactionDescription == "") {
        $("#errMsg").html('Please enter the transaction description');
        $("#transaction_description").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    } else {
        addTransaction(user);
    }
});

const addTransaction = async (user) => {
    try {
        $("#btnSubmit").addClass('hidden');
        $("#btnProgress").removeClass('hidden');

        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $.ajax({
            type: "POST",
            url: "/Utility/PostTransaction/",
            data: user,
            success: function (data) {
                console.log(data);
                if (!data.length > 0) {
                    $("#DialogIconedDanger").modal('show');
                    $("#btnSubmit").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
                else {
                    data.forEach(item => {
                        document.getElementById('transCode').innerHTML = item.sellertTransactionCode;
                    });
                    location.href = "/seller"; 
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnSubmit").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });
         
    } catch (error) {
        console.log(error);
        $("#DialogIconedDanger").modal('show');
        $("#btnSubmit").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}

$("#btnSettlementCompSubmit").click(function () {
    
    if (localStorage.getItem('phone') == "" || localStorage.getItem('phone') == null) {
        location.href = "/admin";
    }

    var user = { 
        MobileNumber: localStorage.getItem('phone'),
        TransactionNumber: $("#comp_transaction_number").val(),
        TransactionDescription: "Other Complaints: " + $("#comp_description").val()
    };

    if (user.TransactionNumber == "") {
        $("#errMsg").html('Please enter the transaction number');
        $("#transaction_number").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.TransactionNumber.length != 6) {
        $("#errMsg").html('Please enter a valid transaction number');
        $("#transaction_number").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.TransactionDescription == "Other Complaints: ") {
        $("#errMsg").html('Please enter the transaction description');
        $("#transaction_description").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    } else {
        addSettlementTranxs(user);
    }
});

const addSettlementTranxs = async (user) => {
    try {
        $("#btnSettlementCompSubmit").addClass('hidden');
        $("#btnCompProgress").removeClass('hidden');

        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $.ajax({
            type: "POST",
            url: "/Utility/PostSettlementOtherTransaction/",
            data: user,
            success: function (data) {
                console.log(data);
                if (!data) {
                    $("#DialogIconedDanger").modal('show');
                    $("#btnSettlementCompSubmit").removeClass('hidden');
                    $("#btnCompProgress").addClass('hidden');
                }
                else {
                    $("#DialogIconedSuccess").modal('show');
                    $("#btnCompProgress").addClass('hidden');
                    $("#btnSettlementCompSubmit").removeClass('hidden');
                    //location.href = "/seller";
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnSettlementCompSubmit").removeClass('hidden');
                $("#btnCompProgress").addClass('hidden');
            }
        });

    } catch (error) {
        console.log(error);
        $("#DialogIconedDanger").modal('show');
        $("#btnSettlementCompSubmit").removeClass('hidden');
        $("#btnCompProgress").addClass('hidden');
    }
}

$("#btnSettlementSubmit").click(function () {
     var agreed_price = "";//parseFloat($("#agreed_price").val().split('.')[0].replace(',', ''));// parseFloat($("#agreed_price").val());
      
    if (localStorage.getItem('phone') == "" || localStorage.getItem('phone') == null) {
        location.href = "/admin";
    }

    //if ($("#agreed_price").val() != "0.00") {
    //    var agree_p = $("#agreed_price").val().split('.')[0];
    //    var split_p = agree_p.split(',');
    //    var n = "";
    //    split_p.forEach(item => {
    //        n += item;
    //    })
    //    agreed_price = parseFloat(n);
    //}

    
     
    var user = {
        BankName: $("#bank_name").val(),
        AccountName: $("#account_name").val(),
        AccountNumber: $("#account_number").val(),
        MobileNumber: localStorage.getItem('phone'),
        TransactionNumber: $("#transaction_number").val(),
        //TransactionDescription: "Transaction Description: "+ $("#transaction_description").val(),
        //AgreedPrice: agreed_price.toString(), 
        TransactionDate: $("#transaction_date").val()
    };
     
     
    if (user.BankName == "") {
        $("#errMsg").html('Please select the Bank Name');
        $("#bank_name").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.AccountName == "") {
        $("#errMsg").html('Please enter the Account Name');
        $("#account_name").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.AccountNumber == "") {
        $("#errMsg").html('Please enter the Account Number');
        $("#account_number").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.AccountNumber.length != 10) {
        $("#DialogIconedInvalidAccount").modal('show');
        $("#account_number").focus();
        return false;
    }
    //if (user.AgreedPrice == "") {
    //    $("#errMsg").html('Please enter the transaction amount');
    //    $("#agreed_price").focus();
    //    $("#DialogIconedAllFieldsDanger").modal('show');
    //    return false;
    //}
    
    //if (user.TransactionDescription == "Transaction Description: ") {
    //    $("#errMsg").html('Please enter the transaction description');
    //    $("#transaction_description").focus();
    //    $("#DialogIconedAllFieldsDanger").modal('show');
    //    return false;
    //}
    if (user.TransactionNumber == "") {
        $("#errMsg").html('Please enter the transaction number');
        $("#transaction_number").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.TransactionNumber.length != 6) {
        $("#errMsg").html('Please enter a valid transaction number');
        $("#transaction_number").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }
    if (user.TransactionDate == "") {
        $("#errMsg").html('Please enter the transaction date');
        $("#transaction_description").focus();
        $("#DialogIconedAllFieldsDanger").modal('show');
        return false;
    }else {
        addSettlementTransaction(user);
    }
});

const addSettlementTransaction = async (user) => {
    try {
        $("#btnSettlementSubmit").addClass('hidden');
        $("#btnProgress").removeClass('hidden');

        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $.ajax({
            type: "POST",
            url: "/Utility/PostSettlementTransaction/",
            data: user,
            success: function (data) {
                console.log(data);
                if (!data) {
                    $("#DialogIconedDanger").modal('show');
                    $("#btnSettlementSubmit").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
                else {
                    $("#DialogIconedSuccess").modal('show');
                    $("#btnProgress").addClass('hidden');
                    $("#btnSettlementSubmit").removeClass('hidden');
                    //location.href = "/seller";
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnSettlementSubmit").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });

    } catch (error) {
        console.log(error);
        $("#DialogIconedDanger").modal('show');
        $("#btnSettlementSubmit").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}

var showAccept = function () {
    if ($("#seller_transaction_code").val() != "") {
        if ($('#chkTOC').is(":checked")) {

            $('#btnAccept').attr("disabled", false);
        } else {
            $('#btnAccept').attr("disabled", true);
            $("#btnProgress").addClass('hidden');
            $("#btnAccept").removeClass('hidden');
        }
    } else {
        let inputs = document.getElementById('chkTOC');
        inputs.checked = false;
    }
}

$("#btnRefundMe").click(function () {
    if (document.getElementById('smscode').value != "") {
        if ($("#bank_name").val() == "") {
            $("#errMsg").html('Please select your bank');
            $("#bank_name").focus();
            $("#actionSheetAlertError").modal('show');
            return false;
        }
        if ($("#account_name").val() == "") {
            $("#errMsg").html('Please enter your bank account name');
            $("#account_name").focus();
            $("#actionSheetAlertError").modal('show');
            return false;
        }
        if ($("#account_number").val().length != 10) {
            $("#errMsg").html('Please enter a valid bank account number');
            $("#account_number").focus();
            $("#actionSheetAlertError").modal('show');
            return false;
        }
        if ($("#email_address").val() == "") {
            $("#errMsg").html('Please enter an email address for payment receipt');
            $("#email_address").focus();
            $("#actionSheetAlertError").modal('show');
            return false;
        }

        //validate on server 


        var user = {
            BuyerBankName: $("#bank_name").val(),
            BuyerAccountName: $("#account_name").val(),
            BuyerAccountNumber: $("#account_number").val(),
            //BuyerMobileNumber: $("#phone_number").val(),
            BuyerEmailAddress: $("#email_address").val(),
            TransactionCode: $("#smscode").val(),
            TotalCost: $("#transaction_cost").val()
        };
        showRefund(user);

    }
})

const showRefund = async (user) => {
    $("#btnRefundMe").addClass('hidden');
    $("#btnRefundProgress").removeClass('hidden');
    $("#btnDecline").addClass('hidden');
    const options = {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    $.ajax({
        type: "PUT",
        url: "/Utility/BuyerRequestRefund/", 
        data: user,
        dataType: "json",
        success: function (data) {

            if (!data) {
                $("#ErrorDialogIconedInfo").modal('show');
                $("#btnRefundProgress").addClass('hidden');
                $("#DialogForm").modal('hide');
                $("#btnRefundMe").removeClass('hidden');
                $("#btnSat").removeClass('hidden');
            }
            else {
                var _query = location.search.split('='); 
                $("#trnx_number").html(_query[1].split('&')[1]);
                $("#DialogForm").modal('hide');
                $("#RefundDialogIconedSuccess").modal('show');
            }
        },
        error: function (err) {
            $("#ErrorDialogIconedInfo").modal('show');
            $("#btnRefundProgress").addClass('hidden');
            $("#btnRefundMe").removeClass('hidden');
            $("#DialogForm").modal('hide');
            $("#btnProgress").addClass('hidden');
            $("#btnSat").removeClass('hidden');
        }
    });  
     

}


$("#btnAccept").click(function () {
    let inputs = document.getElementById('chkTOC');
    inputs.checked = false;
    if ($("#seller_transaction_code").val() != "") {
          
        var user = { 
            BuyerEmailAddress: $("#email_address").val(),
            TransactionCode: $("#seller_transaction_code").val(),
            TotalCost: $("#transaction_cost").val()
        };

        showPayment(user);

    }
})

const showPayment = async (user) => {
    $("#btnAccept").addClass('hidden');
    $("#btnProgress").removeClass('hidden');
    $("#btnDecline").addClass('hidden');
    const options = {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    $.ajax({
        type: "PUT",
        url: "/Utility/BuyerAcceptPayment/", 
        data: user,
        dataType: "json",
        success: function (data) {
            if (!data) {
                $("#no-item").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
                $("#btnAccept").removeClass('hidden');
                $("#btnDecline").removeClass('hidden');
            }
            else {

                location.href = '/buyer/transverification?transcode=' + $("#seller_transaction_code").val() + "&account_name=" + user.BuyerAccountName + "&email_address=" + user.BuyerEmailAddress + "&bank_name=" + user.BuyerBankName + "&transaction_cost=" + user.TotalCost.split('.')[0].replace(',', '');
            }
        },
        error: function (err) {
            $("#veriSpinner").addClass('hidden');
            $("#DialogIconedDanger").modal('show');
        }
    });

    //const res = await fetch(uri + "/buyeracceptpayment", options);
    //if (!res.ok) {
    //    throw new Error(res.status);
    //}
    //const data = await res.json();

    //console.log(data);
    //if (!data) {
    //    $("#no-item").removeClass('hidden');
    //    $("#btnProgress").addClass('hidden');
    //    $("#btnAccept").removeClass('hidden');
    //    $("#btnDecline").removeClass('hidden');
    //}
    //else {

    //    location.href = '/buyer/transverification?transcode=' + $("#seller_transaction_code").val() + "&account_name=" + user.BuyerAccountName + "&email_address=" + user.BuyerEmailAddress + "&bank_name=" + user.BuyerBankName + "&transaction_cost=" + user.TotalCost.split('.')[0].replace(',', '');
    //}

}



var calcCommission = function () {
    if ($("#agreed_price").val() != "") {
        var agreed_price = "";//parseFloat($("#agreed_price").val());
        var agree_p = $("#agreed_price").val().split('.')[0];
        var split_p = agree_p.split(',');
        var n = "";
        split_p.forEach(item => {
            n += item;
        })
        agreed_price = parseFloat(n);

        var percentage = 2.5 / 100;
        var commission = parseFloat(agreed_price * percentage);
        $("#commission").val(formatMoney(commission));
        $("#agreed_price").val(formatMoney(agreed_price));
        var shipping = "0.00";
        if ($("#shipping").val() != "") {
            //shipping = parseFloat($("#shipping").val());
            var ship_p = $("#shipping").val().split('.')[0];
            var split_s = ship_p.split(',');
            var s = "";
            split_s.forEach(sitem => {
                s += sitem;
            })
            shipping = parseFloat(s);
        }
        if (shipping == "0.00")
            $("#transaction_cost").val(formatMoney(commission + agreed_price));
        else
            $("#transaction_cost").val(formatMoney(commission + agreed_price + shipping));
    } else {
        $("#commission").val("0.00");
        $("#transaction_cost").val("0.00");
        $("#shipping").val("0.00");
        $('#btnSubmit').attr("disabled", true);
        let inputs = document.getElementById('chkTOC');
        inputs.checked = false;
    }
}

var addShipping = function () {
    if ($("#shipping").val() != "") {
        if ($("#agreed_price").val() != "") {
            var commission = "";//parseFloat($("#commission").val().split('.')[0].replace(',', ''));//parseFloat($("#commission").val());
            var agreed_price = "";//parseFloat($("#agreed_price").val().split('.')[0].replace(',', ''));// parseFloat($("#agreed_price").val());
            var shipping = "";//parseFloat($("#shipping").val());

            var ship_p = $("#shipping").val().split('.')[0];
            var split_s = ship_p.split(',');
            var s = "";
            split_s.forEach(sitem => {
                s += sitem;
            })
            shipping = parseFloat(s);

            var agree_p = $("#agreed_price").val().split('.')[0];
            var split_p = agree_p.split(',');
            var n = "";
            split_p.forEach(item => {
                n += item;
            })
            agreed_price = parseFloat(n);

            var commission_p = $("#commission").val().split('.')[0];
            var split_c = commission_p.split(',');
            var c = "";
            split_c.forEach(citem => {
                c += citem;
            })
            commission = parseFloat(c);

            var transaction_cost = parseFloat(commission + agreed_price + shipping);
            $("#transaction_cost").val(formatMoney(transaction_cost));
            $("#shipping").val(formatMoney(shipping));
        }
    } else {
        var commission = "";//parseFloat($("#commission").val().split('.')[0].replace(',', ''));
        var agreed_price = "";//parseFloat($("#agreed_price").val().split('.')[0].replace(',', ''));

        var commission_p = $("#commission").val().split('.')[0];
        var split_c = commission_p.split(',');
        var c = "";
        split_c.forEach(citem => {
            c += citem;
        })
        commission = parseFloat(c);

        var agree_p = $("#agreed_price").val().split('.')[0];
        var split_p = agree_p.split(',');
        var n = "";
        split_p.forEach(item => {
            n += item;
        })
        agreed_price = parseFloat(n);

        var transaction_cost = parseFloat(commission + agreed_price);
        $("#transaction_cost").val(formatMoney(transaction_cost));
        $("#shipping").val("0.00");
    }
}

const _key = "pk_test_eda062a81ed9102f087935cbf3d78dbbe5297105";

function payWithPaystack() {
    // e.preventDefault();
     
    document.getElementById('hidePayment1').style.display  ='none';
    document.getElementById('hidePayment2').style.display = 'none';
    document.getElementById('btnProgress').style.display = 'block';
    payNowWithPaystack();
}

function payNowWithPaystack(){
    var transcode = localStorage.getItem('TransCode');
    var name_splitter = localStorage.getItem('account_name').split('%20');

    var first = name_splitter[0];
    var last = name_splitter[1];

    var email = localStorage.getItem('email_address');
    var price = localStorage.getItem('transaction_cost');

    //var handler = PaystackPop.setup({
    //    key: _key, // Replace with your public key
    //    email: email,//document.getElementById("email-address").value,
    //    amount: price * 100,
    //    //firstname: first,//document.getElementById("first-name").value,
    //    //lastname: last,//document.getElementById("first-name").value,
    //    ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
    //    // label: "Optional string that replaces customer email"
    //    onClose: function () { 
    //        document.getElementById('hidePayment1').style.display = 'block'; 
             
    //        document.getElementById('hidePayment2').style.display = 'block'; 
            
    //        document.getElementById('btnProgress').style.display = 'none';
    //        location.reload();
    //    },
    //    callback: function (response) {
    //        $("#hidePayment1").addClass('hidden');
    //        $("#hidePayment2").addClass('hidden');
    //        processPayment(transcode);
    //    }
    //});

    //handler.openIframe();

    
             
  
           
        MonnifySDK.initialize({
            amount: price,
            currency: "NGN",
            reference: '' + Math.floor((Math.random() * 1000000000) + 1),
            customerName: first+" "+last,
            customerEmail: email,
            apiKey: "MK_TEST_T37JHPDMRU",
            contractCode: "9888465873",
            paymentDescription: "Test Pay",
            isTestMode: true,
            metadata: {
                    "name": "Damilare",
                    "age": 45
            },
            paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
             
            onComplete: function(response){
                //Implement what happens when transaction is completed.
                //console.log(response);
                //$("#hidePayment1").addClass('hidden');
                //$("#hidePayment2").addClass('hidden');
                //processPayment(transcode);
                var _stringy = response;
                  
                if (_stringy.status == "SUCCESS") {
                    $("#hidePayment1").addClass('hidden');
                    $("#hidePayment2").addClass('hidden');
                    processPayment(transcode);
                }  
            },
            onClose: function(data){
                //Implement what should happen when the modal is closed here
                console.log(data);
                var _string = data;

                if (_string.status == "FAILED") {
                    location.reload();
                } else {
                    if (_string.paymentStatus == "USER_CANCELLED") {
                        location.reload();
                    }
                }
            }
        });
     
}

function reProcessPayment() {
    var code = localStorage.getItem("TransCode");
    processPayment(code);
}

var processPayment = async (_transcode) => {
    $("#hidePayment1").addClass('hidden');
    $("#hidePayment2").addClass('hidden');

    const option = {
        method: 'PUT',
        redirect: 'follow'
    }

    $.ajax({
        type: "GET",
        url: "/Utility/SetBuyerPayment/",
        contentType: "application/json; charset=utf-8",
        data: {
            'id': _transcode
        },
        dataType: "json",
        success: function (data) {
            if (!data) {
                $("#no-item").removeClass('hidden');
                $("#veriSpinner").addClass('hidden');
            }
            else {
                location.href = "/buyer/success?id=" + _transcode;
            }
        },
        error: function (err) {
            $("#veriSpinner").addClass('hidden');
            $("#DialogIconedDanger").modal('show');
        }
    });

    //const res = await fetch(uri + "/setbuyerpayment?id=" + _transcode, option);
    //if (!res.ok) {
    //    console.log(res.status);
    //}
    //const data = await res.json();

    //if (!data) {
    //    $("#no-item").removeClass('hidden');
    //    $("#veriSpinner").addClass('hidden');
    //}
    //else {
    //    location.href = "/buyer/success?id=" + _transcode;
    //}
}


$("#btnVerify").click(function () {
    if ($("#smscode").val() != "") {
        document.getElementById('href_close').style.display = 'none';
        //document.getElementById('btncancel').style.display = 'none';
        veriCheck($("#smscode").val());

    } else {
        $("#DialogIconedDanger").modal('show');
    }

})

var veriCheck = async (_transcode) => {
    $("#btnVerify").addClass('hidden');
    //$("#btnSat").addClass('hidden');
    $("#btnProgressx").removeClass('hidden');
    //$("#veriSpinner").removeClass('hidden');
    //$("#btnProgress").removeClass('hidden');

    try {
        const option = {
            method: 'GET',
            redirect: 'follow'
        }

        $.ajax({
            type: "GET",
            url: "/Utility/ConfirmDeliveryCode/",
            data: {
                'confirmcode': _transcode 
            },
            success: function (data) {
                console.log(data);
                if (data.length == 0) {
                    $("#DialogIconedDanger").modal('show');
                    $("#btnVerify").removeClass('hidden');
                    $("#btnSat").removeClass('hidden');
                    $("#veriSpinner").addClass('hidden');
                    $("#btnProgressx").addClass('hidden');
                    $("#ModalBasicPay").modal('hide');
                }
                else {
                    data.forEach(item => {
                        document.getElementById('transDec').innerHTML = item.transactionDescription;
                        if (item.sellerCodeConfirmed == true) {
                            document.getElementById('transStatus').innerHTML = 'COLLECTED';
                        } else {
                            document.getElementById('transStatus').innerHTML = 'NOT COLLECTED';
                        }

                    });
                    $("#DialogIconedSuccess").modal('show');
                    $("#btnVerify").removeClass('hidden');
                    $("#btnSat").removeClass('hidden');
                    $("#veriSpinner").addClass('hidden');
                    $("#btnProgressx").addClass('hidden');
                    $("#ModalBasicPay").modal('hide');
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnVerify").removeClass('hidden');
                $("#btnSat").removeClass('hidden');
                $("#veriSpinner").addClass('hidden');
                $("#btnProgressx").addClass('hidden');
                $("#ModalBasicPay").modal('hide');
            }
        });

        
    } catch (error) {

        $("#DialogIconedDanger").modal('show');
        $("#btnVerify").removeClass('hidden');
        $("#btnSat").removeClass('hidden');
        $("#veriSpinner").addClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}



$("#btnVerifyStatus").click(function () {
    if ($("#smscode").val() != "") {

        veriCheckStatus($("#smscode").val());

    } else {
        $("#DialogIconedDanger").modal('show');
    }

})

var veriCheckStatus = async (_transcode) => {
    $("#btnVerifyStatus").addClass('hidden');
    $("#btnProgress").removeClass('hidden');

    try {
        const option = {
            method: 'GET',
            redirect: 'follow'
        }

        $.ajax({
            type: "GET",
            url: "/Utility/ConfirmStatus/",
            data: {
                'confirmcode': _transcode
            },
            success: function (data) {
                console.log(data);
                if (data.length == 0) {
                    $("#DialogIconedDanger").modal('show');
                }
                else {
                    data.forEach(item => {
                        document.getElementById('transDec').innerHTML = item.transactionDescription;
                        if (item.paid == true) {
                            document.getElementById('transStatus').innerHTML = 'PAID';

                        }
                        else {
                            document.getElementById('transStatus').innerHTML = 'NOT PAID';
                        }
                        if (item.transactionStatus == 'danger' || item.transactionStatus == 'dangers') {
                            document.getElementById('picked').innerHTML = 'TRANSACTION CANCELED';
                        } else {
                            if (item.sellerCodeConfirmed == true) {
                                document.getElementById('picked').innerHTML = 'ITEM PICKED';
                            } else {
                                document.getElementById('picked').innerHTML = 'ITEM NOT PICKED';
                            }
                        }
                    });
                    $("#DialogIconedSuccess").modal('show');
                    $("#btnVerifyStatus").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnVerifyStatus").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });

         
    } catch (error) {

        $("#DialogIconedDanger").modal('show');
        $("#btnVerifyStatus").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}

$("#btnRegister").click(function () {
    var user = {
        Username: $("#ephone").val(),
        Password: $("#password1").val(),
        Password2: $("#password2").val()
    };
    if (user.Username == "" || user.Password == "" || (user.Password != user.Password2)) {
        $("#DialogIconedAllFieldsDanger").modal('show');
    } else {

        addUser();
    }
})

const addUser = async () => {
    try {
        $("#btnRegister").addClass('hidden');
        $("#btnProgress").removeClass('hidden');

        //const options = {
        //    method: 'POST',
        //    body: JSON.stringify(user),
        //    headers: {
        //        'Content-Type': 'application/json'
        //    }
        //}

        var _user = {
            Username: $("#ephone").val(),
            Password: $("#password1").val()
        };

        console.log(_user);
        $.ajax({ 
            type: "POST",
            url: "/Admin/AddUser/", 
            data: {
                'Username': $("#ephone").val(),
                'Password': $("#password1").val()
            }, 
            success: function (data) {
                console.log(data);
                if (data != true) {
                    $("#DialogIconedExist").modal('show');
                    $("#btnRegister").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
                else {
                    location.href = "/admin/";
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnRegister").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });


        //const res = await fetch(uri + "/newuser", options);
        //if (!res.ok) {
        //    $("#DialogIconedDanger").modal('show');
        //    $("#btnRegister").removeClass('hidden');
        //    $("#btnProgress").addClass('hidden');
        //}
        //const data = await res.json();
        //console.log(data);
        //if (data != true) {
        //    $("#DialogIconedExist").modal('show');
        //    $("#btnRegister").removeClass('hidden');
        //    $("#btnProgress").addClass('hidden');
        //}
        //else {
        //    location.href = "/admin/";
        //}
    } catch (error) {

        $("#DialogIconedDanger").modal('show');
        $("#btnRegister").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}



$("#btnLogin").click(function () {
    var user = {
        Username: $("#ephone").val(),
        Password: $("#password").val()
    };
    if (user.Username == "" || user.Password == "") {
        $("#DialogIconedAllFieldsDanger").modal('show');
    } else {
        UserLogin(user);
    }
})

const UserLogin = async (user) => {
    try {
        $("#btnLogin").addClass('hidden');
        $("#btnProgress").removeClass('hidden');

        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $.ajax({
            type: "GET",
            url: "/Admin/Login/",
            contentType: "application/json; charset=utf-8",
            data: user,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data == true) {
                    localStorage.setItem('phone', user.Username)
                    $("#btnLogin").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                    location.href = "/seller";
                } else {
                    $("#DialogIconedIvalid").modal('show');
                    $("#btnLogin").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnLogin").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });
         

    } catch (error) {

        $("#DialogIconedDanger").modal('show');
        $("#btnLogin").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}


$("#btnForgot").click(function () {
    var user = {
        Username: $("#ephone").val()
    };
    if (user.Username == "") {
        $("#DialogIconedAllFieldsDanger").modal('show');
    } else {
        UserForgot(user);
    }
})

const UserForgot = async (user) => {
    try {
        $("#btnForgot").addClass('hidden');
        $("#btnProgress").removeClass('hidden');

        const options = {
            method: 'GET',
            redirect: 'follow'
        }

        $.ajax({
            type: "GET",
            url: "/Admin/ForgotPassword/",
            contentType: "application/json; charset=utf-8",
            data: {
                'Username': $("#ephone").val()
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.length == 0) {
                     
                    $("#DialogIconedDanger").modal('show');
                    $("#btnForgot").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
                else {
                    data.forEach(item => {
                        console.log(item.recoveryCode);
                        if (item.recoveryCode.includes("Message has been sent successfully")) {

                            $("#DialogIconedSuccess").modal('show');
                            $("#btnForgot").removeClass('hidden');
                            $("#btnProgress").addClass('hidden'); 
                            
                        } else {
                             
                            $("#DialogIconedInfo").modal('show');
                            $("#btnForgot").removeClass('hidden');
                            $("#btnProgress").addClass('hidden');
                        }
                    });
                    
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnForgot").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });
          
    } catch (error) {
        console.log(error);
        $("#DialogIconedDanger").modal('show');
        $("#btnForgot").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}


$("#btnChangePassword").click(function () {
    if (localStorage.getItem('phone') == null)
        location.href = "/admin";
    var user = {
        Username: localStorage.getItem('phone'),
        Password: $("#password").val(),
        Password2: $("#password2").val()
    };
    if (user.Username == "" || user.Password == "" || (user.Password != user.Password2)) {
        $("#DialogIconedAllFieldsDanger").modal('show');
    } else {
         
        UserChangeLogin(user);
    }
})

const UserChangeLogin = async (user) => {
    try {
        $("#btnLogin").addClass('hidden');
        $("#btnProgress").removeClass('hidden');
         

        $.ajax({
            type: "GET",
            url: "/Admin/ChangePassword/",
            contentType: "application/json; charset=utf-8",
            data: user,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data == true) { 
                    localStorage.clear();
                    location.href = "/admin";
                } else {
                    $("#DialogIconedIvalid").modal('show');
                    $("#btnLogin").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnLogin").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });
         

    } catch (error) {

        $("#DialogIconedDanger").modal('show');
        $("#btnLogin").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}


$("#btnVerifyPin").click(function () {
    var user = {
        RecoveryCode: $("#smscode").val()
    };
    if (user.RecoveryCode == "") {
        $("#DialogIconedAllFieldsDanger").modal('show');
    } else {
        VerifyResetPin(user);
    }
})

const VerifyResetPin = async (user) => {
    try {
        $("#btnVerifyPin").addClass('hidden');
        $("#btnProgress").removeClass('hidden');

        const options = {
            method: 'GET',
            redirect: 'follow'
        }

        $.ajax({
            type: "GET",
            url: "/Admin/RecoveryCode/",
            contentType: "application/json; charset=utf-8",
            data: {
                'RecoveryCode': $("#smscode").val()
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (!data) {
                    $("#DialogIconedDanger").modal('show');
                    $("#btnVerifyPin").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
                else {
                    if (data.length > 0)
                        location.href = "/admin/resetpassword";
                    else {
                        $("#DialogIconedDanger").modal('show');
                        $("#btnVerifyPin").removeClass('hidden');
                        $("#btnProgress").addClass('hidden');
                    }
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnVerifyPin").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });
         
    } catch (error) {

        $("#DialogIconedDanger").modal('show');
        $("#btnVerifyPin").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}

$("#btnClearReset").click(function () {
    $("#btnProgress").addClass('hidden');
    $("#btnSat").removeClass('hidden');
});
$("#btnClearCancel").click(function () {
    $("#btnProgress").addClass('hidden');
    $("#btnSat").removeClass('hidden');
});


$("#btnReset").click(function () {
    var user = {
        Username: $("#ephone").val(),
        Password: $("#password").val(),
        Password2: $("#password2").val()
    };
    if (user.Username == "" || user.Password == "" && (user.Password != user.Password2)) {
        $("#DialogIconedAllFieldsDanger").modal('show');
    } else {
        PasswordReset(user);
    }
})

const PasswordReset = async (user) => {
    try {
        $("#btnReset").addClass('hidden');
        $("#btnProgress").removeClass('hidden');

        const options = {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $.ajax({
            type: "PUT",
            url: "/Admin/Reset/", 
            data: {
                'Username': $("#ephone").val(),
                'Password': $("#password").val()
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (!data) {
                    $("#DialogIconedDanger").modal('show');
                    $("#btnReset").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
                else {
                    location.href = "/admin/";
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnReset").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });
         
    } catch (error) {

        $("#DialogIconedDanger").modal('show');
        $("#btnReset").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }



}

if ($("#sellerpage").length > 0) {


    CheckOut(); 
    setInterval(function () { CheckOut(); }, 180000);

    

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    var _query = localStorage.getItem('phone');

    $.ajax({
        type: "GET",
        url: "/Utility/GetSellerTransactions/",
        contentType: "application/json; charset=utf-8",
        data: {
            'phone': _query
        },
        dataType: "json",
        success: function (data) { 
            fetchSellerData(data);
        },
        error: function (err) {
            $("#veriSpinner").addClass('hidden');
            $("#DialogIconedDanger").modal('show');
        }
    });
     
}

function showCatch() {
    $("#veriSpinner").addClass('hidden');
    $("#DialogIconedDanger").modal('show');
}

function fetchSellerData(data) {
    console.log(data);
    if (data.length != 0) {
        var htm = "";
        var inprog_htm = "";
        var canceled_htm = "";
        var complete_htm = "";
        $("#overview2 .transactions").html(htm);
        $("#inprogress .transactions").html(htm);
        $("#canceled1 .transactions").html(htm);
        $("#completed .transactions").html(htm);

        data.forEach(item => {
            var status = "";
            if (item.transactionStatus == "warning") {
                status = "IN PROGRESS";

                inprog_htm += "<a href='/seller/transactiondetail?id=" + item.id + "' class='item'>"
                inprog_htm += "           <div class='detail'>"

                inprog_htm += "               <div>"
                inprog_htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.sellertTransactionCode + "</h2></strong>"

                inprog_htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                inprog_htm += "                    <p>" + item.transactionDate + "</p>"
                inprog_htm += "                </div>"
                inprog_htm += "            </div> "
                inprog_htm += "             <div class='right'>"
                inprog_htm += "                <span class='badge badge-" + item.transactionStatus + "'> " + status + "</span>"
                inprog_htm += "        </div>"
                inprog_htm += "        </a>";


            }
            else {
                if (item.transactionStatus == "danger" || item.transactionStatus == "dangers") {
                    if (item.transactionStatus == "dangers") {
                        status = "CANCELED";
                    } else {
                        if (item.transactionStatus == "danger")
                            status = "RETURNED";
                    }

                    canceled_htm += "<a href='/seller/transactiondetail?id=" + item.id + "' class='item'>"
                    canceled_htm += "           <div class='detail'>"

                    canceled_htm += "               <div>"
                    canceled_htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.sellertTransactionCode + "</h2></strong>"

                    canceled_htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                    canceled_htm += "                    <p>" + item.transactionDate + "</p>"
                    canceled_htm += "                </div>"
                    canceled_htm += "            </div> "
                    canceled_htm += "             <div class='right'>"
                    canceled_htm += "                <span class='badge badge-danger'> " + status + "</span>"
                    canceled_htm += "        </div>"
                    canceled_htm += "        </a>";

                }
                else {
                    if (item.transactionStatus == "success") {

                        status = "COMPLETED";

                        complete_htm += "<a href='/seller/transactiondetail?id=" + item.id + "' class='item'>"
                        complete_htm += "           <div class='detail'>"

                        complete_htm += "               <div>"
                        complete_htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.sellertTransactionCode + "</h2></strong>"

                        complete_htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                        complete_htm += "                    <p>" + item.transactionDate + "</p>"
                        complete_htm += "                </div>"
                        complete_htm += "            </div> "
                        complete_htm += "             <div class='right'>"
                        complete_htm += "                <span class='badge badge-" + item.transactionStatus + "'> " + status + "</span>"
                        complete_htm += "        </div>"
                        complete_htm += "        </a>";

                    }
                }
            }

            if (status == "COMPLETED") {
                htm += "<a href='/seller/transactiondetail?id=" + item.id + "' class='item'>"
                htm += "           <div class='detail'>"

                htm += "               <div>"
                htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.sellertTransactionCode + "</h2></strong>"

                htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                htm += "                    <p>" + item.transactionDate + "</p>"
                htm += "                </div>"
                htm += "            </div> "
                htm += "             <div class='right'>"
                htm += "                <span class='badge badge-" + item.transactionStatus + "'> " + status + "</span>"
                htm += "        </div>"
                htm += "        </a>";
            } else {
                if (status == "CANCELED" || status == "RETURNED") {
                    htm += "<a href='/seller/transactiondetail?id=" + item.id + "' class='item'>"
                    htm += "           <div class='detail'>"

                    htm += "               <div>"
                    htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.sellertTransactionCode + "</h2></strong>"

                    htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                    htm += "                    <p>" + item.transactionDate + "</p>"
                    htm += "                </div>"
                    htm += "            </div> "
                    htm += "             <div class='right'>"
                    htm += "                <span class='badge badge-danger'> " + status + "</span>"
                    htm += "        </div>"
                    htm += "        </a>";
                } else {

                    htm += "<a href='/seller/transactiondetail?id=" + item.id + "' class='item'>"
                    htm += "           <div class='detail'>"

                    htm += "               <div>"
                    htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.sellertTransactionCode + "</h2></strong>"

                    htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                    htm += "                    <p>" + item.transactionDate + "</p>"
                    htm += "                </div>"
                    htm += "            </div> "
                    htm += "             <div class='right'>"
                    htm += "                <span class='badge badge-" + item.transactionStatus + "'> " + status + "</span>"
                    htm += "        </div>"
                    htm += "        </a>";
                }
            }
        });
        $("#veriSpinner").addClass('hidden');
        $("#overview2 .transactions").append(htm);
        $("#inprogress .transactions").append(inprog_htm);
        $("#completed .transactions").append(complete_htm);
        $("#canceled1 .transactions").append(canceled_htm);

        var _query = location.search.split('=');
        console.log(_query);
        if (_query[1] == 2) {
            $("#overview2").removeClass('show active');
            $("#completed").removeClass('show active');
            $("#canceled1").removeClass('show active');
            $("#inprogress").addClass('show active');
            $("#nav-all").removeClass('active');
            $("#nav-progress").addClass('active');
        }

    } else {
        //$("#DialogIconedEmpty").modal('show');
        $("#veriSpinner").addClass('hidden');
    }
}


//Seller Transaction Details

function sellertransdetailcheckStat() {
    $("#aCheck").addClass('hidden');
    $("#btnProgress").removeClass('hidden');
    location.href = "/seller/status?code=" + document.getElementById('trans-code').value;
}

if ($("#sellertransactiondetpage").length > 0) {
     

    var _query = location.search.split('='); 
     
    $.ajax({
        type: "GET",
        url: "/Utility/SellerTransactionDetails/",
        contentType: "application/json; charset=utf-8",
        data: {
            'id': _query[1]
        },
        dataType: "json",
        success: function (data) {
            fetchSellerTransDetailData(data);
            $("#veriSpinnerx").addClass('hidden');
        },
        error: function (err) {
            $("#veriSpinner").addClass('hidden');
            $("#veriSpinnerx").addClass('hidden');
            $("#DialogIconedDanger").modal('show');
        }
    });
     

}

function showCatch(error) {

    $("#DialogIconedDanger").modal('show');
}

function fetchSellerTransDetailData(data) {
    if (data) {
        console.log(data);
        data.forEach(item => {
            document.getElementById('total-cost').innerHTML = '&#8358;' + formatMoney(parseFloat(item.totalCost));
            document.getElementById('transaction-code').innerHTML = item.sellertTransactionCode;
            document.getElementById('trans-code').value = item.sellertTransactionCode;
            document.getElementById('transaction-details').innerHTML = item.transactionDescription;
            document.getElementById('transaction-date').innerHTML = item.transactionDate;
            document.getElementById('transaction-phone').innerHTML = item.sellerMobileNumber;
            document.getElementById('buyer-phone').innerHTML = item.buyerMobileNumber;
            document.getElementById('transaction-bank-name').innerHTML = item.sellerBankName;
            document.getElementById('transaction-account-name').innerHTML = item.sellerAccountName;
            document.getElementById('transaction-account-number').innerHTML = item.sellerAccountNumber;

            var delivery = "";
            if (item.paid == true) {
                document.getElementById('transStatus').innerHTML = "The buyer has collected the item(s) on " +item.reasons.split('on')[1];
                $("#transStatus").addClass('sly-warning');
                if (item.transactionStatus == 'danger' || item.transactionStatus == 'dangers') {
                    document.getElementById('transStatus').innerHTML = item.reasons;
                    $("#transStatus").addClass('sly-danger');
                }
                delivery = "<strong>Delivery Number</strong><span>" + item.confirmationCode + "</span>";
                $("#delivery_number").html(delivery);
            }
            else if (item.paid == false) {
                document.getElementById('transStatus').innerHTML = item.reasons;
                $("#transStatus").removeClass('sly-success');
                $("#transStatus").removeClass('sly-danger');
                $("#transStatus").addClass('sly-warning');
            }
            if (item.transactionStatus == "danger" || item.transactionStatus == "dangers") {
                document.getElementById('transStatus').innerHTML = item.reasons;
                $("#transStatus").removeClass('sly-warning');
                $("#transStatus").removeClass('sly-success');
                $("#transStatus").addClass('sly-danger');
                $("#transStatus2").addClass('sly-danger');
            }
            else if (item.sellerCodeConfirmed == true) {
                document.getElementById('transStatus').innerHTML = item.reasons;
                $("#transStatus").removeClass('sly-warning');
                $("#transStatus").removeClass('sly-danger');
                $("#transStatus").addClass('sly-success');
            } else if (item.sellerCodeConfirmed == false && item.paid == true) {
                document.getElementById('transStatus').innerHTML = item.reasons;
                $("#transStatus").removeClass('sly-success');
                $("#transStatus").removeClass('sly-danger');
                $("#transStatus").addClass('sly-warning');
            }

            if (item.transactionStatus == "danger" || item.transactionStatus == "dangers") {
                $("#aCheck").addClass('hidden');
                $("#span_stats").removeClass('hidden');
                //$("#span_transact_status").html('This transaction has been declined by the Buyer.');
                //$("#span_transact_status").addClass('badge-danger');
                if (item.transactionStatus == "danger") {

                    
                    var ship = parseInt((0.5 * item.shippingCost)) + parseInt(item.shippingCost);
                     
                    var _total = formatMoney(parseFloat(ship));
                    var refunds = "";
                    
                    if (item.processed) {
                        refunds = "<strong class='sly-success'>Refunded on "+item.refundDate+"</strong><h3 class='m-0 sly-success'>&#8358;" + _total + "</h3>";
                    } else {
                        refunds = "<strong class='sly-danger'>Pending Refund</strong><h3 class='m-0 sly-danger'>&#8358;" + _total + "</h3>";
                    }

                    $("#refunds").html(refunds);
                    $("#refunds").removeClass('hidden');
                }
            } else {
                if (item.transactionStatus == "success") {
                    $("#aCheck").addClass('hidden');
                    $("#span_stats").removeClass('hidden');
                    //$("#span_transact_status").html('This transaction was successfuly completed.');
                    //$("#span_transact_status").addClass('badge-success');
                }
            }
        });

    }
}

//function formatMoney(number, decPlaces, decSep, thouSep) {
//    return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
//}

function CheckOut() {
    $.ajax({

        type: "GET",
        url: "/Utility/CheckBuyerCount/",
        data: { phone: localStorage.getItem('phone') },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#spnBuyerAlerts").html(data);
        },
        error: function (req, status, error) {

        }
    });

    $.ajax({

        type: "GET",
        url: "/Utility/CheckSellerCount/",
        data: { phone: localStorage.getItem('phone') },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#spnSellerAlerts").html(data);
        },
        error: function (req, status, error) {

        }
    });
}
if ($("#buyerpager").length > 0) {

    CheckOut();
    setInterval(function () { CheckOut(); }, 180000);

    
   
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        var _query = localStorage.getItem('phone');

        $.ajax({
            type: "GET",
            url: "/Utility/GetBuyerTransactions/",
            contentType: "application/json; charset=utf-8",
            data: {
                'phone': _query
            },
            dataType: "json",
            success: function (data) {
                fetchBuyerData(data);
            },
            error: function (err) {
                $("#veriSpinner").addClass('hidden');
                $("#DialogIconedDanger").modal('show');
            }
        });
     
    }

function fetchBuyerData(data) {
        console.log(data);
        if (data.length != 0) {
            var htm = "";
            var inprog_htm = "";
            var canceled_htm = "";
            var complete_htm = "";
            $("#overview2 .transactions").html(htm);
            $("#inprogress .transactions").html(htm);
            $("#canceled1 .transactions").html(htm);
            $("#completed .transactions").html(htm);

            data.forEach(item => {
                var status = "";
                if (item.transactionStatus == "warning") {
                    status = "IN PROGRESS";

                    inprog_htm += "<a href='/buyer/transactiondetails?id=" + item.id + "' class='item'>"
                    inprog_htm += "           <div class='detail'>"

                    inprog_htm += "               <div>"
                    inprog_htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.transactionCode + "</h2></strong>"

                    inprog_htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                    inprog_htm += "                    <p>" + item.transactionDate + "</p>"
                    inprog_htm += "                </div>"
                    inprog_htm += "            </div> "
                    inprog_htm += "             <div class='right'>"
                    inprog_htm += "                <span class='badge badge-" + item.transactionStatus + "'> " + status + "</span>"
                    inprog_htm += "        </div>"
                    inprog_htm += "        </a>";


                }
                else {
                    if (item.transactionStatus == "danger" || item.transactionStatus == "dangers") {
                        if (item.transactionStatus == "dangers") {
                            status = "CANCELED";
                        } else {
                            if (item.transactionStatus == "danger")
                                status = "RETURNED";
                        }

                        canceled_htm += "<a href='/buyer/transactiondetails?id=" + item.id + "' class='item'>"
                        canceled_htm += "           <div class='detail'>"

                        canceled_htm += "               <div>"
                        canceled_htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.transactionCode + "</h2></strong>"

                        canceled_htm += "                   <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                        canceled_htm += "                    <p>" + item.transactionDate + "</p>"
                        canceled_htm += "                </div>"
                        canceled_htm += "            </div> "
                        canceled_htm += "             <div class='right'>"
                        canceled_htm += "                <span class='badge badge-danger'> " + status + "</span>"
                        canceled_htm += "        </div>"
                        canceled_htm += "        </a>";


                    }
                    else {
                        if (item.transactionStatus == "success") {
                            status = "COMPLETED";

                            complete_htm += "<a href='/buyer/transactiondetails?id=" + item.id + "' class='item'>"
                            complete_htm += "           <div class='detail'>"

                            complete_htm += "               <div>"
                            complete_htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.transactionCode + "</h2></strong>"

                            complete_htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                            complete_htm += "                    <p>" + item.transactionDate + "</p>"
                            complete_htm += "                </div>"
                            complete_htm += "            </div> "
                            complete_htm += "             <div class='right'>"
                            complete_htm += "                <span class='badge badge-" + item.transactionStatus + "'> " + status + "</span>"
                            complete_htm += "        </div>"
                            complete_htm += "        </a>";
                        }
                    }
                }

                if (status == "COMPLETED") {
                    htm += "<a href='/buyer/transactiondetails?id=" + item.id + "' class='item'>"
                    htm += "           <div class='detail'>"

                    htm += "               <div>"
                    htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.transactionCode + "</h2></strong>"

                    htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                    htm += "                    <p>" + item.transactionDate + "</p>"
                    htm += "                </div>"
                    htm += "            </div> "
                    htm += "             <div class='right'>"
                    htm += "                <span class='badge badge-" + item.transactionStatus + "'> " + status + "</span>"
                    htm += "        </div>"
                    htm += "        </a>";
                } else {
                    if (status == "CANCELED" || status == "RETURNED") {
                        htm += "<a href='/buyer/transactiondetails?id=" + item.id + "' class='item'>"
                        htm += "           <div class='detail'>"

                        htm += "               <div>"
                        htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.transactionCode + "</h2></strong>"

                        htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                        htm += "                    <p>" + item.transactionDate + "</p>"
                        htm += "                </div>"
                        htm += "            </div> "
                        htm += "             <div class='right'>"
                        htm += "                <span class='badge badge-danger'> " + status + "</span>"
                        htm += "        </div>"
                        htm += "        </a>";
                    } else {
                        htm += "<a href='/buyer/transactiondetails?id=" + item.id + "' class='item'>"
                        htm += "           <div class='detail'>"

                        htm += "               <div>"
                        htm += "                    <strong>Transaction Number: <br />  <h2 class='text-primary'>" + item.transactionCode + "</h2></strong>"

                        htm += "                    <p><strong>Item(s): <br />" + item.transactionDescription + "</p>"
                        htm += "                    <p>" + item.transactionDate + "</p>"
                        htm += "                </div>"
                        htm += "            </div> "
                        htm += "             <div class='right'>"
                        htm += "                <span class='badge badge-" + item.transactionStatus + "'> " + status + "</span>"
                        htm += "        </div>"
                        htm += "        </a>";
                    }
                }
            });
            $("#veriSpinner").addClass('hidden');
            $("#overview2 .transactions").append(htm);
            $("#canceled1 .transactions").append(canceled_htm);
            $("#inprogress .transactions").append(inprog_htm);
            $("#completed .transactions").append(complete_htm);

            var _query = location.search.split('=');
            console.log(_query);
            if (_query[1] == 2) {
                $("#overview2").removeClass('show active');
                $("#completed").removeClass('show active');
                $("#canceled1").removeClass('show active');
                $("#inprogress").addClass('show active');
                $("#nav-all").removeClass('active');
                $("#nav-progress").addClass('active');
            }

        } else {
            $("#DialogIconedEmpty").modal('show');
            $("#veriSpinner").addClass('hidden');
        }
    }



function followmeup() {
    $("#btnFollow").addClass('hidden');
    $("#btnProgress").removeClass('hidden');
    $("#btnDecline").removeClass('hidden');
    location.href = "/buyer/followup?trans=" + document.getElementById('trans-number').value;
}

function delivercode() {
    $("#btnCodify").addClass('hidden');
    $("#btnCodifyProgress").removeClass('hidden');
    location.href = "/buyer/verify?id=" + document.getElementById('trans-id').value + "&" + document.getElementById('delivcode').value;
}
 
if ($("#buyertransactiondetails").length > 0) {
    $("#veriSpinnerx").removeClass('hidden');

    var _query = location.search.split('=');
    document.getElementById('trans-id').value = _query[1];

    $.ajax({
        type: "GET",
        url: "/Utility/BuyerTransactionDetails/",
        contentType: "application/json; charset=utf-8",
        data: {
            'id': _query[1]
        },
        dataType: "json",
        success: function (data) {
            fetchBuyerTransactionDetailsData(data);
            $("#veriSpinnerx").addClass('hidden');
        },
        error: function (err) {
            $("#veriSpinnerx").addClass('hidden');
            $("#DialogIconedDanger").modal('show');
        }
    });
     
}

function fetchBuyerTransactionDetailsData(data) {
    console.log(data);
    if (data) {
        data.forEach(item => {
            document.getElementById('total-cost').innerHTML = '&#8358;' + formatMoney(parseFloat(item.totalCost));
            $('#transaction_cost').val(formatMoney(parseFloat(item.totalCost)));
            document.getElementById('transaction-code').innerHTML = item.transactionCode;
            document.getElementById('trans-number').value = item.transactionCode;
            document.getElementById('seller_transaction_code').value = item.transactionCode;
            if (item.confirmationCode == "none") {
                document.getElementById('deliveryid').remove();
            } else {
                document.getElementById('delivery-code').innerHTML = item.confirmationCode;
                document.getElementById('delivcode').value = item.confirmationCode;
                $("#delivery").removeClass('hidden');
                document.getElementById('btnDecline').remove();
                document.getElementById('followup').remove();
                document.getElementById('transcodec').remove();

            }
            if (item.transactionStatus == "danger" || item.transactionStatus == "dangers") {
                $("#followup").addClass('hidden');
                $("#followup2").addClass('hidden');
                $("#delivery").addClass('hidden');
                $("#span_stats").removeClass('hidden');
                $("#span_transact_status").html(item.reasons);
                $("#span_transact_status").addClass('sly-danger');
                if (item.transactionStatus == "danger") {

                    var cost = item.totalCost; 

                    var commission = item.ahhtCommission; 

                    var ship = parseInt((0.5 * item.shippingCost)) + parseInt(item.shippingCost);
                    
                    var total = parseInt(cost) - parseInt(commission) - parseInt(ship);
                    var _total = formatMoney(parseFloat(total));
                    var refunds = "";
                    console.log("Processed: " + item.processed);
                    if (item.processed) {
                        refunds = "<strong class='sly-success' >Refunded on " + item.refundDate +"</strong><h3 class='m-0 sly-success'>&#8358;" + _total + "</h3>";
                    } else {
                        refunds = "<strong class='sly-danger'>Pending Refund</strong><h3 class='m-0 sly-danger'>&#8358;" + _total + "</h3>";
                    }
                    $("#refunds").html(refunds);
                    $("#refunds").removeClass('hidden');
                }
            } else {
                if (item.transactionStatus == "success") {
                    $("#followup").addClass('hidden');
                    $("#followup2").addClass('hidden');
                    $("#delivery").addClass('hidden');
                    $("#span_stats").removeClass('hidden');
                    $("#span_transact_status").html("You have collected the item(s) on " + item.reasons.split('on')[1]);
                    $("#span_transact_status").addClass('sly-success');
                    $("#not_paid").addClass('hidden');
                    $("#is_paid").removeClass('hidden');
                } else {
                    if (item.transactionStatus == "warning" && item.paid == true)  {
                        $("#followup2").addClass('hidden');
                        $("#delivery").removeClass('hidden');

                        $("#not_paid").addClass('hidden');
                        $("#is_paid").removeClass('hidden');
                    }
                }
            }
            document.getElementById('transaction-details').innerHTML = item.transactionDescription;
            document.getElementById('transaction-date').innerHTML = item.transactionDate;
            document.getElementById('transaction-phone').innerHTML = item.buyerMobileNumber;
            document.getElementById('seller-phone').innerHTML = item.sellerMobileNumber;
            document.getElementById('transaction-ship').innerHTML = '&#8358;' + formatMoney(parseFloat(item.shippingCost));
            document.getElementById('transaction-commission').innerHTML = '&#8358;' + formatMoney(parseFloat(item.ahhtCommission));
            document.getElementById('transaction-agreed').innerHTML = '&#8358;' + formatMoney(parseFloat(item.agreedPrice));
        });

    }
}

if ($("#PayStackSuccess").length > 0) {
    
        var accountname = localStorage.getItem("account_name").replace('%20', ' ');
        var bankname = localStorage.getItem("bank_name").replace('%20', ' ');
        var cost = localStorage.getItem("transaction_cost");


        var _money = formatMoney(parseFloat(cost));
        document.getElementById('naira1').innerHTML = _money;

        var _query = location.search.split('=');
        //DeliveryCode(_query[1]);

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        $.ajax({
            type: "GET",
            url: "/Utility/GetDeliveryCode/",
            contentType: "application/json; charset=utf-8",
            data: {
                'transcode': _query[1]
            },
            dataType: "json",
            success: function (data) {
                fetchPayStackSuccessData(data);
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show')
            }
        });  
}

function fetchPayStackSuccessData(data) {
    if (data) {
        console.log(data);
        data.forEach(item => {
            document.getElementById('deliverycode').innerHTML = item.confirmationCode;
            document.getElementById('dealdate').innerHTML = item.transactionDate;
            document.getElementById('transnumb').innerHTML = item.sellertTransactionCode;
            /*document.getElementById('from').innerHTML = item.buyerAccountName;
            document.getElementById('bank').innerHTML = item.buyerBankName;*/
            document.getElementById('dealcode').innerHTML = item.confirmationCode;

            $("#DialogIconedSuccess").modal('show');
        });

    }
}



if ($("#VerifyPagePaid").length > 0) {

    var _query = location.search.split('=');
    document.getElementById('trans-id').value = _query[1].split('&')[0];
    document.getElementById('smscode').value = _query[1].split('&')[1];

    $.ajax({
        type: "GET",
        url: "/Utility/GetRefundInfo/",
        contentType: "application/json; charset=utf-8",
        data: {
            'transcode': _query[1].split('&')[1]
        },
        dataType: "json",
        success: function (data) {
            fetchVerifySuccessData(data);
        },
        error: function (err) {
            $("#DialogIconedDanger").modal('show')
        }
    });
     
}

function fetchVerifySuccessData(data) {
    if (data) {
        console.log(data);
        data.forEach(item => {
            var cost = item.totalCost;
            var _cost = formatMoney(parseFloat(cost));
            document.getElementById('costs').innerHTML = _cost;

            var commission = item.ahhtCommission;
            var _commission = formatMoney(parseFloat(commission));
            document.getElementById('commission').innerHTML = _commission;

            var ship = parseInt((0.5 * item.shippingCost)) + parseInt(item.shippingCost);
            //var _ship = formatMoney(parseFloat(ship));
            var _ship = formatMoney(parseFloat(item.shippingCost));
            document.getElementById('ship').innerHTML = _ship;

            var total = parseInt(item.totalCost) - parseInt(commission) - parseInt(ship);
            var _total = formatMoney(parseFloat(total));
            document.getElementById('total').innerHTML = _total;


        });

    }
}

var btnSendMessage = function () {
    var user = {
        Name: $("#name2").val(),
        Email: $("#email2").val(),
        MessageBody: $("#textarea2").val()
    };
    if (user.Name == "" || user.Email == "" || user.MessageBody == "") {
        $("#DialogIconedAllFieldsDanger").modal('show');
    } else {
        SendMessage(user);
    }
}


const SendMessage = async (user) => {
    try {
        $("#btnSendMessage").addClass('hidden');
        $("#btnProgress").removeClass('hidden');

        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $.ajax({
            type: "POST",
            url: "/Utility/SendMessage/",
            data: user,
            dataType: "json",
            success: function (data) {
                if (data == true) {
                    $("#DialogIconedCompleted").modal('show');
                    $("#btnSendMessage").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
                else {
                    $("#DialogIconedDanger").modal('show');
                    $("#btnSendMessage").removeClass('hidden');
                    $("#btnProgress").addClass('hidden');
                }
            },
            error: function (err) {
                $("#DialogIconedDanger").modal('show');
                $("#btnSendMessage").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });
         
    } catch (error) {

        $("#DialogIconedDanger").modal('show');
        $("#btnSendMessage").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}



$("#btnCheckUserPhone").click(function () {
    if (localStorage.getItem('phone') == null) {
        $("#DialogFingerprintDanger").modal('show');
    } else {
        var user = {
            Username: $("#ephone").val()
        };

        if ($("#ephone").val() == "") {
            $("#EnterPhoneDanger").modal('show');
        } else {
            UserFingerprint(user);
        }
    }
})

const UserFingerprint = async (user) => {
    try {
        $("#btnLogin").addClass('hidden');
        $("#btnProgress").removeClass('hidden');
         
        $.ajax({
            type: "GET",
            url: "/Admin/FingerprintPhone/",
            contentType: "application/json; charset=utf-8",
            data: {
                'Username': user.Username
            },  
            dataType: "json",
            success: function (data) {
                $("#btnLogin").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
                if (!data) {
                    $("#actionSheetSellerIconed").modal('hide');
                    $("#DialogIconedDanger").modal('show');
                }
                else { 
                    location.href = "activity:http://mobile.brigho.com?phonecall=" + user.Username; 
                }
            },
            error: function (err) {
                $("#actionSheetSellerIconed").modal('hide');
                $("#DialogIconedDanger").modal('show');
                $("#btnLogin").removeClass('hidden');
                $("#btnProgress").addClass('hidden');
            }
        });
         
    } catch (error) {
        console.log(error);
        $("#actionSheetSellerIconed").modal('hide');
        $("#DialogIconedDanger").modal('show');
        $("#btnLogin").removeClass('hidden');
        $("#btnProgress").addClass('hidden');
    }
}

function fingerPrintProcessed(username) {
    localStorage.setItem('phone', username)
    location.href = "/seller";
}

function sendSMS(data) {

     
    console.log("1 "+data);


    $.ajax({
        type: "POST",
        url: "http://bulksmsnigeria.test/api/v2/sms/create",
        contentType: "application/json",
        "Accept": "application/json",
        data: {
            "api_token": "z8JT6uJ5rPksUGLBWzGs6KUTa5JFttdT4qIyYjnsIrvg4N2uPklYhK9DNpxy",
            "to": data.Phone,
            "from": "BRIGHO",
            "body": data.Message,
            "gateway": "0",
            "append_sender": "0",
        }, 
        success: function (data) {
            console.log(data);
             
        },
        error: function (err) {
             
        }
    });

}

var buyerinprogress = function () {
    $("#overview2").removeClass('show active');
    $("#completed").removeClass('show active');
    $("#canceled1").removeClass('show active');
    $("#inprogress").addClass('show active');
    $("#nav-all").removeClass('active');
    $("#nav-completed").removeClass('active');
    $("#nav-cancelled").removeClass('active');
    $("#nav-progress").addClass('active');
    
}

function CallLogOut(val) {
    //localStorage.clear();
    location.href = "/admin/";
}

function formatDate() {

    var _dates = $('#transaction_date').val();
    var dates = new Date(_dates);
    var day = ("0" + dates.getDate()).slice(-2);
    var month = ("0" + (dates.getMonth() + 1)).slice(-2);

    var today = dates.getFullYear() + "-" + month + "-" + day;
     
    $('#transaction_date').type = 'date'
    $('#transaction_date').val(today);
}

//document.getElementById("fname").onchange = function () { myFunction() };

function myFunction() {
    var x = document.getElementById("settlement_type");
    if (x.value == 2) {
        $("#divcoms").removeClass('hidden');
    } else {
        $("#divcoms").addClass('hidden');
    }
}