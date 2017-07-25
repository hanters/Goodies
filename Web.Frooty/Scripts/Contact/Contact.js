
$(document).ready(function () {

    $('#save').on('click', function () {
        NewsPost();
    });
});

function NewsPost() {

    $("#save").val("sending...");

    var dados = {

        namecontact: $("#namecontact_").val(),
        lastname: $("#lastname_").val(),
        emailcontact: $("#emailcontact_").val(),
        Phone: $("#Phone").val(),
        message: $("#message").val(),
      
    };

 
    if (validateForm_1()) {

        $.ajax({
            url: caminhoApp + '/Contact/Send',
            dataType: "json",
            type: "POST",
            data: dados,
            success: function (data) {
                if (data.success) {
                    $("#save").before("<h4 class='text-right green'><strong>Your Mail has been sent successfully.</strong></h4> ");
                    Clear();
                    $("#save").val("SEND");
                }
                else {
                    $("#save").before("<h4 class='text-right green'><strong>Message sending failed.</strong></h4> ");
                    $("#save").val("SEND");
                }
            },
            error: function (error) {

                $("#save").val("SEND");
            }
        });
    }
}

function validateForm_1() {

    var namecontact = $("#namecontact_"),
    lastname = $("#lastname_"),
    emailcontact = $("#emailcontact_"),
    Phone = $("#Phone"),
    message = $("#message"),

    allFields = $([]).add(namecontact).add(lastname).add(emailcontact).add(Phone).add(message);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(namecontact, "Name Field Required", 1, 50);
    bValid = bValid && checkLength(lastname, "Lastname Field Required", 1, 50);
    bValid = bValid && checkLength(emailcontact, "E-mail Field Required", 1, 50);
    bValid = bValid && checkRegexp(emailcontact, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "invalid Email");
    bValid = bValid && checkLength(Phone, "Passoword Field Required", 1, 50);
    bValid = bValid && checkLength(message, "E-mail Field Required", 1, 1000);
   
    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear() {
    $("#namecontact").val("");
    $("#lastname").val("");
    $("#emailcontact").val("");
    $("#Phone").val("");
    $("#message").val("");
}