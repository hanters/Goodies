var map;
var address = [];
var addressName = [];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var geocoder = new google.maps.Geocoder();
var UF = [];

$(document).ready(function () {

    ListAddress();
    initialize();

    //$("#txtEndereco").autocomplete({
    //    source: function (request, response) {
    //        geocoder.geocode({ 'address': request.term + ', United States', 'region': 'US' }, function (results, status) {
    //            response($.map(results, function (item) {
    //                return {
    //                    label: item.formatted_address,
    //                    value: item.formatted_address,
    //                    latitude: item.geometry.location.lat(),
    //                    longitude: item.geometry.location.lng()
    //                }
    //            }));
    //        })
    //    },
    //    select: function (event, ui) {

    //        initialize();

    //        // Start/Finish icons
    //        var icons = {
    //            start: new google.maps.MarkerImage(
    //             // URL
    //             'http://frootyacai.com/Content/Images/markerinitial.png',
    //             // (width,height)
    //             new google.maps.Size(45, 69),
    //             // The origin point (x,y)
    //             new google.maps.Point(0, 0),
    //             // The anchor point (x,y)
    //             new google.maps.Point(22, 69)
    //            ),
    //            end: new google.maps.MarkerImage(
    //             // URL
    //             'http://frootyacai.com/Content/Images/marker.png',
    //             // (width,height)
    //             new google.maps.Size(45, 69),
    //             // The origin point (x,y)
    //             new google.maps.Point(0, 0),
    //             // The anchor point (x,y)
    //             new google.maps.Point(22, 69)
    //            )
    //        };

    //        var total = 0;
    //        var contador = 0;

    //        for (var i = 0; i < address.length; i++) {

    //            var request = {
    //                origin: ui.item.value,
    //                destination: address[i],
    //                travelMode: google.maps.TravelMode.DRIVING
    //            };


    //            directionsService.route(request, function (result, status) {
    //                if (status == google.maps.DirectionsStatus.OK) {

    //                    if (total == 0) {
    //                        total = result.routes[0].legs[0].distance.value;
    //                        //directionsDisplay.setDirections(result); // traço


    //                        var leg = result.routes[0].legs[0];
    //                        makeMarker(leg.start_location, icons.start, result.request.origin);// <----
    //                        makeMarker(leg.end_location, icons.end, result.request.destination);// <----

    //                        contador++;
    //                    }
    //                    else {

    //                        if (total > result.routes[0].legs[0].distance.value) {
    //                            //initialize();

    //                            total = result.routes[0].legs[0].distance.value;
    //                            //directionsDisplay.setDirections(result); // traço


    //                            var leg = result.routes[0].legs[0];
    //                            makeMarker(leg.start_location, icons.start, result.request.origin);// <----
    //                            makeMarker(leg.end_location, icons.end, result.request.destination);// <----
    //                        }

    //                        else {

    //                            if (contador <= 5) {

    //                                var myLatlng = new google.maps.LatLng(result.routes[0].legs[0].end_location.k, result.routes[0].legs[0].end_location.B);

    //                                var infowindow = new google.maps.InfoWindow({ content: addressName[address.indexOf(result.request.destination)] });// <----

    //                                var marker = new google.maps.Marker({
    //                                    position: myLatlng,
    //                                    map: map,
    //                                    icon: 'http://frootyacai.com/Content/Images/marker.png',
    //                                    title: result.request.destination // <----
    //                                });

    //                                google.maps.event.addListener(marker, 'click', function () {
    //                                    infowindow.open(map, marker);
    //                                });

    //                                contador++;
    //                            }
    //                        }

    //                    }
    //                }
    //            });
    //        }
    //    }
    //}).keydown(function (e) {
    //    if (e.keyCode === 13) {
    //        e.preventDefault();
    //        findAcai();

    //    }
    //});

});

function ListAddress() {
    $.ajax({
        url: caminhoApp + '/Find/ListAddress',
        dataType: "json",
        type: "POST",
        success: function (data) {
            $(data.result).each(function () {
                address.push(this.address + ' - ' + this.city + ' - ' + this.state + ',' + this.zipCode);
                addressName.push('<div style="color: #000;"> <strong>' + this.name + " </strong> <br> " + this.address + ' - ' + this.city + ' - ' + this.state + ',' + this.zipCode + '</div>')
            });
        },
        error: function (error) {
        }
    });
}

