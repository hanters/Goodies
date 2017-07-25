var jqXHRData;
var url;
var status;
var image;

$(document).ready(function () {


    $('#price').maskMoney({ prefix: '', allowNegative: true, thousands: ',', decimal: '.', affixesStay: false });

    $("#weight").maskMoney({ precision: 2 });

    $(".btn-warning").on('click', function () {
        $(".EventsModal").modal('show');
        url = "AddProducts";
        Clear();
    });

    $("#imageproduct").fileinput({ 'showUpload': false });

    $("#imageproduct").on('click', function (event, file, previewId) {
        $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
        $('#imageUpload').hide("slow");
        image = "";
    });

    initSimpleFileUpload()

    $(".btn-success").on('click', function () {
        Products();
    });

    $(".btn-danger").on('click', function () {
        dialogconfirmation('Do you want to delete this product', Discard, $('#id_products').val());
    });

    ListStatus();
    SelectProducts();

});

function initSimpleFileUpload() {
    'use strict';

    $('#imageproduct').fileupload({
        url: caminhoApp + '/Products/UploadFile',
        dataType: 'json',
        add: function (e, data) {
            jqXHRData = data.submit();
        },
        done: function (event, data) {
            if (data.result.isUploaded) {
                image = data.result.message;
                $("#teste").html("");
                $('#imageUpload').html('<div class="file-preview edit">' +
                 '<div class="close fileinput-remove text-right"></div>' +
                  '<div class="file-preview-thumbnails">' +
                      '<div class="file-preview-frame" id="preview-1409928123859-0">' +
                           '<img  src="/Content/Images/Uploads/Products/' + image + '" class="file-preview-image" title="' + image + '" alt="">' +
                      '</div>' +
                  '</div>' +
                  '<div class="clearfix"></div>' +
                  '<div class="file-preview-status text-center text-success"></div>' +
              '</div>');
                $('#imageUpload').show("slow");
                $("#teste").html('<input id="imageproduct" type="file" name="imageproduct"  multiple=true>');
                $("#imageproduct").fileinput({ 'showUpload': false });
                $("#imageproduct").on('click', function (event, file, previewId) {
                    $('#imageUpload').hide("slow");
                    $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
                    image = "";
                });
                $('#load').html("");

              
                initSimpleFileUpload();
            }
            else {
                alert(data.message);
                $('#load').html("");
            }
        },
        fail: function (event, data) {
            if (data.files[0].error) {
                alert(data.files[0].error);
                $('#load').html("");
            }
        }
    });
}

function SelectProducts() {

    $('#posts').dataTable().fnDestroy();
    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Products/SelectProducts',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $("#price").val(this.price.toFixed(2));
                $("#price").maskMoney('mask');
                $("#weight").val(this.weight.toFixed(2));
                $("#weight").maskMoney('mask');

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_products + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + this.flavour + '</td>' +
                        '<td>' + $("#weight").val() + '</td>' +
                        '<td>' + $("#price") .val() + '</td>' +
                        '<td>' + this.description + '</td>' +
                        '<td><a href="#" onclick ="EditProducts(' + this.id_products + ')" class="btn btn-xs btn-success"><i class="fa fa-edit"></i> Edit</a></td>' +
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

function EditProducts(id) {

    Clear();
 
    $.ajax({
        url: caminhoApp + '/Products/EditProducts',
        dataType: "json",
        type: "POST",
        data: { id: id },
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            $(data.result).each(function () {

                $("#price").val(this.price.toFixed(2));
                $("#price").maskMoney('mask');
                $("#weight").val(this.weight.toFixed(2));
                $("#weight").maskMoney('mask');

                $("#id_products").val(id );
                $("#name").val(this.name);
                $("#flavour").val(this.flavour);
                $("#weight").val($("#weight").val());
                $("#price").val($("#price").val());
                $("#status").val(this.id_status);
                $("#description").val(this.description);
                image = (this.picture == null? "" :this.picture) ;

                $('#imageUpload').html('<div class="file-preview edit">' +
                   '<div class="close fileinput-remove text-right"></div>' +
                    '<div class="file-preview-thumbnails">' +
                        '<div class="file-preview-frame" id="preview-1409928123859-0">' +
                             '<img  src="/Content/Images/Uploads/Products/' + this.picture + '" class="file-preview-image" title="' + this.picture + '" alt="' + this.picture + '">' +
                        '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="file-preview-status text-center text-success"></div>' +
                '</div>');
            });
            $(".EventsModal").modal('show');
            $('#imageUpload').show();
            url = "UpdateProducts";
            loadingOff();

        },
        error: function (error) {
            loadingOff();
        }
    });

}

function Products() {

    var dados = {

         id_products: $("#id_products").val(),
         name: $("#name").val(),
         flavour: $("#flavour").val(),
         weight: $("#weight").val().replace(",", ""),//.replace(".",","),
         price: $("#price").val().replace(",", ""),//.replace(".", ","),
         id_status: $("#status").val(),
         picture: image,
         description: $("#description").val(),
    };

    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/Products/' + url,
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
                    SelectProducts();
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

function ListStatus() {

    $('#status').html("");
    $('#status').append('<option value="">Select</option>');
    $.ajax({
        url: caminhoApp + '/Products/ListStatus',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {
                $('#status').append('<option value=' + this.id_status + '>' + this.description + '</option>');
            });
        },
        error: function (error) {
        }
    });
}

function validateForm() {

    var name = $("#name"),
        flavour = $("#flavour"),
        weight =$("#weight"),
        price =$("#price"),
        id_status = $("#status"),
        picture = $("#imageproduct"),
        description = $("#description"),
    
    allFields = $([]).add(name).add(flavour).add(weight).add(price).add(id_status).add(picture).add(description);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(name, "Name Field Required", 1, 50);
    bValid = bValid && checkLength(flavour, "Flavour Field Required", 1, 50);
    bValid = bValid && checkLength(price, "Price Field Required", 1, 50);
    bValid = bValid && checkLength(id_status, "Status Field Required", 1, 50);
    bValid = bValid && checkLength(description, "Description Field Required", 1, 100);
    
    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear() {   
    $("#id_products").val('');
    $("#name").val('');
    $("#flavour").val('');
    $("#weight").val('');
    $("#price").val('');
    $("#id_status").val('');
    $("#description").val('');
    image = "";
    $('#load').html("");
    $("#teste").html("");
    
    $("#teste").html('<input id="imageproduct" type="file" name="imageproduct"  multiple=true>');
    $("#imageproduct").fileinput({ 'showUpload': false });
    $("#imageproduct").on('click', function (event, file, previewId) {
        $('#imageUpload').hide("slow");
        $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
        image = "";
    });
    $('#load').html("");
    $('#imageUpload').html("");
    initSimpleFileUpload();
}

function Discard(id) {

    $.ajax({
        url: caminhoApp + '/Products/Discard',
        dataType: "json",
        type: "POST",
        data: { id_products: id },
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            if (data.success) {
                $(".EventsModal").modal('hide');
                Clear();
                ListStatus();
                SelectProducts();              
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



