
$(document).ready(function () {
   
    $('#save').on('click', function () {
        NewsPost();
    });
});

function NewsPost() {

    var dados = {

        id_partners: $("#id_partners").val(),
        name: $("#name_").val(),
        lastname: $("#lastname_").val(),
        birthday: $("#day_").val() + "/" + $("#month_").val() + "/" + $("#year_").val(),
        email: $("#email_c").val(),
        password: $("#password_P").val(),
        company: $("#company_").val(),
        taxID: $("#taxID_").val(),
        phone: $("#phone_").val(),
        address: $("#address_").val(),
        zipCode: $("#zipCode_").val(),
        city: $("#city_").val(),
        id_state: $("#state_").val(),
        id_business: $("#id_business_").val(),
    };

    if (validateForm()) {

        $.ajax({
            url: '/Partner/CadPartners',
            dataType: "json",
            type: "POST",
            data: dados,
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success) {
                    Clear_c();
                    $("#form-partners").hide("slow");
                    dialogconfirmationOK("Saved with success", redirect);                  
                }
                else {

                    dialogAlert(data.msg);
                }

                loadingOff();
            },
            error: function (error) {
            }
        });
    }
}

function validateForm() {

    var name = $("#name_"),
    lastname = $("#lastname_"),
    day =  $("#day_"),
    month =  $("#month_"),
    year = $("#year_") ,
    email= $("#email_c"),
    password = $("#password_P"),
    passwordConfirn = $("#passwordConfirn_P"),
    id_business = $("#id_business_"),
    company= $("#company_"),
    taxID= $("#taxID_"),
    phone= $("#phone_"),
    address= $("#address_"),
    zipCode= $("#zipCode_"),
    city= $("#city_"),
    state = $("#state_"),
    id_country = $("#id_country"),
   
    allFields = $([]).add(name).add(lastname).add(day).add(month).add(year).add(email).add(password).add(passwordConfirn).add(id_business).add(taxID).add(phone).add(address).add(zipCode).add(city).add(state).add(id_business).add(id_country);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(name, "Name Field Required", 1, 50);
    bValid = bValid && checkLength(lastname, "Lastname Field Required", 1, 50);

    bValid = bValid && checkLength(email, "E-mail Field Required", 1, 50);
    bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "invalid Email");
    bValid = bValid && checkLength(password, "Passoword Field Required", 1, 50);
    bValid = bValid && checkLength(passwordConfirn, "Confirm Passoword Field Required", 1, 50);
    bValid = bValid && comperpassawor(password, passwordConfirn, "different password");
    bValid = bValid && checkLength(id_business, "Business Field Required", 1, 50);
    bValid = bValid && checkLength(company, "Company Name Field Required", 1, 50);
    //bValid = bValid && checkLength(taxID, "Tax ID Field Required", 1, 50);
    bValid = bValid && checkLength(phone, "Phone Field Required", 1, 50);
    bValid = bValid && checkLength(address, "Address Field Required", 1, 50);
    bValid = bValid && checkLength(zipCode, "Zip Code Field Required", 1, 50);
    bValid = bValid && checkLength(city, "City Field Required", 1, 50);
    bValid = bValid && checkLength(id_country, "Country Field Required", 1, 50);
    bValid = bValid && checkLength(state, "State Province Field Required", 1, 50);

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear_c() {
    $("#id_partners_").val("");
    $("#name_").val("");
    $("#lastname_").val("");
    $("#month_").val('');
    $("#day_").val('');
    $("#year_").val('');
    $("#email_c").val("");
    $("#password_").val("");
    $("#passwordConfirn_").val("");
    $("#company_").val("");
    $("#taxID_").val("");
    $("#phone_").val("");
    $("#address_").val("");
    $("#zipCode_").val("");
    $("#city_").val("");
    $("#state_").val("");
    $("#id_business_").val("");
    $("#id_country").val("");
}

function ListCountry(id, bool) {

    if (id == "") {
        $('#state_').html("");
        $('#state_').append('<option value="" selected="selected">Select a State</option>');
        return false;
    }


    $('#state_').html("");
    $.ajax({
        url: caminhoApp + '/Partner/listState',
        dataType: "json",
        type: "POST",
        async: bool,
        data: { id_country: id },
        beforeSend: function () {

            if (bool)
                loadingOn();
        },
        success: function (data) {

            $('#state_').append('<option value="" selected="selected">Select a State</option>');

            $(data.result).each(function () {
                $('#state_').append('<option value="' + this.id_state + '">' + this.ds_name + '</option>');
            });

            if (bool)
                loadingOff();
        },
        error: function (error) {
            //loadingOff();
        }
    });

}

function redirect() {

    window.location = "/Shop";

}