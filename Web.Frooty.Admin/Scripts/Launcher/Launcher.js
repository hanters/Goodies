var jqXHRData;
var url;
var status;
var image = "";

$(document).ready(function () {

    //$('#posts').DataTable({
    //    "ordering": true
    //});

    $("#menu-dashboard").removeClass("active");
    $("#menu-launcher").addClass("open");

    $("[name='swicth-on']").bootstrapSwitch();
 

    $("#btnPost").on('click', function () {

        NewsPost();
    });

    $("#imagepost").fileinput({ 'showUpload': false });

    $("#imagepost").on('click', function (event, file, previewId) {
        $('#imageUpload').hide("slow");
        $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
        var image = "";
    });

    initSimpleFileUpload()

    SelectLauncher();

});

function initSimpleFileUpload() {
    'use strict';

    $('#imagepost').fileupload({
        url: caminhoApp + '/Launcher/UploadFile',
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
                           '<img  src="/Content/Images/Uploads/Launcher/' + image + '" class="file-preview-image" title="' + image + '" alt="">' +
                      '</div>' +
                  '</div>' +
                  '<div class="clearfix"></div>' +
                  '<div class="file-preview-status text-center text-success"></div>' +
              '</div>');
                $('#imageUpload').show("slow");
                $("#teste").html('<input id="imagepost" type="file" name="imagepost"  multiple=true>');
                $("#imagepost").fileinput({ 'showUpload': false });
                $("#imagepost").on('click', function (event, file, previewId) {
                    $('#imageUpload').hide("slow");
                    $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
                    image = "";
                });
                $('#load').html("");
                initSimpleFileUpload();
            }
            else {
            }
        },
        fail: function (event, data) {
            if (data.files[0].error) {
                alert(data.files[0].error);
            }
        }
    });
}

function SelectLauncher()
{
    $('#posts').dataTable().fnDestroy();

    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Launcher/SelectLauncher',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_launcher + '</td>' +
                        '<td>' + this.title + '</td>' +
                        '<td>' + this.url + '</td>' +
                        '<td>' + formatJSONDateAmerica(this.ts_user_cadm) + '</td>' +
                        '<td align="center">' + (this.active == true ? '<input type="radio" id="active_' + this.id_launcher + '" name="active_' + this.id_launcher + '" checked onclick="UpdateActicve(' + this.id_launcher + ')" />ON <input type="radio" name="active_' + this.id_launcher + '" onclick="UpdateActicve(' + this.id_launcher + ')" />OFF' : '<input id="active_' + this.id_launcher + '" type="radio" name="active_' + this.id_launcher + '" onclick="UpdateActicve(' + this.id_launcher + ')" />ON <input type="radio" name="active_' + this.id_launcher + '" checked onclick="UpdateActicve(' + this.id_launcher + ')" />OFF') + '</td>' +
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

function NewsPost()
{
    var dados = {

        title: $("#title").val(),
        url: $("#url").val(),
        image: image
        
    };


    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/Launcher/CadLauncher',
            dataType: "json",
            type: "POST",
            data: dados,
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success) {


                    Clear();
                    $('#imagepost').fileinput('clear');
                    SelectLauncher();
                    loadingOff();
                }
                else {
                    loadingOff();
                }
            },
            error: function (error) {
            }
        });
    }

}

function UpdateActicve(id)
{

    var dados = {
        id_launcher: id,
        active: ($("#active_" + id).is(":checked") == true ? true : false),
    };

    $.ajax({
        url: caminhoApp + '/Launcher/UpdateActicve',
        dataType: "json",
        type: "POST",
        data: dados,
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {
            if (data.success) {
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

function validateForm() {

    var title = $("#title"),
        url = $("#url"),
        imageLay = $('.input-group'),        
        allFields = $([]).add(title).add(url).add(imageLay);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(title, "Title Field  Required", 1, 50);
    bValid = bValid && checkLength(url, "Link of image Field  Required", 1, 50);
    bValid = bValid && imageLength(image, imageLay, "Image Field Required ");

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear()
{

    var title = $("#title"),
       url = $("#url"),
       imageLay = $('.input-group'),
       allFields = $([]).add(title).add(url).add(imageLay);

    allFields.removeClass("state-error");

    $("#title").val("");
    $("#url").val("");
    image = "";
  
}




