var url;
$(document).ready(function () {

   
    $(".btnvoltarhistory").click(function () {
        $(".floatrequest").hide();
        $(this).parents(".modal").find(".historydetail").show();
    });

    $('#historyRequests').DataTable({
        "ordering": true,
        "pageLength": 5,
        "order": [[3, "desc"]]
    });

    $('#cart').DataTable({
        "ordering": true,
        "pageLength": 5,
        "order": [[3, "desc"]]
    });

    $('#posts, #allpartners, #disapprovedpartners').DataTable({
        "ordering": true
    });
 
    $("#menu-dashboard").removeClass("active");
    $("#menu-partners").addClass("open");
    $("#menu-partners-overview").addClass("active");

    $("#btnCad").on('click', function () {
        Clear();
        $(".EventsModal").modal('show');
        url = "CadPartners";
    });

    $('#save').on('click', function () {
        NewsPost();
    });

    $('#hdn-total,#hdn-price,#hdn-total-rules,#hdn-price-rules').maskMoney({ prefix: '$ ', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });

    $("#btn-salvar").on('click', function () {
        $.ajax({
            url: caminhoApp + '/Shop/UpdateStatus',
            data: { id_status: $("#id_status").val(), id_shop: $("#id_shop").val() },
            dataType: "json",
            type: "POST",
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success) {
                    listShop($("#id_partners").val());
                } else {
                    dialogAlert(data.msg);
                }

                loadingOff();
            },
            error: function (error) {
                loadingOff();
            }
        });
    });

    SelectPartners();
    

});

function SelectPartners()
{
    $('#posts').dataTable().fnDestroy();

    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Partners/SelectPartners',
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
                        '<td>' + this.business + '</td>' +
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

function editPartners(id)
{
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

                var birthday = (this.birthday != null ?formatJSON(this.birthday) : null);
               
                $("#id_partners").val(this.id_partners);
                $("#name").val(this.name);
                $("#lastname").val(this.lastname);
                $("#month").val( (birthday != null ?(birthday.getMonth() + 1):""));
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
                $("#state").val(this.id_state);
                $("#id_business").val(this.id_business);
                $("#id_statusPartners").val(this.id_statusPartners)
                ListCountry(this.state,false);
            });
            listShop(id);
            $(".EventsModal").modal('show');
            $(".floatrequest").show();
            url = "upDatePartners";
            $(".floatrequest").hide();
            $(".historydetail").show();
            $('a[href="#profile"]').tab('show');
            $("#state").val(idState);
            loadingOff();
        },
        error: function (error) {
            loadingOff();
        }
    });
}

function validateForm() {

    var name = $("#name"),
    lastname = $("#lastname"),
    day =  $("#day"),
    month =  $("#month"),
    year = $("#year") ,
    email= $("#email"),
    password = $("#password"),
    passwordConfirn = $("#passwordConfirn"),
    id_business = $("#id_business"),
    company= $("#company"),
    taxID= $("#taxID"),
    phone= $("#phone"),
    address= $("#address"),
    zipCode= $("#zipCode"),
    city= $("#city"),
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
    $("#id_country").val("");
    $("#id_business").val("");

    var name = $("#name"),
    lastname = $("#lastname"),
    day =  $("#day"),
    month =  $("#month"),
    year = $("#year") ,
    email= $("#email"),
    password = $("#password"),
    passwordConfirn = $("#passwordConfirn"),
    id_business = $("#id_business"),
    company= $("#company"),
    taxID= $("#taxID"),
    phone= $("#phone"),
    address= $("#address"),
    zipCode= $("#zipCode"),
    city= $("#city"),
    id_country = $("#id_country"),
    state = $("#state"),
    id_statusPartners = $("#id_statusPartners")
    allFields = $([]).add(name).add(lastname).add(day).add(month).add(year).add(email).add(password).add(passwordConfirn).add(id_business).add(taxID).add(phone).add(address).add(zipCode).add(city).add(state).add(id_business).add(id_statusPartners).add(id_country);
    allFields.removeClass("state-error");
}

