$(document).ready(function () {

    $('#AddPost').keypress(function (event) {
        if (event.keyCode == 10 || event.keyCode == 13)
            event.preventDefault();
    });




    $(".alert").hide();
});

$('#addtag').click(function adicionatag() {

    var tagname = $('#tagname').val();
    var arraytags = $('#taglist').val().split(",");

    if (tagname.length <= 0) {

        $('#tags').children(".error").remove();

        $('#tags').prepend("<span class='error'>Please, put a tag name.</span>");

    } else if (jQuery.inArray(jQuery("#tagname").val(), arraytags) == -1) {

        var tagstotal = $('#taglist').val();

        var tagblock = "<span class='label label-info' id='" + tagname + "'> <i class='glyphicon glyphicon-tag small'></i> " + tagname + " <span class='closetag'>×</span><span class='closetag sr-only'>Close</span></span>"
        $('#tags').append("" + tagblock + "");

        $('#taglist').val("" + tagname + "," + tagstotal + "");

        $('#tags').children(".error").remove();

        $('#tagname').val("");

    } else {

        $('#tags').prepend("<span class='error'>Duplicate tag.</span>");

        $('#tagname').val("");
    }

    $(".closetag").click(function () {

        var arraytags = $('#taglist').val().split(",");

        var removeItem = $(this).parent().attr('id');

        arraytags = jQuery.grep(arraytags, function (value) {

            return value != removeItem;

        });

        $('#taglist').val("" + arraytags + "");

        $(this).parent().remove();

    });

});

$('#tagname').bind('keydown', 'return', function adicionatag() {
    var tagname = $('#tagname').val();
    var arraytags = $('#taglist').val().split(",");
    console.log(tagname);

    if (tagname.length <= 0) {
        $('#tags').children(".error").remove();
        $('#tags').prepend("<span class='error'>Please, put a tag name.</span>");
    } else if (jQuery.inArray(jQuery("#tagname").val(), arraytags) == -1) {
        var tagstotal = $('#taglist').val();

        var tagblock = "<span class='label label-info' id='" + tagname + "'> <i class='glyphicon glyphicon-tag small'></i> " + tagname + " <span class='close'>×</span><span class='sr-only'>Close</span></span>"
        $('#tags').append("" + tagblock + "");

        $('#taglist').val("" + tagname + "," + tagstotal + "");

        $('#tags').children(".error").remove();

        $('#tagname').val("");

    } else {
        $('#tags').prepend("<span class='error'>Duplicate tag.</span>");
        $('#tagname').val("");
    }

    $(".close").click(function () {

        var arraytags = $('#taglist').val().split(",");

        var removeItem = $(this).parent().attr('id');

        arraytags = jQuery.grep(arraytags, function (value) {

            return value != removeItem;

        });

        $('#taglist').val("" + arraytags + "");

        $(this).parent().remove();

    });

});

String.prototype.padLeft = function (n, pad) {
    t = '';
    if (n > this.length) {
        for (i = 0; i < n - this.length; i++) {
            t += pad;
        }
    }
    return t + this;
}

String.prototype.padRight = function (n, pad) {
    t = this;
    if (n > this.length) {
        for (i = 0; i < n - this.length; i++) {
            t += pad;
        }
    }
    return t;

}

function formatJSONDate(jsonDate) {
    var date = new Date(parseInt(jsonDate.substr(6)));

    var mes = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    var newDate = date.getDate() + "/" + mes[date.getMonth()] + "/" + date.getFullYear();

    return newDate;
}

function closeModal() {
    $(".EventsModal").modal('hide');
}

