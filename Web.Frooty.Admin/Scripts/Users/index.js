
var url;

$(document).ready(function () {

    $("#menu-dashboard").removeClass("active");
    $("#menu-users").addClass("open");
    

    $(".btn-warning").on('click', function () {
        $(".EventsModal").modal('show');
        $("#divAtive").hide();
        url = "CadUsers";
        Clear();
    });
   
    $("#Published").on('click', function () {
        NewsPost();
    });

    SelectUsers();

});

function SelectUsers() {

    $('#posts').dataTable().fnDestroy();
    $('#posts tbody').html("");

    $.ajax({
        url: caminhoApp + '/Users/SelectUsers',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {

                $('#posts tbody').append(
                    '<tr>' +
                        '<td>' + this.id_login + '</td>' +
                        '<td>' + this.name + '</td>' +
                        '<td>' + this.email + '</td>' +
                        '<td>' + this.typeUser + '</td>' +
                        '<td>' + (this.active == true ? "Active" : "Inactive" )+ '</span></td>' +
                        '<td><a href="#"  onclick ="editUsers(' + this.id_login + ')"  class="btn btn-primary">Open <i class="fa fa-edit"></i></a></td>' +
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

function editUsers(id) {

    Clear();

    var dados = {
        id_login: id,
    };
    $.ajax({
        url: caminhoApp + '/Users/editUsers',
        dataType: "json",
        type: "POST",
        data: dados,
        success: function (data) {
            $(data.result).each(function () {
                $("#id_login").val(this.id_login);
                $("#name").val(this.name);
                $("#email").val(this.email);
                $("#typeUser").val(this.id_typeUser);
                (this.active == true ? $("#active_yes").prop('checked', true) : $("#active_no").prop('checked', true));
            });
            
            $(".EventsModal").modal('show');
            $("#divAtive").show();
            url = "upDateUsers";
        },
        error: function (error) {
        }
    });

}

function NewsPost() {

    var dados = {
        id_login: $("#id_login").val(),
        name: $("#name").val(),
        email: $("#email").val(),
        id_typeUser: $('#typeUser').val(),
        password: $('#password').val(),
        active: ($("#active_yes").is(":checked") == true ? true : false),
    };

    if (validateForm()) {

        $.ajax({
            url: caminhoApp + '/Users/' + url,
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
                    SelectUsers();
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
         email = $("#email"),
         typeUser = $('#typeUser'),
         password = $('#password'),
    allFields = $([]).add(name).add(email).add(typeUser).add(password);

    var bValid = true;

    allFields.removeClass("state-error");

    bValid = bValid && checkLength(name, "Name Field  Required ", 1, 50);
    bValid = bValid && checkLength(email, "E-mail Field Required ", 1, 100);
    bValid = bValid && checkLength(typeUser, "Type User Field Required ", 1, 100);
    bValid = bValid && checkLength(password, "Password Field Required ", 1, 100);

    if (bValid) {
        return true;
    }
    else {
        return false;
    }
}

function Clear() {

    $(".alert").hide('slow');
    var name = $("#name"),
         email = $("#email"),
         typeUser = $('#typeUser'),
         password = $('#password'),
    allFields = $([]).add(name).add(email).add(typeUser).add(password);
    allFields.removeClass("state-error");
    $("#AddPost")[0].reset();

}