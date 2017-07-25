$(document).ready(function () {


    $("#btn_entrar").on('click', function () {

        result = {
            email: $("#login").val(),
            password: $("#pass").val(),
        };

            $.ajax({
                url: caminhoApp + '/Login/Login',
                dataType: "json",
                type: "POST",
                data: dados = result,
                beforeSend: function () {
                    loadingOn();
                },
                success: function (data) {
                    if (data.success) {
                        window.location.href = caminhoApp + '/DashBoard';
                    }
                    else {
                        $("#Pmsg").html("User or password are incorrect");
                        $(".alert").show('slow');
                    }
                    loadingOff();
                },
                error: function (error) {
                    loadingOff();
                }

            });
    });
        
});