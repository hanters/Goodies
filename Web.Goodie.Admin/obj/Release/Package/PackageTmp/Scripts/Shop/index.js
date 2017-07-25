var jqXHRData;
var url;
var status;
var image;

$(document).ready(function () {

    $('#hdn-total,#hdn-price,#hdn-total-rules,#hdn-price-rules').maskMoney({ prefix: '$ ', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });

    $("#btn-salvar").on('click', function () {
        dialogconfirmation("Do you what change status?", updateStatus, true);
    });

    $("#btn-refresh").on('click', function () {

        EditShop($("#id_shop").val(), $("#hdn-date").val(), $("#id_status").val(),$("#id_partnes").val());
        
    });

    listShop();

});

function listShop() {

    $('#requests').dataTable().fnDestroy();
    $('#requests tbody').html("");

    $.ajax({
        url: caminhoApp + '/Shop/listShop',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#hdn-total').val((this.discount_total == null ? (this.total == null ? 0 : this.total.toFixed(2)) : (this.discount_total > 0 ? (this.discount_total == null ? 0 : this.discount_total.toFixed(2)) : (this.total == null ? 0 : this.total.toFixed(2)) )));
                $("#hdn-total").maskMoney("mask");

                $('#requests tbody').append(
                    '<tr>' +
                        '<td>' + this.id_shop + '</td>' +
                        '<td>' + this.email + '</td>' +
                        '<td>' + formatJSONDateAmerica(this.date) + '</td>' +
                        '<td>' + this.description + '</td>' +
                        '<td>' + $('#hdn-total').val() + '</td>' +
                        '<td><a href="#" onclick ="EditShop(' + this.id_shop + ', \'' + formatJSONDateAmericaTime(this.date) + '\', \'' + this.id_status + '\', \'' + this.id_partners + '\')" class="btn btn-xs btn-success"><i class="fa fa-edit"></i> Edit</a></td>' +
                    '</tr>');
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

function EditShop(id,date,id_status, id_partnes) {

    Clear();
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
                        '<td>' + (this.weight_total == null? "0" : this.weight_total.toFixed(2) )+ '</td>' +
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

            $("#hdn-price").val((data.priceShipping == null ? 0 :data.priceShipping.toFixed(2))); // shipping
            $("#hdn-price").maskMoney('mask');

            $("#lbl-shipping").html($("#hdn-price").val());

            var id_shop = new String(id);
            $("#lbl-id-shop").html(id_shop.padLeft(6, '0'))

            $("#lbl-date").html(date);
            $("#id_status").val(id_status);
            $("#id_partnes").val(id_partnes);
            $("#hdn-total").val(total.toFixed(2));
            $("#hdn-total").maskMoney('mask');
            $("#hdn-date").val(date)
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

                total_rules = total_rules + data.priceShipping;
                $("#hdn-total-rules").val(total_rules.toFixed(2));
                $("#hdn-total-rules").maskMoney('mask');

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

            $("#ModalRequest").modal('show');

            loadingOff();

            listShop();

        },
        error: function (error) {
            loadingOff();
        }
    });

}

function Clear() {
    $("#lbl-total-rules").html("");
    $("#lbl-total-rules-shipping").html("");
    $("#lbl-shipping").html("");
    $("#id_shop").val('');
}

function updateStatus(bool) {

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
                listShop();
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