function initialize() {

    directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

    var latlng = new google.maps.LatLng(36.8833, -98.0167);

    var options = {
        zoom: 4,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapa"), options);

    directionsDisplay.setMap(map);

}


function makeMarker(position, icon, Obj) {


    var marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: icon,
        title: Obj.NomeFantasia
    });

    google.maps.event.addListener(marker, 'click', function () {

        var content = '<div id="box-maps"><input type="hidden" name="dn" id="dn" value="' + Obj.id_location + '"><span class="seta"></span><h2>' + Obj.name + '</h2><p>' + Obj.address + '</p><p>' + Obj.city + ' - ' + Obj.state + '</p></div>';
        $(document).find('.infoBox').hide();
        var myOptions = {
            content: content
            , disableAutoPan: false
            , maxWidth: 500
            , pixelOffset: new google.maps.Size(-162, -10)
            , zIndex: null
            , boxStyle: {
                background: "none"
                , opacity: 1
                , width: "320px"
            }
            , closeBoxMargin: "20px 0 2px 2px"
            , closeBoxURL: "/Content/images/close.svg"
            , infoBoxClearance: new google.maps.Size(1, 1)
            , isHidden: false
            , pane: "floatPane"
            , enableEventPropagation: false

        };

        var ib = new InfoBox(myOptions);
        ib.open(map, marker);
        //infowindow.open(map, marker);
    });
}


function findAcai_() {
    initialize();
    UF = [];
    var state = "";
    var city = "";

    var latlng;

    var icons = {
        start: new google.maps.MarkerImage(
         // URL
         'http://frootyacai.com/Content/Images/markerinitial.png',
         // (width,height)
         new google.maps.Size(45, 69),
         // The origin point (x,y)
         new google.maps.Point(0, 0),
         // The anchor point (x,y)
         new google.maps.Point(22, 69)
        ),
        end: new google.maps.MarkerImage(
         // URL
         'http://frootyacai.com/Content/Images/marker.png',
         // (width,height)
         new google.maps.Size(45, 69),
         // The origin point (x,y)
         new google.maps.Point(0, 0),
         // The anchor point (x,y)
         new google.maps.Point(22, 69)
        )
    };


    $.ajax({
        url: 'http://maps.googleapis.com/maps/api/geocode/json',
        data: {
            sensor: false,
            address: $("#txtEndereco").val(),
        },

        type: 'GET',
        jsonpCallback: 'jsonCallback',
        success: function (data) {
            if (data.status == "OK") {

                switch (data.results.length) {

                    case 0:
                        dialogAlert("Not found.");
                        return false;
                        break;

                    case 1:

                        if (data.results[0].types[0] == "postal_code") {

                            switch (data.results[0].address_components.length) {
                                case 4:
                                    city = retira_acentos(data.results[0].address_components[1].long_name);
                                    state = data.results[0].address_components[2].short_name;
                                    break;

                                case 5:
                                    city = retira_acentos(data.results[0].address_components[1].long_name);
                                    state = data.results[0].address_components[3].short_name;
                                    break;

                                case 6:
                                    city = retira_acentos(data.results[0].address_components[2].long_name);
                                    state = data.results[0].address_components[4].short_name;
                                    break;

                                default:
                                    dialogAlert("Not found.");
                                    return false;
                                    break;
                            }

                            latlng = data.results[0].geometry.location;


                        } else {

                            switch (data.results[0].address_components.length) {
                                case 4:
                                    city = retira_acentos(data.results[0].address_components[0].long_name);
                                    state = data.results[0].address_components[2].short_name;
                                    break;

                                case 5:
                                    city = retira_acentos(data.results[0].address_components[0].long_name);
                                    state = data.results[0].address_components[2].short_name;
                                    break;

                                case 6:
                                    city = retira_acentos(data.results[0].address_components[0].long_name);
                                    state = data.results[0].address_components[4].short_name;
                                    break;

                                default:
                                    dialogAlert("Not found.");
                                    return false;
                                    break;
                            }

                            latlng = data.results[0].geometry.location;
                        }

                        break;

                    default:

                        var strCity = '<ul">';

                        for (var i = 0; i < data.results.length; i++) {

                            switch (data.results[i].address_components.length) {
                                case 4:
                                    strCity += '<li style="cursor:pointer" onclick="searchCity(\'' + retira_acentos(data.results[i].address_components[0].long_name) + '\', \'' + data.results[i].address_components[2].short_name + '\',\'' + data.results[i].geometry.location.lat + '\',\'' + data.results[i].geometry.location.lng + '\')">' + data.results[i].formatted_address + '</li>';
                                    break;

                                case 5:
                                    strCity += '<li style="cursor:pointer" onclick="searchCity(\'' + retira_acentos(data.results[i].address_components[1].long_name) + '\', \'' + data.results[i].address_components[3].short_name + '\',\'' + data.results[i].geometry.location.lat + '\',\'' + data.results[i].geometry.location.lng + '\')">' + data.results[i].formatted_address + '</li>';
                                    break;

                                case 6:
                                    strCity += '<li style="cursor:pointer" onclick="searchCity(\'' + retira_acentos(data.results[i].address_components[2].long_name) + '\', \'' + data.results[i].address_components[4].short_name + '\',\'' + data.results[i].geometry.location.lat + '\',\'' + data.results[i].geometry.location.lng + '\')">' + data.results[i].formatted_address + '</li>';
                                    break;
                            }
                        }

                        strCity += '</ul>';

                        dialogAlert("<h3>Select your city.</h3>\n" + strCity);
                        return false;

                        break;

                }

                $.ajax({
                    url: caminhoApp + '/Find/Address',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "POST",
                    data: JSON.stringify({ state: state, city: city }),
                    success: function (data) {

                        if (data.result.length > 0) {

                            directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

                            var options = {
                                zoom: 10,
                                center: latlng,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };

                            map = new google.maps.Map(document.getElementById("mapa"), options);

                            directionsDisplay.setMap(map);

                            $(data.result).each(function () {
                                var Obj = this;
                                var cont = 0;
                                $("#list ul").empty();

                                $.ajax({
                                    url: 'http://maps.googleapis.com/maps/api/geocode/json',
                                    data: {
                                        sensor: false,
                                        address: this.address + ", " + this.city + ", " + this.state,
                                    },
                                    type: 'GET',
                                    jsonpCallback: 'jsonCallback',
                                    success: function (data) {
                                        if (data.status == "OK") {
                                            makeMarker(data.results[0].geometry.location, icons.end, Obj);
                                            $("#list ul").append("<li class='bg-dark'><h3 class='pink'>" + Obj.name + "</h3><strong>" + Obj.address + "</strong><br><strong>" + Obj.city + " " + Obj.state + "</strong></li>");
                                        }
                                    }
                                });


                            });

                        } else {

                            dialogAlert("Not found.");
                            return false;
                        }


                    },
                    error: function (error) {

                        dialogAlert("Not found.");
                        return false;
                    }
                });
            } else {

                dialogAlert("Not found.");
                return false;
            }
        }
    });

    
}