function dialogconfirmation(msg, funcao, codigo) {

    bootbox.dialog({
        message: msg,
        title: "Frooty Panel Control",
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

function formatJSONDateAmerica(jsonDate) {
    var date = new Date(parseInt(jsonDate.substr(6)));

    var mes = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    var str = "" + date.getDate();
    var pad = "00";
    var day = pad.substring(0, pad.length - str.length) + str;

    var newDate = mes[date.getMonth()] + "/" + day + "/" + date.getFullYear();

    return newDate;
}

function formatJSONDateAmericaTime(jsonDate) {
    var date = new Date(parseInt(jsonDate.substr(6)));

    var mes = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    var str = "" + date.getDate();
    var pad = "00";
    var day = pad.substring(0, pad.length - str.length) + str;

    var Hours = new String(date.getHours());
    var Minutes = new String(date.getMinutes());

    var newDate = mes[date.getMonth()] + "/" + day + "/" + date.getFullYear() + " " + Hours.padLeft(2, '0') + "hr. " + Minutes.padLeft(2, '0') + "min.";

    return newDate;
}

function formatJSON(jsonDate) {
    var date = new Date(parseInt(jsonDate.substr(6)));
    return date;
}

function checkLength(o, n, min, max) {

    $(".alert").hide('slow');

    if (o.val().length > max || o.val().length < min) {
        o.addClass("state-error");
        $("#Pmsg").html(n);
        $(".alert").show('slow');
        return false;
    } else {
        return true;
    }
}

function comboBoxCheck(o, n) {

    $(".alert").hide('slow');

    if (o.val() == -1 || o.val() == "") {
        o.addClass("state-error");
        $("#Pmsg").html(n);
        $(".alert").show('slow');
        return false;
    } else {
        return true;
    }
}

function ContentLength(o, contentLay, n, min, max) {

    var valor = (o.code() == '<br>' ? 0 : o.code().length);

    $(".alert").hide('slow');

    if (valor > max || valor < min) {
        contentLay.addClass("state-error");
        $("#Pmsg").html(n);
        $(".alert").show('slow');
        return false;
    } else {
        return true;
    }
}

function imageLength(o, imageLay, n) {
    $(".alert").hide('slow');

    if (o == "") {
        imageLay.addClass("state-error");
        $("#Pmsg").html(n);
        $(".alert").show('slow');
        return false;
    } else {
        return true;
    }
}

function checkRegexp(o, regexp, n) {

    $(".alert").hide('slow');

    if (!(regexp.test(o.val()))) {
        o.addClass("state-error");
        $("#Pmsg").html(n);
        $(".alert").show('slow');
        return false;
    } else {
        return true;
    }
}

function comboBoxMaior(o, ma, n) {

    $(".alert").hide('slow');

    if (o.val() > ma) {
        o.addClass("state-error");
        $("#Pmsg").html(n);
        $(".alert").show('slow');
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
        $("#Pmsg").html(n);
        $(".alert").show('slow');
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

var specialChars = [
	{ val: "a", let: "áàãâä" },
	{ val: "e", let: "éèêë" },
	{ val: "i", let: "íìîï" },
	{ val: "o", let: "óòõôö" },
	{ val: "u", let: "úùûü" },
	{ val: "c", let: "ç" },
	{ val: "A", let: "ÁÀÃÂÄ" },
	{ val: "E", let: "ÉÈÊË" },
	{ val: "I", let: "ÍÌÎÏ" },
	{ val: "O", let: "ÓÒÕÔÖ" },
	{ val: "U", let: "ÚÙÛÜ" },
	{ val: "C", let: "Ç" },
	{ val: "", let: "@?!()+'=,,.;:$%&*/^~" }
];

/**
 * Função para substituir caractesres especiais.
 * @param {str} string
 * @return String
 */
function replaceSpecialChars(str) {
    var $spaceSymbol = '-';
    var regex;
    var returnString = str;
    for (var i = 0; i < specialChars.length; i++) {
        regex = new RegExp("[" + specialChars[i].let + "]", "g");
        returnString = returnString.replace(regex, specialChars[i].val);
        regex = null;
    }
    return returnString.replace(/\s/g, $spaceSymbol);
};
