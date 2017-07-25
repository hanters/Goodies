
$(document).ready(function () {
    $("#hdn-price,#hdn-price-rules,#hdn-weight_total").maskMoney({ prefix: ' $ ', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });
    $("#hdn-total-iten,#hdn-total-iten-rules").maskMoney({ prefix: ' $ ', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });
    $("#hdn-total,#hdn-total-rules").maskMoney({ prefix: '$ ', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });

    $(".number").keydown(function (e) {
        
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            
            (e.keyCode == 65 && e.ctrlKey === true) ||
            
            (e.keyCode >= 35 && e.keyCode <= 39)) {
           
            return;
        }
        
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $(".add-cart").on('click', function () {

        $("input:text").removeClass("state-error");

        if ($(this).parent().find("input:text").val() == "") {

            $(this).parent().find("input:text").addClass("state-error");
            return false;
        }

        var dados = {
            id_products: $(this).parent().attr('id-product'),
            amount: $(this).parent().find("input:text").val()
        }

        var obj = this;

        $.ajax({
            url: '/shop/addItens',
            dataType: "json",
            type: "POST",
            data: dados,
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success) {
                    $(obj).parent().find("input:text").val("");
                    ListCart();
                }
                else {
                    if (data.error == "1") {
                        $("#recoveryform").hide();
                        $("#TrocarSenhaForm").hide();
                        $("#loginform").show();
                        $(".modal.frootystyle .modal-header h4").html("LOGIN");
                        $("#LoginModal").modal("show");
                        reDados = dados;
                    } else {
                        dialogAlert(data.msg);
                    }
                }

                loadingOff();
            },
            error: function (error) {
                loadingOff();
            }
        });
    });

    $("#btn-pay").attr("disabled", "disabled")

    $("#btn-pay").on('click', function () {
        Partners();
    });

    $("#btn-chechout-partner").on('click', function () {

        var dados = {

            id_partners: $("#id_partners").val(),
            name: $("#name").val(),
            lastname: $("#lastname").val(),   
            email: $("#email_").val(),    
            company: $("#company").val(),
            taxID: $("#taxID").val(),
            phone: $("#phone").val(),
            address: $("#address").val(),
            zipCode: $("#zipCode").val(),
            city: $("#city").val(),
            id_state: $("#state").val(),
            id_business: $("#id_business").val(),
        };

        if (validateForm()) {

            $.ajax({
                url: '/shop/upDatePartners',
                dataType: "json",
                type: "POST",
                data: dados,
                beforeSend: function () {
                    loadingOn();
                },
                success: function (data) {
                    if (data.success) {
                        RulesListCart();
                    }
                    else {
                        if (data.error == "1") {
                            $("#LoginModal").modal("show");
                        } else {
                            dialogAlert(data.msg);
                            loadingOff();
                        }
                    }

                },
                error: function (error) {
                    loadingOff();
                }
            });
        }
    });

    // está no script global
    ListCart();

});

function ListCartSicrono() {
    
    $('#cart').dataTable().fnDestroy();
    $("#cart tbody").html("");
    $.ajax({
        url: '/shop/ListCart',
        dataType: "json",
        type: "POST",
        async: false,
        success: function (data) {
            var total = 0;
            $("#cart tbody").html("");

            $(data.Result).each(function () {
                $("#hdn-price").val(this.price.toFixed(2));
                $("#hdn-price").maskMoney('mask');
                $("#hdn-total-iten").val(this.total.toFixed(2));
                $("#hdn-total-iten").maskMoney('mask');
                $("#cart tbody").append(
                    '<tr>' +
                        '<td>' + this.name + " " + this.weight + ' oz ' + this.flavour + '</td>' +
                        '<td>' + this.amount + '</td>' +
                        '<td>' + $("#hdn-price").val() + '</td>' +
                        '<td>' + $("#hdn-total-iten").val() + '</td>' +
                        '<td align="right"><a href="#" onclick ="RemoveListCart(' + this.id_itens + ')" class="yellow"><i class="fa fa-edit"></i> Remove</a></td>' +
                    '</tr>'
                );

                total = total + this.total;
            });

            $("#hdn-total").val(total.toFixed(2));
            $("#hdn-total").maskMoney('mask');
            $("#lbl-total").html((total <= 0 ? 0 : $("#hdn-total").val()));

            $(".label-success").html(data.total + " itens");

            if (data.total > 0) {
                $("#btn-pay").removeAttr("disabled")
            } else {
                $("#btn-pay").attr("disabled", "disabled")
            }

            $('#cart').dataTable({
                "responsive": true,
                "lengthChange": false,
                "pageLength": 6
            });
        },
        error: function (error) {
        }
    });

}

