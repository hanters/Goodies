var url;

$(document).ready(function () {
    $('#save').on('click', function () {
        NewsPost();
    });
    Count();
    SelectPartners();
});

function Count() {

    $.ajax({
        url: caminhoApp + '/Default/Count',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {
                $("#Posts").html(this.TotalPost);
                $("#Events").html(this.TotalEvents);
                $("#Recipes").html(this.TotalRecipes);
            });  
        },
        error: function (error) {
        }
    });
}

function SelectPartners() {

    $('#posts').dataTable().fnDestroy();
    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Partners/SelectPartnersPendent',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_partners + '</td>' +
                        '<td>' + this.company + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + this.phone + '</td>' +
                        '<td>' + this.statusPartners + ' <span class="badge2 btn-warning">!</span></td>' +
                        '<td><a href="#"  onclick ="editPartners(' + this.id_partners + ')"  class="btn btn-primary">Open <i class="fa fa-edit"></i></a></td>' +
                    '</tr>');
            });

            $('#posts').DataTable({
                "ordering": true,
                "order": [[3, "desc"]]
            });
        },
        error: function (error) {
        }
    });
}

function editPartners(id) {
    Clear();

    var dados = {
        id_partners: id,
    };

    var idState = 0;

    $.ajax({
        url: caminhoApp + '/Partners/EditPartners',
        dataType: "json",
        type: "POST",
        data: dados,
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            $(data.result).each(function () {

                var birthday = (this.birthday != null ? formatJSON(this.birthday) : null);

                $("#id_partners").val(this.id_partners);
                $("#name").val(this.name);
                $("#lastname").val(this.lastname);
                $("#month").val((birthday != null ? (birthday.getMonth() + 1) : ""));
                $("#day").val((birthday != null ? birthday.getDate() : ""));
                $("#year").val((birthday != null ? birthday.getFullYear() : ""));
                $("#email").val(this.email);
                $("#password").val(this.password);
                $("#passwordConfirn").val(this.password);
                $("#company").val(this.company);
                $("#taxID").val(this.taxID);
                $("#phone").val(this.phone);
                $("#address").val(this.address);
                $("#zipCode").val(this.zipCode);
                $("#city").val(this.city);
                $("#id_country").val(this.state);
                idState = this.id_state;
                $("#id_business").val(this.id_business);
                $("#id_statusPartners").val(this.id_statusPartners);
                ListCountry(this.state, false);
                $("#state").val(idState);
            });
       
            $(".EventsModal").modal('show');
 
            url = "upDatePartners";
            
            loadingOff();
        },
        error: function (error) {
            loadingOff();
        }
    });
}

function NewsPost() {

    var dados = {

        id_partners: $("#id_partners").val(),
        name: $("#name").val(),
        lastname: $("#lastname").val(),
        birthday: $("#day").val() + "/" + $("#month").val() + "/" + $("#year").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        company: $("#company").val(),
        taxID: $("#taxID").val(),
        phone: $("#phone").val(),
        address: $("#address").val(),
        zipCode: $("#zipCode").val(),
        city: $("#city").val(),
        id_state: $("#state").val(),
        id_business: $("#id_business").val(),
        id_statusPartners: $("#id_statusPartners").val(),
    };

    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/Partners/' + url,
            dataType: "json",
            type: "POST",
            data: dados,
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success) {
                    $(".EventsModal").modal('hide');
                    Clear();
                    SelectPartners();
                }
                else {

                    $("#Pmsg").html(data.msg);
                    $(".alert").show('slow');
                }

                loadingOff();
            },
            error: function (error) {
                loadingOff();
            }
        });
    }
}

