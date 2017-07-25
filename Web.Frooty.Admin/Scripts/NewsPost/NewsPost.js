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
        url = "CadNewPost";
        Clear();
    });

    $("#imagepost").fileinput({ 'showUpload': false });

    $("#imagepost").on('click', function (event, file, previewId) {
        $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
        $('#imageUpload').hide("slow");
        image = "";
    });

    initSimpleFileUpload();

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

    SelectNewPost();

});

function initSimpleFileUpload() {
    'use strict';

    $('#imagepost').fileupload({
        url: caminhoApp + '/news/UploadFile',
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
                           '<img  src="/Content/Images/Uploads/News/' + image + '" class="file-preview-image" title="' + image + '" alt="">' +
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

function SelectNewPost()
{
    $('#posts').dataTable().fnDestroy();

    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/news/SelectNewPost',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_newPost + '</td>' +
                        '<td>' + this.title + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + formatJSONDateAmerica(this.ts_user_cadm) + '</td>' +
                        '<td align="center">' + this.status + ' <span class="badge2 btn-danger">!</span></td>' +
                        '<td><a href="#"  onclick ="editNewsPost(' + this.id_newPost + ')"  class="btn btn-primary">Open <i class="fa fa-edit"></i></a></td>' +
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

function editNewsPost(id) {

    Clear();

    var dados = {
        id_newPost: id,
    };
    $.ajax({
        url: caminhoApp + '/News/EditNewsPost',
        dataType: "json",
        type: "POST",
        data: dados,
        success: function (data) {
            $(data.result).each(function () {
                $("#title").val(this.title);
                $("#taglist").val(this.tags);
                $("#introduction").val(this.introduction);
                $('#summernote').code();
                $('.note-editable').html(this.content);
                $("#id_newPost").val(this.id_newPost);
                image = (this.image == null? "" :this.image) ;

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
                             '<img  src="/Content/Images/Uploads/News/' + this.image + '" class="file-preview-image" title="' + this.image + '" alt="'+this.image+'">' +
                        '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="file-preview-status text-center text-success"></div>' +
                '</div>');
            });
            $('#imageUpload').show();
            $("#Inactive").show();
            $(".EventsModal").modal('show');
            url = "upDateNewsPost";
        },
        error: function (error) {
        }
    });

}

function NewsPost()
{
    var dados = {

        id_newPost:$("#id_newPost").val(),
        title: $("#title").val(),
        tags: $("#taglist").val(),
        introduction: $("#introduction").val(),
        content: $('#summernote').code(),
        image: image,
        id_status: status,
        url :replaceSpecialChars($("#title").val()),
    };

    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/news/' + url,
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
                    SelectNewPost();
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
 
    var title = $("#title"),
        introduction = $("#introduction"),
        content = $('#summernote'),
        contentLay = $('.note-editor'),
        imageLay = $('.input-group')
        allFields = $([]).add(title).add(tags).add(introduction).add(content).add(imageLay).add(contentLay);

    var bValid = true;

    allFields.removeClass("state-error");
   
    bValid = bValid && checkLength(title, "Title Field Required", 1, 100);
    bValid = bValid && checkLength(introduction, "Introduction Field Required ", 1, 100);
    bValid = bValid && imageLength(image, imageLay, "Image Field Required ");
    bValid = bValid && ContentLength(content, contentLay, "Content Field Required ",1, 10000);
  
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
    var title = $("#title"),
         introduction = $("#introduction"),
         content = $('#summernote'),
         contentLay = $('.note-editor'),
         imageLay = $('.input-group')
    allFields = $([]).add(title).add(tags).add(introduction).add(content).add(imageLay).add(contentLay);

    allFields.removeClass("state-error");

    $("#title").val("");
    $("#introduction").val("");
    $("#imagepost").fileinput('reset');
    $("#taglist").val("");
    $("#tags > span").remove();
    $('.note-editable').html("");
    $('#imageUpload').html("");
    $("#id_newPost").val("");
    image = "";
    $('#load').html("");
}