function RemoveListCart(id) {

    $.ajax({
        url: '/shop/RemoveListCart',
        dataType: "json",
        type: "POST",
        data: { id_iten: id },
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            if (data.success) {

                ListCart();
            }
            else {
                dialogAlert("Pease, \n\n try later");
            }

            loadingOff();

        },
        error: function (error) {
            loadingOff();
        }
    });
}

function Partners() {
    var idState = 0;
    $.ajax({
        url:'/shop/Partners',
        dataType: "json",
        type: "POST",
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {

            if (data.success) {

                $(data.result).each(function () {
                    var birthday = (this.birthday != null ? formatJSON(this.birthday) : null);
                    $("#id_partners").val(this.id_partners);
                    $("#name").val(this.name);
                    $("#lastname").val(this.lastname);
                    $("#month").val((birthday != null ? (birthday.getMonth() + 1) : ""));
                    $("#day").val((birthday != null ? birthday.getDate() : ""));
                    $("#year").val((birthday != null ? birthday.getFullYear() : ""));
                    $("#email_").val(this.email);
                    $("#company").val(this.company);
                    $("#taxID").val(this.taxID);
                    $("#phone").val(this.phone);
                    $("#address").val(this.address);
                    $("#zipCode").val(this.zipCode);
                    $("#city").val(this.city);
                    idState = this.id_state;
                    $("#id_country_").val(this.id_country);
                    $("#id_business").val(this.id_business);
                    $("#id_statusPartners").val(this.id_statusPartners);
                    $("#CheckoutModal").modal('hide');
                    $("#CheckoutPartnerModal").modal('show');
                    ListCountry_(this.id_country, false);
                });

                $("#state").val(idState);
            } else {
                
                dialogAlert(data.msg);
            }

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
    email = $("#email_"),
    id_business = $("#id_business"),
    company = $("#company"),
    taxID = $("#taxID"),
    phone = $("#phone"),
    address = $("#address"),
    zipCode = $("#zipCode"),
    city = $("#city"),
    state = $("#state"),
    id_country_ = $("#id_country_"),

    allFields = $([]).add(name).add(lastname).add(email).add(id_business).add(taxID).add(phone).add(address).add(zipCode).add(city).add(state).add(id_business);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(name, "Name Field Required", 1, 50);
    bValid = bValid && checkLength(lastname, "Lastname Field Required", 1, 50);

    bValid = bValid && checkLength(email, "E-mail Field Required", 1, 50);
    bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "invalid Email");
    
    bValid = bValid && checkLength(id_business, "Business Field Required", 1, 50);
    bValid = bValid && checkLength(company, "Company Name Field Required", 1, 50);
    //bValid = bValid && checkLength(taxID, "Tax ID Field Required", 1, 50);
    bValid = bValid && checkLength(phone, "Phone Field Required", 1, 50);
    bValid = bValid && checkLength(address, "Address Field Required", 1, 50);
    bValid = bValid && checkLength(zipCode, "Zip Code Field Required", 1, 50);
    bValid = bValid && checkLength(city, "City Field Required", 1, 50);
    bValid = bValid && checkLength(id_country_, "Country Field Required", 1, 50);
    bValid = bValid && checkLength(state, "State Province Field Required", 1, 50);

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function RulesListCart() {
    $.ajax({
        url: '/shop/RulesListCart',
        dataType: "json",
        type: "POST",
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            if (data.success) {
                $('#cart-rules').dataTable().fnDestroy();
                $("#cart-rules tbody").html("");
                var total = 0;
                var total_rules = 0;
                var totalMeenos = 0;
                var item_cont = 1;
                $(data.Result).each(function () {
                    $("#hdn-price").val(this.price.toFixed(2));
                    $("#hdn-price").maskMoney('mask');
                    $("#hdn-total-iten").val(this.total.toFixed(2));
                    $("#hdn-total-iten").maskMoney('mask');
                    //$("#hdn-weight_total").val(this.weight_total);
                    $("#hdn-weight_total").maskMoney('mask');
                    $("#hdn-price-rules").val((this.unit_price_rules == null ? 0 : this.unit_price_rules.toFixed(2)));
                    $("#hdn-price-rules").maskMoney('mask');
                    $("#hdn-total-iten-rules").val((this.discount_total == null ? 0 : this.discount_total.toFixed(2)));
                    $("#hdn-total-iten-rules").maskMoney('mask');
                    $("#custom").val(this.id_shop)

                    $("#cart-rules tbody").append(
                        '<tr>' +
                            '<td>' + this.name + " " + this.weight + ' oz ' + this.flavour + '</td>' +
                            '<td>' + this.amount + '</td>' +
                            '<td>' + (this.unit_price_rules == null ? $("#hdn-price").val() : '<span class="traco">' + $("#hdn-price").val() + '</span></br>  ' + $("#hdn-price-rules").val()) + '</td>' +
                            '<td>' + (this.weight_total == null ? "0" : this.weight_total.toFixed(2)) + '</td>' + //$("#hdn-weight_total").val()
                            '<td>' + (this.discount_total == null ? $("#hdn-total-iten").val() : '<span class="traco">' + $("#hdn-total-iten").val() + '</span></br> ' + $("#hdn-total-iten-rules").val()) + '</td>' +
                        '</tr>'
                    );

                    $("#div-iten").append(

                        '<input type="hidden" name="item_name_' + item_cont + '" value="' + this.name + " " + this.weight + ' oz ' + this.flavour + '"> ' +
                        '<input type="hidden" name="quantity_' + item_cont + '" value="' + this.amount + '"> ' +
                        '<input type="hidden" name="amount_' + item_cont + '" value="' + (this.unit_price_rules == null ? this.price : this.unit_price_rules)+ '"> '
                    );

                    item_cont++;

                    if ((this.unit_price_rules != null) || (this.discount_total != null)) {

                        total_rules = total_rules + this.discount_total;
                        totalMeenos = totalMeenos + this.total;
                    }

                    total = total + this.total;
                });

                $('#cart-rules').dataTable({
                    "responsive": true,
                    "lengthChange": false,
                    "info": false,
                    "bPaginate": false,
                    "searching": true,
                });

                $("#hdn-price").val(data.priceShipping.toFixed(2)); // shipping
                $("#handling_cart").val(data.priceShipping);
                $("#hdn-price").maskMoney('mask');

                $("#lbl-shipping").html($("#hdn-price").val());

                $("#hdn-total").val(total.toFixed(2));
                $("#hdn-total").maskMoney('mask');

                $("#lbl-total-rules").html('');

                if (total_rules > 0) {

                    totalMeenos = total - totalMeenos;
                    total_rules = total_rules + totalMeenos;

                    $("#hdn-total-rules").val(total_rules.toFixed(2));
                    $("#hdn-total-rules").maskMoney('mask');

                    $("#lbl-total-rules").append('<p class="traco" style="margin-bottom: -4px;">' + $("#hdn-total").val() + '</p">');
                    $("#lbl-total-rules").append($("#hdn-total-rules").val());

                    total_rules = total_rules + data.priceShipping;
                    $("#hdn-total-rules").val(total_rules.toFixed(2));
                    $("#hdn-total-rules").maskMoney('mask');

                    if (data.priceShipping != null) {
                        if (data.priceShipping > 0) {
                            $(".cs-hidden").show();
                            $("#lbl-total-rules-shipping").html($("#hdn-total-rules").val());
                        } else {
                            $(".cs-hidden").hide();
                            $("#lbl-total-rules-shipping").html();
                        }
                    } else {
                        $("#cs-hidden").hide();
                        $("#lbl-total-rules-shipping").html();
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
                            $("#lbl-total-rules-shipping").html();
                        }
                    } else {
                        $(".cs-hidden").hide();
                        $("#lbl-total-rules-shipping").html();
                    }

                    $("#lbl-total-rules-shipping").html($("#hdn-total").val());
                }

                $("#CheckoutPartnerModal").modal("hide");
                $("#CheckoutRules").modal("show");
            }
            else {

                if (data.error == "1") {
                    $("#LoginModal").modal("show");
                } else {
                    dialogAlert(data.msg);
                }
            }

            loadingOff();
        },
        error: function (error) {
            loadingOff();
        }
    });

}

function ListCountry_(id, bool) {

    if (id == "") {
        $('#state').html("");
        $('#state').append('<option value="" selected="selected">Select a State</option>');
        return false;
    }


    $('#state').html("");
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