function searchCity(city, state, lat, lng) {


    var icons = {
        start: new google.maps.MarkerImage(
         // URL
         'http://frootyacai.com/Content/Images/markerinitial.png',
         // (width,height)
         new google.maps.Size(45, 69),
         // The origin point (x,y)
         new google.maps.Point(0, 0),
         // The anchor point (x,y)
         new google.maps.Point(22, 69)
        ),
        end: new google.maps.MarkerImage(
         // URL
         'http://frootyacai.com/Content/Images/marker.png',
         // (width,height)
         new google.maps.Size(45, 69),
         // The origin point (x,y)
         new google.maps.Point(0, 0),
         // The anchor point (x,y)
         new google.maps.Point(22, 69)
        )
    };

    $.ajax({
        url: caminhoApp + '/Find/Address',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: "POST",
        data: JSON.stringify({ state: state, city: city }),
        success: function (data) {

            if (data.result.length > 0) {

                directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

                var latlng = new google.maps.LatLng(lat, lng);

                var options = {
                    zoom: 10,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(document.getElementById("mapa"), options);

                directionsDisplay.setMap(map);

                $(data.result).each(function () {
                    var Obj = this;
                    var cont = 0;
                    $("#list ul").empty();


                    $.ajax({
                        url: 'http://maps.googleapis.com/maps/api/geocode/json',
                        data: {
                            sensor: false,
                            address: this.address + ", " + this.city + ", " + this.state,
                        },
                        type: 'GET',
                        jsonpCallback: 'jsonCallback',
                        success: function (data) {
                            if (data.status == "OK") {
                                makeMarker(data.results[0].geometry.location, icons.end, Obj);
                                $("#list ul").append("<li class='bg-dark'><h3 class='pink'>" + Obj.name + "</h3><strong>" + Obj.address + "</strong><br><strong>" + Obj.city + " " + Obj.state + "</strong></li>");
                            }
                        }
                    });


                  
                });

                $(".bootbox").modal("hide");

            } else {
                $(".bootbox").modal("hide");
                dialogAlert("Not found.");
                return false;
            }


        },
        error: function (error) {

            dialogAlert("Not found.");
            return false;
        }
    });

}