$(document).ready(function () {

    $(".btn-success").on('click', function () {

        var dados = {
            fl_active: $("#fl_active").val(),
            weight_bronze: $("#weight_bronze").val().replace(",", ""),//.replace(".", ","),
            weight_silver: $("#weight_silver").val().replace(",", ""),//.replace(".", ","),
            weigth_gold: $("#weigth_gold").val().replace(",", ""),//.replace(".", ","),    
        }

        if (validateForm()) {
            $.ajax({
                url: caminhoApp + '/Rules/update',
                data: dados,
                dataType: "json",
                type: "POST",
                beforeSend: function () {
                    loadingOn();
                },
                success: function (data) {
                   
                    $("#rules-Modal").modal('hide');
                    ListRules();
                    loadingOff();

                },
                error: function (error) {
                }
            });
        }
    });

    $("#hdn_bronze, #hdn_silver,#hdn_gold").maskMoney({ precision: 2 });

    $("#weight_bronze, #weight_silver,#weigth_gold").maskMoney({ precision: 2 });


    ListRules()

});

function ListRules() {

    $('#posts').dataTable().fnDestroy();
    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Rules/ListRules2',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $("#hdn_bronze").val((this.weight_bronze != null ? this.weight_bronze.toFixed(2) : 0));
                $("#hdn_silver").val((this.weight_silver != null ? this.weight_silver.toFixed(2) : 0));
                $("#hdn_gold").val((this.weigth_gold != null ? this.weigth_gold.toFixed(2) : 0));

                $("#hdn_bronze,#hdn_silver,#hdn_gold").maskMoney("mask");

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + $("#hdn_bronze").val() + '</td>' +
                        '<td>' + $("#hdn_silver").val() + '</td>' +
                        '<td>' + $("#hdn_gold").val() + '</td>' +
                        '<td>' + (this.fl_active == 'S' ? "Active" : "Disabled") + '</td>' +
                        '<td><a href="#" onclick ="EditRules(' + this.id_rules + ')" class="btn btn-xs btn-success"><i class="fa fa-edit"></i> Edit</a></td>' +
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

function EditRules(id) {

    $.ajax({
        url: caminhoApp + '/Rules/ListRules2',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {
       
                //$("#id_status").val(this.id_status);

                $("#weight_bronze").val(this.weight_bronze.toFixed(2));
                
                $("#weight_silver").val(this.weight_silver.toFixed(2));
               
                $("#weigth_gold").val(this.weigth_gold.toFixed(2));

                $("#fl_active").val(this.fl_active);

                $("#weight_bronze, #weight_silver,#weigth_gold").maskMoney('mask');




            });

            //$("#weight_bronze, #weight_silver,#weigth_gold").maskMoney("mask");

            $("#rules-Modal").modal('show');
            $(".btn-danger").show();
       
        },
        error: function (error) {
        }
    });

}

function validateForm() {

    var weight_bronze = $("#weight_bronze"),
        weight_silver = $("#weight_silver"),
        weigth_gold = $("#weigth_gold"),
       
    allFields = $([]).add(weight_bronze).add(weight_silver).add(weigth_gold);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(weight_bronze, "Weight Bonze Field Required", 1, 50);
   
    bValid = bValid && checkLength(weight_silver, "Weight Silver Field Required", 1, 100);
   
    bValid = bValid && checkLength(weigth_gold, "Weight Gold Field Required", 1, 100);
   

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}