function validateForm() {

    var name = $("#name"),
    lastname = $("#lastname"),
    day = $("#day"),
    month = $("#month"),
    year = $("#year"),
    email = $("#email"),
    password = $("#password"),
    passwordConfirn = $("#passwordConfirn"),
    id_business = $("#id_business"),
    company = $("#company"),
    taxID = $("#taxID"),
    phone = $("#phone"),
    address = $("#address"),
    zipCode = $("#zipCode"),
    city = $("#city"),
    id_country = $("#id_country"),
    state = $("#state"),
    id_statusPartners = $("#id_statusPartners"),

    allFields = $([]).add(name).add(lastname).add(day).add(month).add(year).add(email).add(password).add(passwordConfirn).add(id_business).add(taxID).add(phone).add(address).add(zipCode).add(city).add(state).add(id_business).add(id_statusPartners).add(id_country);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(name, "Name Field Required", 1, 50);
    bValid = bValid && checkLength(lastname, "Lastname Field Required", 1, 50);

    bValid = bValid && checkLength(email, "E-mail Field Required", 1, 50);
    bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "invalid Email");
    bValid = bValid && checkLength(password, "Passoword Field Required", 1, 50);
    bValid = bValid && checkLength(passwordConfirn, "Confirm Passoword Field Required", 1, 50);
    bValid = bValid && comperpassawor(password, passwordConfirn, "different password");
    //bValid = bValid && checkLength(id_business, "Business Field Required", 1, 50);
    //bValid = bValid && checkLength(company, "Company Name Field Required", 1, 50);
    //bValid = bValid && checkLength(taxID, "Tax ID Field Required", 1, 50);
    //bValid = bValid && checkLength(phone, "Phone Field Required", 1, 50);
    //bValid = bValid && checkLength(address, "Address Field Required", 1, 50);
    //bValid = bValid && checkLength(zipCode, "Zip Code Field Required", 1, 50);
    //bValid = bValid && checkLength(city, "City Field Required", 1, 50);
    bValid = bValid && checkLength(id_country, "Country Field Required", 1, 50);
    bValid = bValid && checkLength(state, "State Province Field Required", 1, 50);
    bValid = bValid && checkLength(id_statusPartners, "Status Province Field Required", 1, 50);

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear() {
    $("#id_partners").val("");
    $("#name").val("");
    $("#lastname").val("");
    $("#month").val('');
    $("#day").val('');
    $("#year").val('');
    $("#email").val("");
    $("#password").val("");
    $("#passwordConfirn").val("");
    $("#company").val("");
    $("#taxID").val("");
    $("#phone").val("");
    $("#address").val("");
    $("#zipCode").val("");
    $("#city").val("");
    $("#state").val("");
    $("#id_business").val("");

    var name = $("#name"),
    lastname = $("#lastname"),
    day = $("#day"),
    month = $("#month"),
    year = $("#year"),
    email = $("#email"),
    password = $("#password"),
    passwordConfirn = $("#passwordConfirn"),
    id_business = $("#id_business"),
    company = $("#company"),
    taxID = $("#taxID"),
    phone = $("#phone"),
    address = $("#address"),
    zipCode = $("#zipCode"),
    city = $("#city"),
    id_country = $("#id_country"),
    state = $("#state"),
    id_statusPartners = $("#id_statusPartners")
    allFields = $([]).add(name).add(lastname).add(day).add(month).add(year).add(email).add(password).add(passwordConfirn).add(id_business).add(taxID).add(phone).add(address).add(zipCode).add(city).add(state).add(id_business).add(id_statusPartners).add(id_country);
    allFields.removeClass("state-error");

}

function ListCountry(id, bool) {

    if (id == "") {

        $('#state').html("");
        $('#state').append('<option value="" selected="selected">Select a State</option>');
        return false;
    }


    $('#state').html("");
    $.ajax({
        url: caminhoApp + '/Partners/listState',
        dataType: "json",
        type: "POST",
        async: bool,
        data: { id_country: id },
        beforeSend: function () {

            if (bool)
                loadingOn();
        },
        success: function (data) {

            $('#state').append('<option value="" selected="selected">Select a State</option>');

            $(data.result).each(function () {
                $('#state').append('<option value="' + this.id_state + '">' + this.ds_name + '</option>');
            });

            if (bool)
                loadingOff();
        },
        error: function (error) {
            //loadingOff();
        }
    });

}