$(document).ready(function () {

    $("#lnk-modal").on('click', function () {
        $("#recoveryform").hide();
        $("#TrocarSenhaForm").hide();
        $("#loginform").show();
        $("#lnk-modal").html("LOGIN");
        $("#LoginModal").modal("show");
    });

    $("#btn-login").on('click', function () {

        var email = $("#email"),
        password = $("#password"),
        allFields = $([]).add(email).add(password);

        var bValid = true;
        allFields.removeClass("state-error");

        bValid = bValid && checkLength(email, "E-mail Field Required", 1, 50);
        bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "invalid Email");
        bValid = bValid && checkLength(password, "Passoword Field Required", 1, 50);

        if (!bValid) {
            
            return false;
        }

        $.ajax({
            url: '/Goodie/Login',
            dataType: "json",
            data: { email: $("#email").val(), password: $("#password").val() },
            type: "POST",
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {

                if (data.success == 1) {
                    $("#LoginModal").modal("hide");
                    $("#password").val('');
                    $("#email").val('');

                    $("#controler").html('');              
                    $("#controler").html('<a href="#" id="btn-logout"><i class="glyphicon glyphicon-user" style="color: #6c6c6c;"></i> LOGOUT</a>');
                    $("#controler").addClass("li-login");
                    $("#btn-logout").on('click', function () {

                        dialogconfirmation("Do you really want Logout?", logout, "")
                    });

                //    $("#controler").html('');
                //    $("#controler").append('<a class="heavy85 partner" href="#" id="btn-logout"><i class="glyphicon glyphicon-user"></i> LOGOUT</a>');
                //    $("#get-quote").hide();
                //    $("#btn-checkout").show();
                //    //ListCartSicrono();
                //    ListCart();
                //    $("#btn-logout").on('click', function () {
                //        dialogconfirmation("Do you really want Logout?", logout, "")
                //    });
                //    $('#cart').dataTable().fnDestroy();
                //    $("#cart tbody").html("");
                //    if (reDados != null) {
                //        $.ajax({
                //            url: '/shop/addItens',
                //            dataType: "json",
                //            type: "POST",
                //            data: reDados,
                //            async: false,
                //            success: function (data) {
                //                if (data.success) {
                //                    $("input:text").val("");
                //                    reDados = null;
                //                    ListCart();
                //                }
                //                else {
                //                    if (data.error == "1") {
                //                        $("#LoginModal").modal("show");
                //                    } else {
                //                        dialogAlert(data.msg);
                //                    }
                //                }
                //            },
                //            error: function (error) {

                //            }
                //        });
                //    }

                } else {
                //    if (data.success == 2) {
                //        $("#password_").val($("#password").val());
                //        $("#loginform").hide();
                //        $("#TrocarSenhaForm").show();
                //        $("#recoveryform").hide();
                //        $(".modal.frootystyle .modal-header h4").html("Change Password");
                //    } else {

                //        loadingOff();
                //        dialogAlert(data.msg);

                //    }
                }

            
                loadingOff();
            },
            error: function (error) {
                loadingOff();
            }
        });
    });

    $("#btn-logout").on('click', function () {

        dialogconfirmation("Do you really want Logout?", logout, "")     
    });

    $("#btn-change").on('click', function () {

        var password = $("#password_"),
            Newpassword = $("#Newpassword"),
            confNewpassword = $("#confNewpassword"),


        allFields = $([]).add(password).add(Newpassword).add(confNewpassword);

        var bValid = true;
        allFields.removeClass("state-error");

        bValid = bValid && checkLength(password, "Password Field Required", 1, 50);
        bValid = bValid && checkLength(Newpassword, "New Password Field Required", 1, 50);
        bValid = bValid && checkLength(confNewpassword, "Verifying new Password", 1, 50);

        if (!bValid) {
            
            return false;
        }

        $.ajax({
            url: '/Goodie/changePassword',
            dataType: "json",
            data: { email: $("#email").val(), password: $("#password_").val(),newPassword : $("#Newpassword").val(), confPassword : $("#confNewpassword").val()  },
            type: "POST",
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {

                if (data.success == 1) {
                    $("#LoginModal").modal("hide");
                    $("#password").val('');
                    $("#email").val('');
                    $("#Newpassword").val('');
                    $("#confNewpassword").val('');
                    $("#controler").html('');
                    $("#controler").append('<a class="heavy85 partner" href="#" id="btn-logout"><i class="glyphicon glyphicon-user"></i> LOGOUT</a>');
                    $("#btn-checkout").show();
                    //ListCartSicrono();
                    ListCart();
                    $("#btn-logout").on('click', function () {
                        dialogconfirmation("Do you really want Logout?", logout, "")
                    });
                    if (reDados != null) {
                        $.ajax({
                            url: '/shop/addItens',
                            dataType: "json",
                            type: "POST",
                            data: reDados,
                            async: false,
                            success: function (data) {
                                if (data.success) {
                                    $("input:text").val("");
                                    reDados = null;
                                    ListCart();
                                }
                                else {
                                    if (data.error == "1") {
                                        $("#LoginModal").modal("show");
                                    } else {
                                        dialogAlert(data.msg);
                                    }
                                }
                            },
                            error: function (error) {

                            }
                        });
                    }

                } else {
                    if (data.success == 2) {
                        $("#password_").val($("#password").val());
                        $("#loginform").hide();
                        $("#TrocarSenhaForm").show();
                        $("#recoveryform").hide();
                        $(".modal.frootystyle .modal-header h4").html("Change Password");
                    } else {

                        loadingOff();
                        dialogAlert(data.msg);

                    }
                }

            
                loadingOff();
            },
            error: function (error) {
                loadingOff();
            }
        });

    });

    $("#btn_reenvio").on('click', function () {
        if ($("#sendEmail").val() == "") {
            dialogAlert('E-mail Field Required!');
            return false;
        }

        $.ajax({
            url: '/Goodie/ForgotPassword',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            data: JSON.stringify({ email: $("#sendEmail").val() }),
            beforeSend: function () {
                loadingOn();
            },
            success: function (data) {
                if (data.success == true) {
                    $("#recoveryform").hide();
                    $("#loginform").show();
                    $(".modal.frootystyle .modal-header h4").html("LOGIN");
                    $("#email").val($("#sendEmail").val());
                    $("#sendEmail").val("");
                    loadingOff();
                    dialogAlert(data.msg);
                } else {
                    loadingOff();
                    dialogAlert(data.msg);
                }
            }
        });


    });

});

function logout(obj) {

    $.ajax({
        url: '/Goodie/logout',
        dataType: "json",
        type: "POST",
        beforeSend: function () {
            loadingOn();
        },
        success: function (data) {

            if (data.success) {

                $("#controler").html('');
                //$("#get-quote").show();
                //$("#get-quote").html('<li id="get-quote"><a class="heavy85 partner" href="/Partner"><i class="fa fa-star"></i> GET A QUOTE</a></li>');
                $("#controler").html('<span><i class="glyphicon glyphicon-user" style="cursor:pointer"></i></span>  <span id="lnk-modal" style="cursor:pointer"> LOGIN </span>');
                $("#controler").addClass("li-login");
                $("#lnk-modal").on('click', function () {
                    $("#recoveryform").hide();
                    $("#TrocarSenhaForm").hide();
                    $("#loginform").show();
                    $("#lnk-modal").html("LOGIN");
                    $("#LoginModal").modal("show");
                });
                //$("#btn-checkout").removeAttr("style");
                //$("#btn-checkout").hide();
                //$(".label-success").html("0 itens");
            } else {

                dialogAlert(data.msg)
            }

            loadingOff();
        },
        error: function (error) {
            loadingOff();
        }
    });
}