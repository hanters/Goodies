var url;
$(document).ready(function () {
    
    ListRules();

    $(".btn-warning").on('click', function () {
        $("#rulesModal").modal('show');
        $(".btn-danger").hide();
        url = "addRules";
        Clear();
    });

    $(".btn-success").on('click', function () {
        if (validateForm()) {
            Rules();
        }
    });

    $('#price_bronze, #price_silver, #price_gold').maskMoney({ prefix: '', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });
    $('#hdn_price_bronze,#hdn_price_silver,#hdn_price_gold').maskMoney({ prefix: '$', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });

    //$("#weight_bronze, #weight_silver,#weigth_gold").maskMoney({ precision: 1 });

   
    listProduct();

    listStatus();

});

function listProduct()
{

    $("#id_products").empty();
    $("#id_products").append("<option value=''>Selecione</option>");

    $.ajax({
        url: caminhoApp + '/Rules/listProduct',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {
                $('#id_products').append('<option value="' + this.id_products + '">' + this.name + " - " + this.flavour + '</option>');
            });
        },
        error: function (error) {
        }
    });
}

function listStatus() {

    $("#id_status").empty();
    $("#id_status").append("<option value=''>Selecione</option>");

    $.ajax({
        url: caminhoApp + '/Rules/listStatus',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {
                $('#id_status').append('<option value="' + this.id_status + '">' + this.description + '</option>');
            });
        },
        error: function (error) {
        }
    });
}

function ListRules() {

    $('#posts').dataTable().fnDestroy();
    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Rules/ListRules',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $("#hdn_price_bronze").val(this.price_bronze.toFixed(2));
                $("#hdn_price_silver").val(this.price_silver.toFixed(2));
                $("#hdn_price_gold").val(this.price_gold.toFixed(2));

                $("#hdn_price_bronze,#hdn_price_silver,#hdn_price_gold").maskMoney("mask");

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_role + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + $("#hdn_price_bronze").val() + '</td>' +
                        '<td>' + $("#hdn_price_silver").val() + '</td>' +
                        '<td>' + $("#hdn_price_gold").val() + '</td>' +
                        '<td>' + this.description + '</td>' +
                        '<td><a href="#" onclick ="EditRules(' + this.id_role + ')" class="btn btn-xs btn-success"><i class="fa fa-edit"></i> Edit</a></td>' +
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

function validateForm() {

    var id_products = $("#id_products"),
        id_status = $("#id_status"),
        //weight_bronze = $("#weight_bronze"),
        price_bronze = $("#price_bronze"),
        //weight_silver = $("#weight_silver"),
        price_silver = $("#price_silver"),
        //weigth_gold = $("#weigth_gold"),
        price_gold = $("#price_gold"),

    allFields = $([]).add(id_products).add(id_status).add(price_bronze).add(price_silver).add(price_gold);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(id_products, "Products Field Required", 1, 50);
    bValid = bValid && checkLength(id_status, "Status Field Required", 1, 50);
   // bValid = bValid && checkLength(weight_bronze, "Weight Bonze Field Required", 1, 50);
    bValid = bValid && checkLength(price_bronze, "Price Bonze Field Required", 1, 50);
   // bValid = bValid && checkLength(weight_silver, "Weight Silver Field Required", 1, 100);
    bValid = bValid && checkLength(price_silver, "Price Silver Field Required", 1, 100);
   // bValid = bValid && checkLength(weigth_gold, "Weight Gold Field Required", 1, 100);
    bValid = bValid && checkLength(price_gold, "Price Gold Field Required", 1, 100);

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function EditRules(id) {

    Clear();

    $.ajax({
        url: caminhoApp + '/Rules/searchRules',
        dataType: "json",
        type: "POST",
        data: { id_role: id },
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            $(data.result).each(function () {

                $("#id_role").val(id);
                $("#id_products").val(this.id_products);
                $("#id_status").val(this.id_status);
                //$("#weight_bronze").val(this.weight_bronze.toFixed(1));
                $("#price_bronze").val(this.price_bronze.toFixed(2));
                //$("#weight_silver").val(this.weight_silver.toFixed(1));
                $("#price_silver").val(this.price_silver.toFixed(2));
                //$("#weigth_gold").val(this.weigth_gold.toFixed(1));
                $("#price_gold").val(this.price_gold.toFixed(2));
                
            });

            $('#price_bronze, #price_silver, #price_gold,#hdn_price_bronze,#hdn_price_silver,#hdn_price_gold').maskMoney("mask");

            //$("#weight_bronze, #weight_silver,#weigth_gold").maskMoney("mask");

            $("#rulesModal").modal('show');
            $(".btn-danger").show();
            url = "updateRules";

            loadingOff();

        },
        error: function (error) {
        }
    });

}

function Rules() {

    var dados = {

        id_role: $("#id_role").val(),
        id_products: $("#id_products").val(),
        id_status: $("#id_status").val(),
        //weight_bronze: $("#weight_bronze").val().replace(",", ""),//.replace(".", ","),
        price_bronze: $("#price_bronze").val().replace(",", ""),//.replace(".", ","),
        //weight_silver: $("#weight_silver").val().replace(",", ""),//.replace(".", ","),
        price_silver: $("#price_silver").val().replace(",", ""),//.replace(".", ","),
        //weigth_gold: $("#weigth_gold").val().replace(",", ""),//.replace(".", ","),
        price_gold: $("#price_gold").val().replace(",", ""),//.replace(".", ","),
    }

    $.ajax({
        url: caminhoApp + '/Rules/' + url ,
        dataType: "json",
        type: "POST",
        data: dados,
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            if (data.success) {
                if (url == "addRules") {
                 $("#rulesModal").modal('hide'); 
                }

                ListRules();
                             
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

function Clear() {

    $("#id_role").val("");
    $("#id_products").val("");
    $("#id_status").val("");
    //$("#weight_bronze").val("");
    $("#price_bronze").val("");
    //$("#weight_silver").val("");
    $("#price_silver").val("");
   // $("#weigth_gold").val("");
    $("#price_gold").val("");
}


function Discard(id) {

    $.ajax({
        url: caminhoApp + '/Rules/Discard',
        dataType: "json",
        type: "POST",
        data: { id_role: id },
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            if (data.success) {
                $("#rulesModal").modal('hide');
                ListRules();
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
     



