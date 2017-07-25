var image, image2;
var jqXHRData;
var url;

$(document).ready(function () {

   
    $("#menu-dashboard").removeClass("active");
    $("#menu-brands").addClass("open");


    $("#imagepost_logo").fileinput({ 'showUpload': false });
    $("#imagepost_logo").on('click', function (event, file, previewId) {
        $('#imageUpload').hide("slow");
        $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
        image = "";
    });

    $("#imagepost_poster").fileinput({ 'showUpload': false });
    $("#imagepost_poster").on('click', function (event, file, previewId) {
        $('#imageUpload').hide("slow");
        $('#load2').html('<img  src="/Content/Images/loading.gif"> Please wait....');
        image2 = "";
    });

 
    $(".btn-warning").on('click', function () {
        $(".EventsModal").modal('show');
        url = "CadBrands";
        Clear();
    });

    $("#Draft").on('click', function () {
        NewsPost();
    });

    initSimpleFileUploadLogoTipo();

    initSimpleFileUploadPoster();

  
    SelectBrands();

});

function initSimpleFileUploadLogoTipo() {
    'use strict';

    $('#imagepost_logo').fileupload({
        url: caminhoApp + '/Brands/UploadFileLogoTipo',
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
                           '<img  src="/Content/Images/Uploads/Brands/Logo/' + image + '" class="file-preview-image" title="' + image + '" alt="">' +
                      '</div>' +
                  '</div>' +
                  '<div class="clearfix"></div>' +
                  '<div class="file-preview-status text-center text-success"></div>' +
              '</div>');
                $('#imageUpload').show("slow");
                $("#teste").html('<input id="imagepost_logo" type="file" name="imagepost_logo"  multiple=true>');
                $("#imagepost_logo").fileinput({ 'showUpload': false });
                $("#imagepost_logo").on('click', function (event, file, previewId) {
                    $('#imageUpload').hide("slow");
                    $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
                    image = "";
                });
                $('#load').html("");
                initSimpleFileUploadLogoTipo();
            }
            else {
                $('#imageUpload').hide("slow");
                $("#teste").html('<input id="imagepost" type="file" name="imagepost"  multiple=true>');
                $("#imagepost_logo").fileinput({ 'showUpload': false });
                $("#imagepost_logo").on('click', function (event, file, previewId) {
                    $('#imageUpload').hide("slow");
                    $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
                    image = "";
                });
                $('#load').html("");
                initSimpleFileUploadLogoTipo();
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

function initSimpleFileUploadPoster() {
    'use strict';

    $('#imagepost_poster').fileupload({
        url: caminhoApp + '/Brands/UploadFilePoster',
        dataType: 'json',
        add: function (e, data) {
            jqXHRData = data.submit();
        },
        done: function (event, data) {
            if (data.result.isUploaded) {
                image2 = data.result.message;
                $("#teste1").html("");
                $('#imageUpload1').html('<div class="file-preview edit">' +
                 '<div class="close fileinput-remove text-right"></div>' +
                  '<div class="file-preview-thumbnails">' +
                      '<div class="file-preview-frame" id="preview-1409928123859-0">' +
                           '<img  src="/Content/Images/Uploads/Brands/Poster/' + image2 + '" class="file-preview-image" title="' + image2 + '" alt="">' +
                      '</div>' +
                  '</div>' +
                  '<div class="clearfix"></div>' +
                  '<div class="file-preview-status text-center text-success"></div>' +
              '</div>');
                $('#imageUpload').show("slow");
                $("#teste1").html('<input id="imagepost_poster" type="file" name="imagepost_poster"  multiple=true>');
                $("#imagepost_poster").fileinput({ 'showUpload': false });
                $("#imagepost_poster").on('click', function (event, file, previewId) {
                    $('#imageUpload').hide("slow");
                    $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
                    image2 = "";
                });
                $('#load').html("");
                initSimpleFileUploadPoster();
            }
            else {
                $('#imageUpload1').hide("slow");
                $("#teste1").html('<input id="imagepost" type="file" name="imagepost"  multiple=true>');
                $("#imagepost_poster").fileinput({ 'showUpload': false });
                $("#imagepost_poster").on('click', function (event, file, previewId) {
                    $('#imageUpload').hide("slow");
                    $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
                    image2 = "";
                });
                $('#load').html("");
                initSimpleFileUploadPoster();
                $('#load').html("");
                alert(data.result.message);
            }
        },
        fail: function (event, data) {
            if (data.files[0].error) {
                alert(data.files[0].error);
            }
            $('#imageUpload1').hide("slow");
            $("#teste1").html('<input id="imagepost" type="file" name="imagepost"  multiple=true>');
            $("#imagepost_poster").fileinput({ 'showUpload': false });
            $("#imagepost_poster").on('click', function (event, file, previewId) {
                $('#imageUpload').hide("slow");
                $('#load').html('<img  src="/Content/Images/loading.gif"> Please wait....');
                image2 = "";
            });
            $('#load').html("");
            initSimpleFileUploadPoster();
            $('#load').html("");
            alert(data.result.message);
        }
    });
}

function SelectBrands() {

    $('#posts').dataTable().fnDestroy();
    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Brands/SelectBrands',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_brands + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + this.description + '</td>' +
                        '<td align="center">' + (this.fl_active == "1" ? "Enabled <span class='badge2 btn-success'>!</span></td>" : "Disabled <span class='badge2 btn-danger'>!</span></td>") +
                        '<td><a href="#"  onclick ="editBrands(' + this.id_brands + ')"  class="btn btn-primary">Open <i class="fa fa-edit"></i></a></td>' +
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
}

function editBrands(id) {

    Clear();

    var dados = {
        id_brands: id,
    };
    $.ajax({
        url: caminhoApp + '/Brands/EditBrands',
        dataType: "json",
        type: "POST",
        data: dados,
        success: function (data) {
            $(data.result).each(function () {
                $("#id_brands").val(id);
                $("#name").val(this.name);
                $("#description").val(this.description);
                $("#fl_active").val(this.fl_active);
                image = (this.LogoTipoImgUrl == null ? "" : this.LogoTipoImgUrl);
                image2 = (this.PosterImgUrl == null ? "" : this.PosterImgUrl);

                $('#imageUpload').html('<div class="file-preview edit">' +
                   '<div class="close fileinput-remove text-right"></div>' +
                    '<div class="file-preview-thumbnails">' +
                        '<div class="file-preview-frame" id="preview-1409928123859-0">' +
                             '<img  src="/Content/Images/Uploads/Brands/Logo/' + image + '" class="file-preview-image" title="' + image + '" alt="' + image + '">' +
                        '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="file-preview-status text-center text-success"></div>' +
                '</div>');

                $('#imageUpload1').html('<div class="file-preview edit">' +
                   '<div class="close fileinput-remove text-right"></div>' +
                    '<div class="file-preview-thumbnails">' +
                        '<div class="file-preview-frame" id="preview-1409928123859-0">' +
                             '<img  src="/Content/Images/Uploads/Brands/Poster/' + image2 + '" class="file-preview-image" title="' + image2 + '" alt="' + image2 + '">' +
                        '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="file-preview-status text-center text-success"></div>' +
                '</div>');
            });
            $('#imageUpload').show();
            $('#imageUpload1').show();
            $(".EventsModal").modal('show');
            url = "UpDateBrands";
        },
        error: function (error) {
        }
    });

}

function validateForm() {

    var name = $("#name"),
        description = $("#description"),
        fl_active = $("#fl_active"),
 
    allFields = $([]).add(name).add(description).add(fl_active);

    var bValid = true;

    allFields.removeClass("state-error");

    bValid = bValid && checkLength(name, "Name Field  Required ", 1, 100);
    bValid = bValid && checkLength(description, "Description Field Required ", 1, 250);
    bValid = bValid && checkLength(fl_active, "Status Field Required ", 1, 10);


    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function NewsPost() {

    var dados = {

        id_brands:$("#id_brands").val(),
        name: $("#name").val(),
        description: $("#description").val(),
        fl_active: $("#fl_active").val(),
        LogoTipoImgUrl: image,
        PosterImgUrl : image2,
        
    };

    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/Brands/' + url,
            dataType: "json",
            type: "POST",
            data: dados,
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success) {

                    $(".EventsModal").modal('hide');
                    $('#imagepost_logo').fileinput('clear');
                    $('#imagepost_poster').fileinput('clear');
                    Clear();
                    SelectBrands();
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

function Clear() {

    $('.alert').hide('slow');

    image = "";
    image2 = "";
    $('#imageUpload').html("");
    $('#imageUpload1').html('');
    $("#name").val("");
    $("#description").val("");
    $("#fl_active").val("");

    var name = $("#name"),
        description = $("#description"),
        fl_active = $("#fl_active"),

    allFields = $([]).add(name).add(description).add(fl_active);

    allFields.removeClass("state-error");
}