function Clear_() {

    $("#id_shop").val('');
}

function listShop(id) {

    $('#requests').dataTable().fnDestroy();
    $('#requests tbody').html("");

    $.ajax({
        url: caminhoApp + '/Shop/listShopId',
        dataType: "json",
        type: "POST",
        data:{id_partners:id},
        success: function (data) {
            $(data.result).each(function () {

                $('#hdn-total').val((this.discount_total == null ? (this.total == null ? 0 : this.total.toFixed(2)) : (this.discount_total > 0 ? (this.discount_total == null ? 0 : this.discount_total.toFixed(2)) : (this.total == null ? 0 : this.total.toFixed(2)))));
                $("#hdn-total").maskMoney("mask");

                $('#requests tbody').append(
                    '<tr>' +
                        '<td>' + this.id_shop + '</td>' +
                        '<td>' + this.email + '</td>' +
                        '<td>' + formatJSONDateAmerica(this.date) + '</td>' +
                        '<td>' + this.description + '</td>' +
                        '<td>' + $('#hdn-total').val() + '</td>' +
                        '<td align="center"><a href="#" id-shop="' + this.id_shop + '" date="' + formatJSONDateAmericaTime(this.date) + '" id-status="' + this.id_status + '" id_partnes = "' + this.id_partners + '"   class="btn btn-xs btn-success abrehistorypartner"><i class="fa fa-edit"></i> Edit</a></td>' +
                    '</tr>');
            });

            $(".abrehistorypartner").click(function () {                
                EditShop($(this).attr("id-shop"), $(this).attr("date"), $(this).attr("id-status"), this, $(this).attr("id_partnes"));
            });


            $('#requests').DataTable({
                "ordering": true,
                "order": [[3, "desc"]]
            });
        },
        error: function (error) {
        }
    });

}

