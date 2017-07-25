$(document).ready(function () {

    $("#menu-locations").addClass("open");
    $("[name='swicth-on']").bootstrapSwitch();

    $("#btnPost").on('click', function () {

        NewsPost();
    });

    SelectLocations();

});

function SelectLocations()
{
    $('#posts').dataTable().fnDestroy();

    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Locations/SelectLocations',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_location + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + this.address + '</td>' +
                        '<td>' + this.city + '</td>'+
                        '<td>' + this.state + '</td>' +
                        '<td><a  style= "cursor:pointer" onClick="UpdateActicve(' + this.id_location + ')">X</a></td>' +
                    '</tr>');

            });

            $("[name='swicth-on']").bootstrapSwitch();


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

        name :$("#name").val(),
        address: $("#address").val(),
        Zipcode: $('#Zipcode').val(),
        city: $('#city').val(),
        state: $('#state').val(),

    };


    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/Locations/CadLocations',
            dataType: "json",
            type: "POST",
            data: dados,
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success) {
                    Clear();
                    SelectLocations();
                    loadingOff();
                }
                else {
                    loadingOff();
                }
            },
            error: function (error) {
                loadingOff();
            }
        });
    }

}

function UpdateActicve(id) {

    var dados = {
        id_location: id
    };

    bootbox.confirm("Want to delete?", function (result) {

        if (result)
        {

            $.ajax({
                url: caminhoApp + '/Locations/UpdateActicve',
                dataType: "json",
                type: "POST",
                data: dados,
                beforeSend: function () {
                    loadingOn();
                },
                success: function (data) {
                    if (data.success) {

                        SelectLocations();
                        loadingOff();
                    }
                    else {
                        loadingOff();
                    }
                },
                error: function (error) {

                    loadingOff();
                }
            });
        }

    });


}

function validateForm() {

    var name = $("#name"),
        address = $("#address"),
        Zipcode = $('#Zipcode'),
        city = $('#city'),
        state = $('#state'),
        allFields = $([]).add(name).add(address).add(Zipcode).add(city).add(state);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(name, "Name Field  Required", 1, 50);
    bValid = bValid && checkLength(address, "Address Field  Required", 1, 50);
    bValid = bValid && checkLength(Zipcode, "Zipcode Field  Required", 1, 50);
    bValid = bValid && checkLength(city, "City Field  Required", 1, 50);
    bValid = bValid && checkLength(state, "State Field  Required", 1, 50);
   

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear() {

    var name = $("#name"),
       address = $("#address"),
       Zipcode = $('#Zipcode'),
       city = $('#city'),
       state = $('#state'),
       allFields = $([]).add(name).add(address).add(Zipcode).add(city).add(state);

    allFields.removeClass("state-error");

    $("#AddLocation")[0].reset();

    

}