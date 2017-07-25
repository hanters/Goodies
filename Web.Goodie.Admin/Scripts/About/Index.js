var url;

$(document).ready(function () {

    $('#summernote').summernote({
        height: 400,
        onImageUpload: function (files, editor, welEditable) {
            sendFile(files[0], editor, welEditable);
        }
    });

    $(".btn-warning").on('click', function () {
        $(".EventsModal").modal('show');
        url = "CadAbout";
        Clear();
    });


    $("#Draft").on('click', function () {
        About();
    });

    SelectAbout();

});

function SelectAbout() {

    $('#posts').dataTable().fnDestroy();

    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/About/SelectAbout',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_About + '</td>' +
                        '<td>' + this.aba + '</td>' +
                        '<td>' + this.title + '</td>' +
                        '<td align="center">' + (this.status == true ? "Enabled <span class='badge2 btn-success'>!</span></td>" : "Disabled <span class='badge2 btn-danger'>!</span></td>") +
                        '<td><a href="#"  onclick ="editNewsPost(' + this.id_About + ')"  class="btn btn-primary">Open <i class="fa fa-edit"></i></a></td>' +
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
        id_About: id
    };

    $.ajax({
        url: caminhoApp + '/About/EditAbout',
        dataType: "json",
        type: "POST",
        data: dados,
        success: function (data) {

            $(data.result).each(function() {
                $("#title").val(this.title);
                $("#id_About").val(this.id_About);
                $("#aba").val(this.aba);
                $('#summernote').code();
                $('.note-editable').html(this.text);
                $("#status").val((this.status == true ?  "1" : "0"));
            });
            
            $(".EventsModal").modal('show');
            url = "UpDateAbout";
        },
        error: function (error) {
        }
    });

}

function About() {

    var regex = /(<([^>]+)>)/ig
        , body = $("#summernote").code()
        , result = body.replace(regex, "");

    var dados = {

        id_About: $("#id_About").val(),
        aba: $("#aba").val(),
        title: $("#title").val(),
        text: $("#summernote").code(),
        status: ($("#status").val() == "1" ? true : false)
    };

    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/About/' + url,
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
                    SelectAbout();
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
        aba = $("#aba"),
        contentLay = $('.note-editor'),
        content = $('#summernote');

    var allFields = $([]).add(title).add(aba).add(content).add(contentLay);

    var bValid = true;

    allFields.removeClass("state-error");

    bValid = bValid && checkLength(aba, "Aba Field Required ", 1, 100);
    bValid = bValid && checkLength(title, "Title Field Required", 1, 100);
    bValid = bValid && ContentLength(content, contentLay, "Description Field Required ", 1, 10000);

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function sendFile(file, editor, welEditable) {
    var data = new FormData();
    data.append("file", file);
    $.ajax({
        data: data,
        type: "POST",
        url: caminhoApp + '/About/UploadFile',
        cache: false,
        contentType: false,
        processData: false,
        success: function (url) {
            editor.insertImage(welEditable, url.url);
        }
    });
}

function Clear() {
   
    var title = $("#title"),
       aba = $("#aba"),
       contentLay = $('.note-editor'),
       content = $('#summernote');

    var allFields = $([]).add(title).add(aba).add(content).add(contentLay);

    allFields.removeClass("state-error");

    $("#title").val("");
    $('.note-editable').html("");
    $("#aba").val("");
    $('#id_About').val("");
}

