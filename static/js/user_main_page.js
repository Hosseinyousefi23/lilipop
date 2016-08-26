var map;
var places;
var infoWindows = {};
var selectedTime = new Date().getTime();
var selectedMenuItem;
var selectedMenuDiv;
markers = [];
var mapClickMenuListener;
var drawPlace = {
    'container_gallery': function (position, place_id) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '/static/icons/map/container_gallery.png'
        });
        marker.place_type = 'container_gallery';
        marker.place_id = place_id;
        marker.tempIcon = marker.getIcon();
        markers.push(marker);
        addMarkerListeners(marker);
    },
    'mobile_media_unit': function (position, place_id) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '/static/icons/map/mobile_media_unit.png'
        });
        marker.place_id = place_id;
        marker.place_type = 'mobile_media_unit';
        marker.tempIcon = marker.getIcon();
        markers.push(marker);
        addMarkerListeners(marker);
        //var poly = new google.maps.Polyline({
        //    strokeColor: '#000000',
        //    strokeOpacity: 1.0,
        //    strokeWeight: 5
        //});
        //poly.setMap(map);
        //var path = poly.getPath();
        //for (var x = 0; x < event.spaceTimes.length; x++) {
        //    var curlat = parseFloat(event.spaceTimes[x].place.lat);
        //    var curlng = parseFloat(event.spaceTimes[x].place.lng);
        //    var latLng = new google.maps.LatLng(curlat, curlng);
        //    path.push(latLng);
        //}
    },
    'smart_furniture': function (position, place_id) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '/static/icons/map/smart_furniture.png'
        });
        marker.place_type = 'smart_furniture';
        marker.place_id = place_id;
        marker.tempIcon = marker.getIcon();
        markers.push(marker);
        addMarkerListeners(marker);
    }

};

function initMap() {
    var tehran = {lat: 35.715298, lng: 51.404343};
    map = new google.maps.Map(document.getElementById('map'), {
        center: tehran,
        zoom: 12,
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
            //{
            //    featureType: 'all',
            //    stylers: [
            //        //{hue: '#000000'},
            //        {saturation: -100}
            //        //{lightness: -100}
            //    ]
            //},
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    //{hue: '#000000'},
                    //{saturation: 0}
                    {lightness: -100}
                ]
            }, {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [
                    {visibility: 'off'}
                ]
            }, {
                featureType: 'all',
                elementType: 'labels.text',
                stylers: [
                    // rgb : 109 207 246
                    {hue: '#6DCFF6'}
                    //{saturation: 0},
                    //{lightness: -100}
                ]
            }, {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [
                    {hue: '#5CFF3F'},
                    {saturation: 100},
                    {lightness: 100}
                    // rgb : 92 255 63
                ]
            }
        ]
    });
    addTuicLogo();
    addProjectLogo();
    addMenuIcon();
    draw(null);
    addZoomListener();
}
function draw(time) {
    $.ajax({
        url: '/event/data?request=places',
        success: function (result) {
            places = JSON.parse(result['places']);
            console.log(places);
            for (var i = 0; i < places.length; i++) {
                var url = '/event/data?request=location&place=' + places[i].pk;
                if (time) {
                    url += '&time=' + time;
                }
                $.ajax({
                    url: url,
                    success: function (result) {
                        console.log(result);
                        var position = locationParse(result['location']);
                        var place_type = result['place_type'];
                        var place_id = parseInt(result['place_id']);
                        drawPlace[place_type](position, place_id);
                    }
                });
            }
        }
    })
}

function locationParse(string) {
    var data = string.split(',');
    return new google.maps.LatLng(parseFloat(data[0]), parseFloat(data[1]));
}

function addTuicLogo() {
    var controlUI = document.createElement('div');
    controlUI.style.marginTop = '50px';
    controlUI.style.marginLeft = '40px';
    var image = document.createElement('img');
    image.setAttribute('src', '/static/icons/map/tuic_logo.png');
    image.setAttribute('alt', 'TUIC logo');
    controlUI.appendChild(image);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(controlUI);
}

