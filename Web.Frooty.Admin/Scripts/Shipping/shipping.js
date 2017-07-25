var url;
$(document).ready(function () {

    $('#price,#bronze_price,#silver_price,#gold_price,#hdn_price,#hdn_bronze_price,#hdn_silver_price,#hdn_gold_price').maskMoney({ prefix: '', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });

    $(".btn-warning").on('click', function () {
        $(".EventsModal").modal('show');
        url = "addShipping";
        Clear();
    });

    $(".btn-success").on('click', function () {
        Shipping();
    });

    $(".btn-danger").on('click', function () {
        dialogconfirmation('Do you want to delete?', Discard, $('#id_shipping').val());
        
    });

    listShipping();

});

function listShipping() {

    $('#posts').dataTable().fnDestroy();
    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Shipping/listShipping',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $("#hdn_price").val((this.price == null ? 0 : this.price.toFixed(2)));
                $("#hdn_bronze_price").val((this.bronze_price == null ? 0 : this.bronze_price.toFixed(2)));
                $("#hdn_silver_price").val((this.silver_price == null ? 0 : this.silver_price.toFixed(2)));
                $("#hdn_gold_price").val((this.gold_price == null ? 0 : this.gold_price.toFixed(2)));

                $('#hdn_price,#hdn_bronze_price,#hdn_silver_price,#hdn_gold_price').maskMoney('mask');

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.ds_group + '</td>' +
                        '<td>' + $("#hdn_price").val() + '</td>' +
                        '<td>' + $("#hdn_bronze_price").val() + '</td>' +
                        '<td>' + $("#hdn_silver_price").val() + '</td>' +
                        '<td>' + $("#hdn_gold_price").val() + '</td>' +
                        '<td>' + (this.fl_shipping == "Y" ? 'YES' : 'NO') + '</td>' +
                        '<td><a href="#" onclick ="EditShipping(' + this.id_shipping + ')" class="btn btn-xs btn-success"><i class="fa fa-edit"></i> Edit</a></td>' +
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

function Shipping() {

    if (validateForm()) {

        var dados = {
            id_shipping : $("#id_shipping").val(),
            ds_group: $("#ds_group").val(),
            price: $("#price").val().replace(",", ""),//.replace(".",","),,
            bronze_price: $("#bronze_price").val().replace(",", ""),//.replace(".",","),,
            silver_price: $("#silver_price").val().replace(",", ""),//.replace(".",","),,
            gold_price: $("#gold_price").val().replace(",", ""),//.replace(".",","),,
            fl_shipping: $("#fl_shipping").val(),
        };

        var result = [];
        var obj;

        for (i = 0; i < document.getElementById("id_state_").options.length ; i++) {

            obj = jQuery.parseJSON('{ "id_state": " ' + document.getElementById("id_state_").options[i].value + ' ", "id_shipping" : "' + $("#id_shipping").val() + '" }');
            result.push(obj);
        }

        $("#id_state_").removeClass("state-error");
        $(".alert").hide('slow');

        if (result.length <= 0) {
            $("#id_state_").addClass("state-error");
            $("#Pmsg").html("States Field Required");
            $(".alert").show('slow');
            return false;
        }

        $.ajax({
            url: '/Shipping/' + url,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            data: JSON.stringify({ dados: dados, dados2: result }),
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.result == true) {

                    $(".EventsModal").modal('hide');
                    listShipping();

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

    var ds_group = $("#ds_group"),
    price = $("#price"),
    bronze_price = $("#bronze_price"),
    silver_price = $("#silver_price"),
    gold_price = $("#gold_price"),
    fl_shipping = $("#fl_shipping"),
    id_country = $("#id_country"),
   
    allFields = $([]).add(ds_group).add(price).add(bronze_price).add(silver_price).add(gold_price).add(fl_shipping).add(id_country);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(ds_group, "Group Name Field Required", 1, 50);
    bValid = bValid && checkLength(price, "Price Field Required", 1, 50);
    bValid = bValid && checkLength(bronze_price, "Bronze Price Field Required", 1, 50);
    bValid = bValid && checkLength(silver_price, "Silver Price Field Required", 1, 50);
    bValid = bValid && checkLength(gold_price, "Gold Price Field Required", 1, 50);
    
    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function ListCountry() {

    $('#id_state').html("");
   
    $.ajax({
        url: caminhoApp + '/Shipping/listState',
        dataType: "json",
        type: "POST",
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {

            $(data.result).each(function () {
                $('#id_state').append('<option value="' + this.id_state + '">'+ this.ds_codigo + ' - ' + this.ds_name + '</option>');
            });

            loadingOff();
        },
        error: function (error) {
            loadingOff();
        }
    });
}

function ListStates(id) {

    $('#id_state').html("");
    $('#id_state_').html("");

    $.ajax({
        url: caminhoApp + '/Shipping/ListStates',
        dataType: "json",
        type: "POST",
        data:{id_shipping : id},
       
        success: function (data) {
            $(data.result).each(function () {
                $('#id_state').append('<option value="' + this.id_state + '">' + this.ds_codigo + ' - ' + this.ds_name + '</option>');
            });

            $(data.result2).each(function () {
                $('#id_state_').append('<option value="' + this.id_state + '">' + this.ds_codigo + ' - ' + this.ds_name + '</option>');
            });
            $(".EventsModal").modal('show');
            url = "updateShipping";
            loadingOff();
        },
        error: function (error) {
            loadingOff();
        }
    });
}

function EditShipping(id) {

    $.ajax({
        url: caminhoApp + '/Shipping/EditShipping',
        dataType: "json",
        type: "POST",
        data: { id_shipping: id },
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            $(data.result).each(function () {

                $("#id_shipping").val(this.id_shipping);
                $("#ds_group").val(this.ds_group);
                $("#price").val((this.price == null ? 0 : this.price.toFixed(2)));
                $("#bronze_price").val((this.bronze_price == null ? 0 : this.bronze_price.toFixed(2)));
                $("#silver_price").val((this.silver_price == null ? 0 : this.silver_price.toFixed(2)));
                $("#gold_price").val((this.gold_price == null ? 0 : this.gold_price.toFixed(2)));
                $("#fl_shipping").val(this.fl_shipping);

                $('#price,#bronze_price,#silver_price,#gold_price').maskMoney('mask');

            });

            ListStates(id);
        },
        error: function (error) {
            loadingOff();
        }
    });
}

function Discard(id) {

    $.ajax({
        url: caminhoApp + '/Shipping/Discard',
        dataType: "json",
        type: "POST",
        data: { id_shipping: id },
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            if (data.success) {
                $(".EventsModal").modal('hide');
                listShipping();
                Clear();    
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

    $("#id_shipping").val("");
    $("#ds_group").val("");
    $("#price").val("");
    $("#bronze_price").val("");
    $("#silver_price").val("");
    $("#gold_price").val("");
    $('#id_state_').html("");
    $("#hdn_price").val("");
    $("#hdn_bronze_price").val("");
    $("#hdn_silver_price").val("");
    $("#hdn_gold_price").val("");

    ListCountry();

    var ds_group = $("#ds_group"),
    price = $("#price"),
    bronze_price = $("#bronze_price"),
    silver_price = $("#silver_price"),
    gold_price = $("#gold_price"),
    fl_shipping = $("#fl_shipping"),

    allFields = $([]).add(ds_group).add(price).add(bronze_price).add(silver_price).add(gold_price).add(fl_shipping);

    var bValid = true;
    allFields.removeClass("state-error");

}

function move(tbFrom, tbTo) {
    var arrFrom = new Array(); var arrTo = new Array();
    var arrLU = new Array();
    var i;
    for (i = 0; i < tbTo.options.length; i++) {
        arrLU[tbTo.options[i].text] = tbTo.options[i].value;
        arrTo[i] = tbTo.options[i].text;
    }
    var fLength = 0;
    var tLength = arrTo.length;
    for (i = 0; i < tbFrom.options.length; i++) {
        arrLU[tbFrom.options[i].text] = tbFrom.options[i].value;
        if (tbFrom.options[i].selected && tbFrom.options[i].value != "") {
            arrTo[tLength] = tbFrom.options[i].text;
            tLength++;
        }
        else {
            arrFrom[fLength] = tbFrom.options[i].text;
            fLength++;
        }
    }

    tbFrom.length = 0;
    tbTo.length = 0;
    var ii;

    for (ii = 0; ii < arrFrom.length; ii++) {
        var no = new Option();
        no.value = arrLU[arrFrom[ii]];
        no.text = arrFrom[ii];
        tbFrom[ii] = no;
    }

    for (ii = 0; ii < arrTo.length; ii++) {
        var no = new Option();
        no.value = arrLU[arrTo[ii]];
        no.text = arrTo[ii];
        tbTo[ii] = no;
    }
}