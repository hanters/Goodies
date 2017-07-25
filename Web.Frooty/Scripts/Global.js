
function ListCart() {
    $('#cart').dataTable().fnDestroy();
    $("#cart tbody").html("");
    $.ajax({
        url: '/shop/ListCart',
        dataType: "json",
        type: "POST",
        success: function (data) {
            var total = 0;
            $("#cart tbody").html("");
            $(data.Result).each(function () {
                $("#hdn-price").val(this.price.toFixed(2));
                $("#hdn-price").maskMoney('mask');
                $("#hdn-total-iten").val(this.total.toFixed(2));
                $("#hdn-total-iten").maskMoney('mask');
                $("#cart tbody").append(
                    '<tr>' +
                        '<td>' + this.name + " " + this.weight + ' oz ' + this.flavour + '</td>' +
                        '<td>' + this.amount + '</td>' +
                        '<td>' + $("#hdn-price").val() + '</td>' +
                        '<td>' + $("#hdn-total-iten").val() + '</td>' +
                        '<td><a href="#" onclick ="RemoveListCart(' + this.id_itens + ')" class="btn btn-xs btn-success"><i class="fa fa-edit"></i> Remove</a></td>' +
                    '</tr>'
                );

                total = total + this.total;
            });

            $("#hdn-total").val(total.toFixed(2));
            $("#hdn-total").maskMoney('mask');
            $("#lbl-total").html((total <= 0 ? 0 : $("#hdn-total").val()));

            $(".label-success").html(data.total + " itens")


            if (data.total > 0) {
                $("#btn-pay").removeAttr("disabled")
            } else {
                $("#btn-pay").attr("disabled", "disabled")
            }


            $('#cart').dataTable({
                "responsive": true,
                "lengthChange": false,
                "info":     false,
                "bPaginate": false,
                "searching": true,

            });
        },
        error: function (error) {
        }
    });

}

function formatJSONDate(jsonDate) {
    var date = new Date(parseInt(jsonDate.substr(6)));

    var mes = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
     
    var newDate = mes[date.getMonth()] + "/" + date.getDate() + "/" + date.getFullYear()  + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() ;

    return newDate;
}

function dialogAlert(msg) {

    //bootbox.alert(msg, function () {
    //});

    bootbox.dialog({
        title: "Frooty Açai - #1 in Brazil",
        message: msg,
        buttons: {
            main: {
                label: "OK",
                className: "btn-primary",
                callback: function () {
                    $(".bootbox").modal("hide");
                    return false;
                }
            }
        }
    });
}

function dialogconfirmation(msg, funcao, codigo) {

    bootbox.dialog({
        message: msg,
        title: "Frooty Açai - #1 in Brazil",
        buttons: {
            danger: {
                label: "NO",
                className: "btn-default",
                callback: function () {

                    $(".bootbox").modal("hide");
                    return false;
                }
            },
            main: {
                label: "YES",
                className: "btn-primary",
                callback: function () {
                    funcao(codigo);
                }
            }
        }
    });
}

function dialogconfirmationOK(msg, funcao) {

    bootbox.dialog({
        message: msg,
        title: "Frooty Açai - #1 in Brazil",
        buttons: {
            main: {
                label: "YES",
                className: "btn-primary",
                callback: function () {
                    funcao();
                }
            }
        }
    });
}

function checkLength(o, n, min, max) {

    if (o.val().length > max || o.val().length < min) {
        o.addClass("state-error");
        return false;
    } else {
        return true;
    }
}

function comboBoxCheck(o, n) {

    if (o.val() == -1 || o.val() == "") {
        o.addClass("state-error");
        return false;
    } else {
        return true;
    }
}

function ContentLength(o, contentLay, n, min, max) {

    var valor = (o.code() == '<br>' ? 0 : o.code().length);

    if (valor > max || valor < min) {
        contentLay.addClass("state-error");
        return false;
    } else {
        return true;
    }
}

function imageLength(o, imageLay, n) {
   
    if (o == "") {
        imageLay.addClass("state-error");
        return false;
    } else {
        return true;
    }
}

function checkRegexp(o, regexp, n) {

    if (!(regexp.test(o.val()))) {
        o.addClass("state-error");
        return false;
    } else {
        return true;
    }
}

function comboBoxMaior(o, ma, n) {

    if (o.val() > ma) {
        o.addClass("state-error");
        return false;
    } else {
        return true;
    }
}

function comperpassawor(a,o,n)
{
    if(a.val() != o.val())
    {
        o.addClass("state-error");
        return false;
    } else {
        return true;
    }
}

function loading() {

    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    //$('#masks').css({ 'width': maskWidth, 'height': maskHeight });

    $('#masks').fadeIn(0);
    $('#masks').fadeTo("slow", 0.8);

    //Get the window height and width
    var winH = $(window).height();
    var winW = $(window).width();

    $("#load").css('top', winH / 2 - $("#load").height() / 2);
    $("#load").css('left', winW / 2 - $("#load").width() / 2);

    $("#load").fadeIn(1000);
}

function loadingOn() {
    loading();
    $('#boxes').show();
}

function loadingOff() {
    $('#boxes').hide();
}

function retira_acentos(palavra) {
    com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
    sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
    nova='';
    for(i=0;i<palavra.length;i++) {
        if (com_acento.search(palavra.substr(i,1))>=0) {
            nova+=sem_acento.substr(com_acento.search(palavra.substr(i,1)),1);
        }
        else {
            nova+=palavra.substr(i,1);
        }
    }
    return nova;
}