function EditShop(id, date, id_status, obj, id_partnes) {

    Clear_();
    $('#cart').dataTable().fnDestroy();
    $('#cart tbody').html("");
    $.ajax({
        url: caminhoApp + '/Shop/EditShop',
        dataType: "json",
        type: "POST",
        data: { shop: id, partners: id_partnes },
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            var total = 0;
            var total_rules = 0;
            var totalMeenos = 0;
            $("#id_shop").val(id);
            $(data.result).each(function () {

                var porcento = 0;

                if ((this.unit_price_rules != null) || (this.discount_total != null)) {
                    porcento = (100 * this.discount_total);
                    porcento = porcento / this.total;
                    porcento = 100 - porcento
                }

                $('#hdn-price').val((this.price == null ? 0 : this.price.toFixed(2)));
                $("#hdn-price-rules").val((this.unit_price_rules == null ? 0 : this.unit_price_rules.toFixed(2)));
                $('#hdn-total-rules').val((this.discount_total == null ? 0 : this.discount_total.toFixed(2)));
                $('#hdn-total').val((this.total == null ? 0 : this.total.toFixed(2)));
                $("#hdn-price,#hdn-price-rules,#hdn-total,#hdn-total-rules").maskMoney("mask");
                $('#cart tbody').append(
                    '<tr>' +
                        '<td>' + this.name + ' ' + this.weight + 'oz ' + this.flavour + '</td>' +
                        '<td align="center">' + this.amount + '</td>' +
                        '<td align="center">' + (this.unit_price_rules == null ? $("#hdn-price").val() : '<span class="traco">' + $("#hdn-price").val() + '</span></br>  ' + $("#hdn-price-rules").val()) + '</td>' +
                        '<td>' + (this.rules == null ? '---' : this.rules) + '</td>' +
                        '<td>' + porcento.toFixed(2) + '%' + '</td>' +
                        '<td>' + (this.discount_total == null ? $("#hdn-total").val() : '<span class="traco">' + $("#hdn-total").val() + '</span></br> ' + $("#hdn-total-rules").val()) + '</td>' +
                    '</tr>');

                total = total + this.total;

                if ((this.unit_price_rules != null) || (this.discount_total != null)) {

                    total_rules = total_rules + this.discount_total;
                    totalMeenos = totalMeenos + this.total;
                }
            });


            $('#cart').DataTable({
                "responsive": true,
                "lengthChange": false,
                "info": false,
                "bPaginate": false,
                "searching": true,
            });

            $("#hdn-price").val((data.priceShipping == null ? 0 : data.priceShipping.toFixed(2))); // shipping
            $("#hdn-price").maskMoney('mask');

            $("#lbl-shipping").html($("#hdn-price").val());

            var id_shop = new String(id);
            $("#lbl-id-shop").html(id_shop.padLeft(6, '0'))

            $("#lbl-date").html(date);
            $("#id_status").val(id_status);
            $("#hdn-total").val(total.toFixed(2));
            $("#hdn-total").maskMoney('mask');

            $("#lbl-total-rules").html('');

            if ((id_status == 3) || (id_status == 1)) {
                $("#id_status").attr("disabled", "disabled");
                $("#btn-salvar").attr("disabled", "disabled");
                $("#btn-refresh").hide();
            }

            if (total_rules > 0) {

                totalMeenos = total - totalMeenos;
                total_rules = total_rules + totalMeenos;

                $("#hdn-total-rules").val(total_rules.toFixed(2));
                $("#hdn-total-rules").maskMoney('mask');

                $("#lbl-total-rules").append('<p class="traco">' + $("#hdn-total").val() + '</p">');
                $("#lbl-total-rules").append($("#hdn-total-rules").val())

               
                if (data.priceShipping != null) {
                    if (data.priceShipping > 0) {

                        total_rules = total_rules + data.priceShipping;
                        $("#hdn-total-rules").val(total_rules.toFixed(2));
                        $("#hdn-total-rules").maskMoney('mask');

                        $(".cs-hidden").show();
                        $("#lbl-total-rules-shipping").html($("#hdn-total-rules").val());
                    } else {
                        $("#hdn-total-rules").val(total_rules.toFixed(2));
                        $("#hdn-total-rules").maskMoney('mask');
                        $(".cs-hidden").hide();
                        $("#lbl-total-rules-shipping").html($("#hdn-total-rules").val());
                    }
                } else {
                    $("#hdn-total-rules").val(total_rules.toFixed(2));
                    $("#hdn-total-rules").maskMoney('mask');
                    $(".cs-hidden").hide();
                    $("#lbl-total-rules-shipping").html($("#hdn-total-rules").val());
                }

            } else {

                $("#lbl-total-rules").html((total <= 0 ? 0 : $("#hdn-total").val()));

                total = total + data.priceShipping;
                $("#hdn-total").val(total.toFixed(2));
                $("#hdn-total").maskMoney('mask');

                if (data.priceShipping != null) {
                    if (data.priceShipping > 0) {
                        $(".cs-hidden").show();
                        $("#lbl-total-rules-shipping").html($("#hdn-total").val());
                    } else {
                        $(".cs-hidden").hide();
                        $("#lbl-total-rules-shipping").html((total <= 0 ? 0 : $("#hdn-total").val()));
                    }
                } else {
                    $(".cs-hidden").hide();
                    $("#lbl-total-rules-shipping").html((total <= 0 ? 0 : $("#hdn-total").val()));
                }
            }

          
            $(".floatrequest").show();
            $(obj).parents(".modal").find(".historydetail").hide();

            loadingOff();

        },
        error: function (error) {
            loadingOff();
        }
    });

}

function ListCountry(id,bool) {

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
        data: { id_country:id },
        beforeSend: function () {

            if(bool)
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