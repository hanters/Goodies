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
        url = "CadRecipes";
        Clear();
    });
    $("#menu-dashboard").removeClass("active");
    $("#menu-recipes").addClass("open");
    $("#menu-recipes-overview").addClass("active");
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

    SelectRecipes();

});

function initSimpleFileUpload() {
    'use strict';

    $('#imagepost').fileupload({
        url: caminhoApp + '/Recipes/UploadFile',
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
                           '<img  src="/Content/Images/Uploads/Recipes/' + image + '" class="file-preview-image" title="' + image + '" alt="">' +
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
                $('#imageUpload').hide("slow");
                $("#teste").html('<input id="imagepost" type="file" name="imagepost"  multiple=true>');
                $("#imagepost").fileinput({ 'showUpload': false });
                $("#imagepost").on('click', function (event, file, previewId) {
                    $('#imageUpload').hide("slow");
                    $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
                    image = "";
                });
                $('#load').html("");
                initSimpleFileUpload();
                $('#load').html("");
                alert(data.result.message);
            }
        },
        fail: function (event, data) {
            if (data.files[0].error) {
                alert(data.files[0].error);
            }
        }
    });
}

function SelectRecipes()
{
    $('#posts').dataTable().fnDestroy();
    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Recipes/SelectRecipes',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_recipes + '</td>' +
                        '<td>' + this.title + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + formatJSONDateAmerica(this.ts_user_cadm) + '</td>' +
                        '<td align="center">' + this.status + ' <span class="badge2 btn-danger">!</span></td>' +
                        '<td><a href="#"  onclick ="editRecipes(' + this.id_recipes + ')"  class="btn btn-primary">Open <i class="fa fa-edit"></i></a></td>' +
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

function editRecipes(id) {

    Clear();

    var dados = {
        id_recipes: id,
    };
    $.ajax({
        url: caminhoApp + '/Recipes/EditRecipes',
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
                $("#id_recipes").val(this.id_recipes);
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
                             '<img  src="/Content/Images/Uploads/Recipes/' + this.image + '" class="file-preview-image" title="' + this.image + '" alt="'+this.image+'">' +
                        '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="file-preview-status text-center text-success"></div>' +
                '</div>');
            });
            $('#imageUpload').show();
            $("#Inactive").show();
            $(".EventsModal").modal('show');
            url = "upDateRecipes";
        },
        error: function (error) {
        }
    });

}

function NewsPost()
{


    var dados = {

        id_recipes: $("#id_recipes").val(),
        title: $("#title").val(),
        tags: $("#taglist").val(),
        introduction: $("#introduction").val(),
        content: $('#summernote').code(),
        image: image,
        id_status: status,
        url :replaceSpecialChars($("#title").val()),
    };

    if(validateForm()){

        $.ajax({
            url: caminhoApp + '/Recipes/' + url,
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
                    SelectRecipes();
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

    bValid = bValid && checkLength(title, "Title Field  Required ", 1, 50);
    bValid = bValid && checkLength(introduction, "Introduction Field Required ", 1, 100);
    bValid = bValid && imageLength(image, imageLay, "Image Field Required ");
    bValid = bValid && ContentLength(content, contentLay, "Content Field Required ", 1, 10000);

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear() {
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






