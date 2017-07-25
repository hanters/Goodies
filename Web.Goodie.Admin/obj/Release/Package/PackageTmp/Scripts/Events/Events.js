var jqXHRData;
var url;
var status;
var image;

$(document).ready(function () {
   
    $('#summernote').summernote({
        height: 250,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: true,                 // set focus to editable area after initializing summernote
    });

    $(".btn-warning").on('click', function () {
        $(".EventsModal").modal('show');
        $("#Inactive").hide();
        url = "CadEvents";
        Clear();
    });
    $('#date').datepicker({
        showOn: "button",
        buttonImage: "/Content/images/calendar.gif",
        buttonImageOnly: true,
        buttonText: "Select date"
    });

    $("#menu-dashboard").removeClass("active");
    $("#menu-events").addClass("open");
    $("#menu-events-overview").addClass("active");

    $("#imagepost").fileinput({ 'showUpload': false });

    $("#imagepost").on('click', function (event, file, previewId) {
        $('#imageUpload').hide("slow");
        $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
        image = "";
    });

    initSimpleFileUpload()

    $("#Published").on('click', function () {
        status = 3;      
        NewsPost();       
    });

    $("#Draft").on('click', function () {
        status = 2;
         NewsPost();
           
    });

    $("#Inactive").on('click', function () {
        status = 1;     
        NewsPost();
    });

    SelectEvents();

});

function initSimpleFileUpload() {
    'use strict';

    $('#imagepost').fileupload({
        url: caminhoApp + '/Events/UploadFile',
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
                           '<img  src="/Content/Images/Uploads/Events/' + image + '" class="file-preview-image" title="' + image + '" alt="">' +
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

function SelectEvents()
{
    $('#posts').dataTable().fnDestroy();

    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Events/SelectEvents',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_events + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + this.city + '</td>' +
                        '<td>' + formatJSONDateAmerica(this.ts_user_cadm) + '</td>' +
                        '<td align="center">' + this.status + ' <span class="badge2 btn-danger">!</span></td>' +
                        '<td><a href="#"  onclick ="EditEvents(' + this.id_events + ')"  class="btn btn-primary">Open <i class="fa fa-edit"></i></a></td>' +
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

function EditEvents(id) {

    Clear();

    var dados = {
        id_events: id,
    };
    $.ajax({
        url: caminhoApp + '/Events/EditEvents',
        dataType: "json",
        type: "POST",
        data: dados,
        success: function (data) {
            $(data.result).each(function () {
                $("#name").val(this.name);
                $("#address").val(this.address);
                $("#city").val(this.city);
                $("#state").val(this.state);
                $("#taglist").val(this.tags);
                $('.note-editable').html(this.content);
                $("#id_events").val(this.id_events);
                $("#date").val((this.date != null? formatJSONDateAmerica(this.date):""));
                image = (this.image == null ? "" : this.image);

                if (this.tags != null)
                { 
                    var tags = this.tags.split(",");
                    for (var i = 0; i < tags.length; i++) {
                        if (tags[i] != "") {
                        var tagblock = "<span class='label label-info' id='" + tags[i] + "'> <i class='glyphicon glyphicon-tag small'></i> " + tags[i] + " <span class='closetag'>×</span><span class='closetag sr-only'>Close</span></span>"
                            $('#tags').append("" + tagblock + "");
                        }
                    }
                }
                $('#imageUpload').html('<div class="file-preview edit">' +
                   '<div class="close fileinput-remove text-right"></div>' +
                    '<div class="file-preview-thumbnails">' +
                        '<div class="file-preview-frame" id="preview-1409928123859-0">' +
                             '<img  src="/Content/Images/Uploads/Events/' + this.image + '" class="file-preview-image" title="' + this.image + '" alt="'+this.image+'">' +
                        '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="file-preview-status text-center text-success"></div>' +
                '</div>');
            });

            $("#Inactive").show();
            $('#imageUpload').show();
            $(".EventsModal").modal('show');
            url = "upDateEvents";
        },
        error: function (error) {
        }
    });

}

function NewsPost()
{

    var dados = {

        id_events: $("#id_events").val(),
        name: $("#name").val(),
        tags: $("#taglist").val(),
        address: $("#address").val(),
        city: $('#city').val(),
        state: $('#state').val(),
        content: $('#summernote').code(),
        image: image,
        date:$("#date").val(),
        id_status: status,
        url: replaceSpecialChars($("#name").val()),
    };

    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/Events/' + url,
            dataType: "json",
            type: "POST",
            data: dados,
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success) {

                    $(".EventsModal").modal('hide');
                    $('#imagepost').fileinput('clear');
                    Clear();
                    SelectEvents();
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

function validateForm() {

    var name = $("#name"),
        tags = $("#taglist"),
        address = $("#address"),
        city = $('#city'),
        state = $('#state'),
        content = $('#summernote'),
        contentLay = $('.note-editor'),
        imageLay = $('.input-group'),
        date = $("#date"),
        allFields = $([]).add(name).add(tags).add(address).add(city).add(state).add(content).add(contentLay).add(imageLay).add(date);

    var bValid = true;
    allFields.removeClass("state-error");

    bValid = bValid && checkLength(name, "Name Field Required", 1, 50);
    bValid = bValid && checkLength(address, "Address Field Required", 1, 50);
    bValid = bValid && checkLength(city, "City Field Required", 1, 50);
    bValid = bValid && checkLength(state, "State Field Required", 1, 50);
    bValid = bValid && checkLength(date, "Event Date Field Required", 1, 50);
    bValid = bValid && imageLength(image, imageLay, "Image Field Required ");
    bValid = bValid && ContentLength(content, contentLay, "Content Field Required ", 1, 10000);
    

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear()
{

    $(".alert").hide('slow');
    var name = $("#name"),
        tags = $("#taglist"),
        address = $("#address"),
        city = $('#city'),
        state = $('#state'),
        content = $('#summernote'),
        contentLay = $('.note-editor'),
        imageLay = $('.input-group'),
        date = $("#date"),
    allFields = $([]).add(name).add(tags).add(address).add(city).add(state).add(content).add(contentLay).add(imageLay).add(date);

    allFields.removeClass("state-error");

    $("#name").val("");
    $("#address").val("");
    $("#city").val("");
    $("#state").val("");
    $("#imagepost").fileinput('reset');
    $("#taglist").val("");
    $("#tags > span").remove();
    $('.note-editable').html("");
    $('#imageUpload').html("");
    $("#id_events").val("");
    $("#date").val("");
    $(".alert").hide();
    image = "";
    $('#load').html("");
}