function addProjectLogo() {
    var controlUI = document.createElement('div');
    controlUI.style.marginTop = '15px';
    controlUI.style.marginLeft = '40px';
    var image = document.createElement('img');
    image.setAttribute('src', '/static/icons/map/project_logo.png');
    image.setAttribute('alt', 'TUIC logo');
    controlUI.appendChild(image);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(controlUI);
}
function addMenuIcon() {
    var menuIcon = document.createElement('img');
    menuIcon.style.marginRight = '25px';
    menuIcon.style.marginTop = '40px';
    menuIcon.style.width = '30px';
    menuIcon.style.cursor = 'pointer';
    menuIcon.setAttribute('src', '/static/icons/map/menu.png');
    menuIcon.setAttribute('onclick', 'openNav()');
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(menuIcon);
}
function addMarkerListeners(marker) {
    google.maps.event.addListener(marker, 'mouseover', function () {
        var place_id = this.place_id;
        if (place_id in infoWindows) {
            infoWindows[place_id].open(map, this);
        } else {
            var url = '/event/data?request=current_events&time=' + selectedTime + '&place=' + place_id;
            $.ajax({
                url: url,
                success: function (result) {
                    var event_obj = JSON.parse(result['events']);
                    var contentString;
                    if (event_obj.length > 0) {
                        contentString = '<div>'
                        + '<img src="/media/' + event_obj[0].fields.image + '" style="width: 300px; height: 300px; margin-left: 24px; display: block"/>'
                        + '<h2 style="width: 300px; text-align: center; margin-left: 24px; margin-top: 20px">' + event_obj[0].fields.title + '</h2>'
                        + '</div>'
                    } else {
                        contentString = '<h2>No event for now</h2>'
                    }
                    var infoWindow = new google.maps.InfoWindow({
                        content: contentString,
                        disableAutoPan: true,
                        maxWidth: 324
                    });
                    infoWindow.open(map, marker);
                    infoWindows[parseInt(result['place_id'])] = infoWindow;
                }
            });
        }
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
        infoWindows[marker.place_id].close()
    });
}

function addZoomListener() {
    map.addListener('zoom_changed', function () {
        if (map.getZoom() < 11) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setIcon('/static/icons/map/zoomout_place.png');
            }
        } else {
            for (var j = 0; j < markers.length; j++) {
                markers[j].setIcon(markers[j].tempIcon);
            }

        }

    });
}

function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
    mapClickMenuListener = map.addListener('click', closeNav);
}

function closeButton(event) {
    event.stopPropagation();
    closeNav();
}
/* Set the width of the side navigation to 0 */
function closeNav() {
    if (selectedMenuDiv) {
        deselectMenuItems();
        setTimeout(function () {
            document.getElementById("mySidenav").style.width = "0";
        }, 500);
    } else {
        document.getElementById("mySidenav").style.width = "0";
    }
    google.maps.event.removeListener(mapClickMenuListener);
    mapClickMenuListener = null;

}

function showReserve(event) {
    event.stopPropagation();
    var reserveLink = document.getElementById('reserve_link');
    if (selectedMenuItem) {
        selectedMenuItem.style.backgroundColor = 'transparent';
        selectedMenuItem.style.borderStyle = 'none';
        selectedMenuItem.style.borderBottom = 'solid #e1e1e1 2px';
        //selectedMenuItem.style.color = '#818181';
    }
    selectedMenuItem = reserveLink;
    reserveLink.style.backgroundColor = '#6DCFF6';
    reserveLink.style.borderStyle = 'inset';
    var reserveDiv = document.getElementById('reserve_div');
    if (selectedMenuDiv) {
        selectedMenuDiv.style.width = '0';
        selectedMenuDiv = reserveDiv;
        setTimeout(function () {
            reserveDiv.style.width = '600px';
        }, 500);
    } else {
        selectedMenuDiv = reserveDiv;
        reserveDiv.style.width = '600px';
    }

}

function showAboutUS(event) {
    event.stopPropagation();
    var aboutusLink = document.getElementById('aboutus_link');
    if (selectedMenuItem) {
        selectedMenuItem.style.backgroundColor = 'transparent';
        selectedMenuItem.style.borderStyle = 'none';
        selectedMenuItem.style.borderBottom = 'solid #e1e1e1 2px';
        //selectedMenuItem.style.color = '#818181';
    }
    selectedMenuItem = aboutusLink;
    aboutusLink.style.backgroundColor = '#6DCFF6';
    aboutusLink.style.borderStyle = 'inset';
    var aboutusDiv = document.getElementById('aboutus_div');
    if (selectedMenuDiv) {
        selectedMenuDiv.style.width = '0';
        selectedMenuDiv = aboutusDiv;
        setTimeout(function () {
            aboutusDiv.style.width = '400px';
        }, 500);
    } else {
        selectedMenuDiv = aboutusDiv;
        aboutusDiv.style.width = '400px';
    }


    //aboutusLink.style.color = '#000000';
}

function deselectMenuItems() {
    if (selectedMenuDiv) {
        selectedMenuDiv.style.width = '0';
    }
    if (selectedMenuItem) {
        selectedMenuItem.style.backgroundColor = 'transparent';
        selectedMenuItem.style.borderStyle = 'none';
        selectedMenuItem.style.borderBottom = 'solid #e1e1e1 2px'
    }
    selectedMenuDiv = null;
    selectedMenuItem = null;
}