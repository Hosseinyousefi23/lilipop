var map;
var app;
var infoWindows = {};
var currentInfoWindow;
var selectedTime = new Date().getTime();
var currentEventDivMarker = null;
var markers = [];
var paths = [];
var zones = [];
var showMarkers = true;
var clearButton;
var mapClickMenuListener;
var embeddedList = [];
var currentMarker = null;
var currentFurniture = null;
var locations = [];
var listeners = [];
var polygonComplete = false;
var polygonMouseClickListener;
var polygonMouseMoveListener;
var polygonRightClickListener;
var currentEventDivIndex;
var mapMouseMoveListener;
var events;
var opacity;
var aboutUsSlideIndex = 1;
var triangle_tops = ['90px', '159px', '229px', '300px'];
var currentPolygon;
var menu = new Menu();
var selectedMapUI = 'disable';
var mapUI = {

    // should be renamed if place type names in server database renamed
    'disable': function () {
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setMap(null);
        }
        for (var j = 0; j < listeners.length; j++) {
            google.maps.event.removeListener(listeners[j])
        }
        removeDoneAndCancelButton();
        listeners = [];
        locations = [];
        map.setOptions({draggableCursor: null});
        if (currentMarker) {
            currentMarker.setMap(null);
            currentMarker = null;
        }
        if (currentPolygon) {
            currentPolygon.setMap(null);
            currentPolygon = null;
        }
        if (currentFurniture) {
            currentFurniture.setOptions({icon: '/static/icons/map/smart_furniture_deselected.png'});
            currentFurniture = null;
        }
        for (var k = 0; k < markers.length; k++) {
            markers[k].setMap(map);
        }
        removeClearButton();
        showMarkers = true;
    },
    'container_gallery': function () {
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setMap(null);
        }
        for (var j = 0; j < listeners.length; j++) {
            google.maps.event.removeListener(listeners[j]);
        }
        removeDoneButton();
        listeners = [];
        locations = [];
        map.setOptions({draggableCursor: 'crosshair'});
        if (currentMarker) {
            currentMarker.setMap(null);
            currentMarker = null;
        }
        if (currentPolygon) {
            currentPolygon.setMap(null);
            currentPolygon = null;
        }
        if (currentFurniture) {
            currentFurniture.setOptions({icon: '/static/icons/map/smart_furniture_deselected.png'});
            currentFurniture = null;
        }
        var listener = map.addListener('click', function (event) {
            if (currentMarker) {
                currentMarker.setMap(null);
            }
            currentMarker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                draggable: true,
                icon: '/static/icons/map/container_gallery.png'
            });
            locations = [{lat: event.latLng.lat(), lng: event.latLng.lng()}];
            showDoneButton();
        });
        listeners.push(listener);

    },
    'mobile_media_unit': function () {
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setMap(null);
        }
        for (var j = 0; j < listeners.length; j++) {
            google.maps.event.removeListener(listeners[j])
        }
        removeDoneButton();
        listeners = [];
        locations = [];
        map.setOptions({draggableCursor: 'crosshair'});
        if (currentMarker) {
            currentMarker.setMap(null);
            currentMarker = null;
        }
        if (currentPolygon) {
            currentPolygon.setMap(null);
            currentPolygon = null;
        }
        if (currentFurniture) {
            currentFurniture.setOptions({icon: '/static/icons/map/smart_furniture_deselected.png'});
            currentFurniture = null;
        }
        var listener1 = map.addListener('click', function (event) {
            if (!currentPolygon) {
                showClearButton();
                currentPolygon = new google.maps.Polygon({
                    strokeColor: '#075572', //rgb: 43 187 242
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#0C92C5',
                    fillOpacity: 0.35,
                    editable: true
                });
                currentPolygon.setMap(map);
                currentPolygon.getPath().push(event.latLng);
                currentPolygon.getPath().push(event.latLng);
                polygonMouseClickListener = google.maps.event.addListener(currentPolygon, 'click', function (e) {
                    if (e.vertex == undefined || e.vertex != currentPolygon.getPath().getLength() - 1 || polygonComplete) {
                        return null;
                    }
                    currentPolygon.getPath().push(currentPolygon.getPath().getAt(e.vertex));
                });
                polygonMouseMoveListener = google.maps.event.addListener(currentPolygon, 'mousemove', function (e) {
                    currentPolygon.getPath().setAt(currentPolygon.getPath().length - 1, e.latLng);
                });
                polygonRightClickListener = google.maps.event.addListener(currentPolygon, 'rightclick', function (e) {
                    if (currentPolygon.getPath().length >= 4) {
                        currentPolygon.getPath().removeAt(currentPolygon.getPath().getLength() - 1);
                        google.maps.event.removeListener(polygonMouseClickListener);
                        google.maps.event.removeListener(polygonMouseMoveListener);
                        google.maps.event.removeListener(mapMouseMoveListener);
                        google.maps.event.removeListener(polygonRightClickListener);
                        startDeleteMenu();
                        polygonMouseClickListener = null;
                        polygonMouseMoveListener = null;
                        mapMouseMoveListener = null;
                        polygonRightClickListener = null;
                        showDoneButton();
                    }
                });
                mapMouseMoveListener = map.addListener('mousemove', function (event) {
                    var path = currentPolygon.getPath();
                    path.setAt(path.length - 1, event.latLng);
                });

                listeners.push(mapMouseMoveListener);
            }

        });
        listeners.push(listener1);

    },
    'smart_furniture': function () {
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setOptions({map: map});
        }
        for (var j = 0; j < listeners.length; j++) {
            google.maps.event.removeListener(listeners[j])
        }
        removeDoneButton();
        listeners = [];
        locations = [];
        map.setOptions({draggableCursor: null});
        if (currentMarker) {
            currentMarker.setMap(null);
            currentMarker = null;
        }
        if (currentPolygon) {
            currentPolygon.setMap(null);
            currentPolygon = null;
        }
        if (currentFurniture) {
            currentFurniture.setOptions({icon: '/static/icons/map/smart_furniture_deselected.png'});
            currentFurniture = null;
        }
        for (var l = 0; l < embeddedList.length; l++) {
            google.maps.event.addListener(embeddedList[l], 'click', function () {
                if (currentFurniture == this) {
                    return;
                }
                if (currentFurniture) {
                    currentFurniture.setOptions({
                        icon: '/static/icons/map/smart_furniture_deselected.png'
                    });
                }
                currentFurniture = this;
                locations = [{lat: this.position.lat(), lng: this.position.lng()}];
                this.setOptions({
                    icon: '/static/icons/map/smart_furniture.png'
                });
                showDoneButton();
            });
        }
    }
};
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
var drawPath = function (location_set) {
    var carGPSCoordinates = [];
    for (var i = 0; i < location_set.length; i++) {
        var latitudeLongitude = location_set[i].fields.position.split(',');
        carGPSCoordinates.push({lat: parseFloat(latitudeLongitude[0]), lng: parseFloat(latitudeLongitude[1])});
    }
    var lineSymbol = {
        path: 'M 0,0 0,0',
        strokeOpacity: 1,
        scale: 13
    };
    var carPath = new google.maps.Polyline({
        path: carGPSCoordinates,
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '15px'
        }],
        geodesic: true,
        strokeColor: '#6DCFF6'
    });
    carPath.setMap(map);
    paths.push(carPath);
};
function Menu() {
    var menu = this;
    menu.icons = {
        'container_gallery': {
            'deselect': '/static/icons/menu/container_gallery.png',
            'select': '/static/icons/menu/container_gallery_selected.png'
        },
        'mobile_media_unit': {
            'deselect': '/static/icons/menu/mobile_media_unit.png',
            'select': '/static/icons/menu/mobile_media_unit_selected.png'
        },
        'smart_furniture': {
            'deselect': '/static/icons/menu/smart_furniture.png',
            'select': '/static/icons/menu/smart_furniture_selected.png'
        },
        'location': {
            'deselect': '/static/icons/menu/location.png',
            'select': '/static/icons/menu/location_selected.png'
        }
    };
    menu.selectedMenuItem = null;
    menu.selectedMenuDiv = null;
    menu.selectedPlaceImg = null;
    menu.hasLocation = false;

    menu.showOpacity = function () {
        opacity.style.backgroundColor = "rgba(0,0,0,0.4)";
        opacity.style.zIndex = '1';
    };
    menu.hideOpacity = function () {
        document.getElementById('opacity').style.backgroundColor = "transparent";
        opacity.style.zIndex = '-1';
    };
    menu.open = function () {
        menu.showOpacity();
        document.getElementById("menu").style.right = "0";
        document.getElementById('login_div').style.right = '-100px';
        document.getElementById("aboutus_div").style.right = "-402px";
        document.getElementById("help_div").style.right = "-402px";
        setTimeout(function () {
            mapClickMenuListener = map.addListener('mousedown', menu.close);
        }, 500)

    };

    menu.close = function () {
        if (menu.selectedMenuDiv) {
            menu.closeSubMenu();
            document.getElementById('triangle-right').style.display = 'none';
            setTimeout(function () {
                document.getElementById("menu").style.right = "-198px";
                document.getElementById('login_div').style.right = '-300px';
                document.getElementById("aboutus_div").style.right = "-600px";
                document.getElementById("help_div").style.right = "-600px";
                menu.hideOpacity();
            }, 500);
        } else {
            document.getElementById("menu").style.right = "-198px";
            document.getElementById('login_div').style.right = '-300px';
            document.getElementById("aboutus_div").style.right = "-600px";
            document.getElementById("help_div").style.right = "-600px";
            menu.hideOpacity();
        }
        google.maps.event.removeListener(mapClickMenuListener);
        mapClickMenuListener = null;
    };
    menu.closeButton = function (event) {
        event.stopPropagation();
        menu.close();
    };
    menu.openLoginMenu = function (event) {
        event.stopPropagation();
        var loginLink = document.getElementById('login_link');
        if (menu.selectedMenuItem == loginLink) {
            return;
        }
        if (menu.selectedMenuItem) {
            menu.closeSubMenu();
            document.getElementById('triangle-right').style.top = triangle_tops[0];
            menu.selectedMenuItem = loginLink;
            menu.selectedMenuDiv = document.getElementById('login_div');
            setTimeout(function () {
                document.getElementById('login_div').style.right = '199px';
            }, 500);
        } else {
            menu.selectedMenuItem = loginLink;
            menu.selectedMenuDiv = document.getElementById('login_div');
            document.getElementById('triangle-right').style.display = 'block';
            document.getElementById('triangle-right').style.top = triangle_tops[0];
            document.getElementById('login_div').style.right = '199px';
        }
    };
    menu.closeLoginMenu = function (event) {
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        document.getElementById('login_div').style.right = "-100px";
    };
    menu.closeAboutusMenu = function () {
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        document.getElementById('aboutus_div').style.right = "-402px";
    };
    menu.openAboutusMenu = function (event) {
        event.stopPropagation();
        var aboutusLink = document.getElementById('aboutus_link');
        if (menu.selectedMenuItem == aboutusLink) {
            return;
        }
        if (menu.selectedMenuItem) {
            menu.closeSubMenu();
            document.getElementById('triangle-right').style.top = triangle_tops[1];
            menu.selectedMenuItem = aboutusLink;
            menu.selectedMenuDiv = document.getElementById('aboutus_div');
            setTimeout(function () {
                document.getElementById('aboutus_div').style.right = '198px';
            }, 500);
        } else {
            menu.selectedMenuItem = aboutusLink;
            menu.selectedMenuDiv = document.getElementById('aboutus_div');
            document.getElementById('triangle-right').style.display = 'block';
            document.getElementById('triangle-right').style.top = triangle_tops[2];
            document.getElementById('aboutus_div').style.right = '198px';
        }
    };
    menu.openHelpMenu = function (event) {
        event.stopPropagation();
        var helpLink = document.getElementById('help_link');
        if (menu.selectedMenuItem == helpLink) {
            return;
        }
        if (menu.selectedMenuItem) {
            menu.closeSubMenu();
            document.getElementById('triangle-right').style.top = triangle_tops[2];
            menu.selectedMenuItem = helpLink;
            menu.selectedMenuDiv = document.getElementById('help_div');
            setTimeout(function () {
                document.getElementById('help_div').style.right = '199px';
            }, 500);
        } else {
            menu.selectedMenuItem = helpLink;
            menu.selectedMenuDiv = document.getElementById('help_div');
            document.getElementById('triangle-right').style.display = 'block';
            document.getElementById('triangle-right').style.top = triangle_tops[3];
            document.getElementById('help_div').style.right = '199px';
        }
    };
    menu.closeHelpMenu = function () {
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        document.getElementById('help_div').style.right = "-402px";
    };
    menu.closeSubMenu = function () {
        if (menu.selectedMenuDiv == document.getElementById('login_div')) {
            menu.closeLoginMenu();
        } else if (menu.selectedMenuDiv == document.getElementById('aboutus_div')) {
            menu.closeAboutusMenu();
        } else if (menu.selectedMenuDiv == document.getElementById('help_div')) {
            menu.closeHelpMenu();
        }
    };
}
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
                    {lightness: -80}
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
                    {hue: '#6DCFF6'}, //#5CFF3F
                    {saturation: 100},
                    {lightness: 100}
                    // rgb : 92 255 63
                ]
            }
        ]
    });
    map.addListener('click', function () {
        closeEventDiv();
    });
    addLanguageUI();
    addTuicLogoAndWelcomeGif();
    addProjectLogo();
    addMenuIcon();
    draw(null);
    addZoomListener();
    populateEmbeddedList();
    createOpacity();
    populateAboutUsSlideShow();
    addCloseInfoWindowMapListener(); // this is a solution for info window is not fully created when user mouseout of the marker
}
function draw(time) {
    $.ajax({
        url: '/event/data?request=places',
        success: function (result) {
            var places = JSON.parse(result['places']);
            //console.log(places);
            for (var ii = 0; ii < places.length; ii++) {
                if (places[ii].fields.type == 2) {
                    var morningSelectedTime = new Date(selectedTime);
                    morningSelectedTime.setHours(7);
                    morningSelectedTime.setMinutes(0);
                    morningSelectedTime.setSeconds(0);
                    var url = '/event/data?request=location_set&from=' + morningSelectedTime.getTime() + '&to=' + selectedTime + '&place=' + places[ii].pk
                    $.ajax({
                        url: url,
                        success: function (result) {
                            var location_set = JSON.parse(result['location_set']);
                            console.log(location_set);
                            drawPath(location_set);
                        }
                    });
                    var url2 = '/event/data?request=zone&place=' + places[ii].pk;
                    $.ajax({
                        url: url2,
                        success: function (result) {
                            var zone = JSON.parse(result['zone']);
                            var zoneCoordinates = [];
                            for (var i = 0; i < zone.length; i++) {
                                var latitudeLongitude = zone[i].fields.location.split(',');
                                zoneCoordinates.push({
                                    lat: parseFloat(latitudeLongitude[0]),
                                    lng: parseFloat(latitudeLongitude[1])
                                });
                            }
                            var carZone = new google.maps.Polygon({
                                path: zoneCoordinates,
                                strokeColor: '#075572', //rgb: 43 187 242
                                strokeOpacity: 0.8,
                                strokeWeight: 3,
                                fillColor: '#0C92C5',
                                fillOpacity: 0.35
                            });
                            zones.push(carZone);
                        }
                    });
                }
                var url = '/event/data?request=location&place=' + places[ii].pk;
                if (time) {
                    url += '&time=' + time;
                }
                $.ajax({
                    url: url,
                    success: function (result) {
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
function addLanguageUI() {
    var langDiv = document.getElementById('lang_div');
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(langDiv);
    langDiv.style.display = 'block';

}

function addTuicLogoAndWelcomeGif() {
    var gif_image = $('#welcome_div img');
    var triangle = $('#gif_triangle');

    document.getElementById('gif_triangle').addEventListener('click', function () {

        var isOpened = gif_image.css('width') != '0px';
        if (isOpened) {
            gif_image.css('width', '0');
            triangle.css('border-right', 'none');
            triangle.css('border-left', '15px solid #000');

        } else {
            gif_image.css('width', '600px');
            triangle.css('border-left', 'none');
            triangle.css('border-right', '15px solid #000');
        }
    });
    var controlUI = document.createElement('div');
    var welcomeDiv = document.getElementById('welcome_div');
    controlUI.style.marginTop = '30px';
    controlUI.style.marginLeft = '40px';
    var image = document.createElement('img');
    image.setAttribute('src', '/static/icons/map/tuic_logo.png');
    image.setAttribute('alt', 'TUIC logo');
    image.style.float = 'left';
    controlUI.appendChild(image);
    //welcomeDiv.style.display = 'block';
    controlUI.appendChild(welcomeDiv);
    var br = document.createElement('br');
    br.setAttribute('style', 'clear:both');
    controlUI.appendChild(br);
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
    menuIcon.setAttribute('onclick', 'menu.open()');
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(menuIcon);
}
function addMarkerListeners(marker) {
    google.maps.event.addListener(marker, 'mouseover', function () {
        var place_id = this.place_id;
        if (place_id in infoWindows) {
            infoWindows[place_id].open(map, this);
            currentInfoWindow = infoWindows[place_id];
        } else {
            var url = '/event/data?request=current_events&time=' + selectedTime + '&place=' + place_id;
            $.ajax({
                url: url,
                success: function (result) {
                    var event_obj = JSON.parse(result['events']);
                    var contentString;
                    if (event_obj.length > 0) {
                        contentString = '<div>'
                        + '<img src="/media/' + event_obj[0].fields.image + '" style="width: 220px; height: 220px; margin-left: 25px; display: block"/>'
                        + '<h1 style="width: 220px; text-align: center; margin-left: 23px; margin-top: 20px">' + event_obj[0].fields.title + '</h1>'
                        + '</div>'
                    } else {
                        if (result['lang'] == 'en')
                            contentString = '<h2>No event for now</h2>';
                        else if (result['lang'] == 'fa')
                            contentString = '<h2>رویدادی وجود ندارد</h2>';
                    }
                    var infoWindow = new google.maps.InfoWindow({
                        content: contentString,
                        disableAutoPan: true,
                        maxWidth: 250
                    });
                    infoWindow.open(map, marker);
                    infoWindows[parseInt(result['place_id'])] = infoWindow;
                    currentInfoWindow = infoWindow;
                }
            });
        }
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
        if (infoWindows[marker.place_id]) {
            infoWindows[marker.place_id].close();
            currentInfoWindow = null;
        }
    });
    google.maps.event.addListener(marker, 'click', function () {
            if (currentEventDivMarker == this) {
                return;
            }
            $.ajax({
                url: '/event/data?request=events&time=' + selectedTime + '&place=' + this.place_id,
                success: function (result) {

                    var events = JSON.parse(result['events']);
                    if (events.length == 0)
                        return;
                    var event = events[0];
                    if (currentEventDivMarker) {
                        closeEventDiv();
                        setTimeout(function () {
                            clearEventDiv();
                            clearOtherEventsDiv();
                            createEventDiv(event, 0);
                            createOtherEventsDiv(events);
                            openEventDiv(marker);
                        }, 500);

                    } else {
                        clearEventDiv();
                        clearOtherEventsDiv();
                        createEventDiv(event, 0);
                        createOtherEventsDiv(events);
                        openEventDiv(marker);

                    }

                }
            });
        }
    )
    ;
}
function createEventDiv(event, index) {
    document.getElementById('event_title').innerHTML = event.fields.title;
    var amazingslider = document.createElement('div');
    amazingslider.setAttribute('id', 'amazingslider-1');
    amazingslider.setAttribute('style', 'display:block;position:relative;margin:0 auto; width: 600px; height: 400px');
    document.getElementById('amazingslider-wrapper-1').appendChild(amazingslider);
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'amazingslider-slides');
    ul.setAttribute('id', 'slider_contents');
    ul.setAttribute('style', 'display:none;');
    amazingslider.appendChild(ul);
    var li = document.createElement('li');
    var a = document.createElement('a');
    document.getElementById('slider_contents').appendChild(li);
    a.setAttribute('href', '/media/' + event.fields.image);
    a.setAttribute('class', 'html5lightbox');
    li.appendChild(a);
    var img = document.createElement('img');
    img.setAttribute('src', '/media/' + event.fields.image);
    a.appendChild(img);
    $.ajax({
        url: '/event/data?request=files&event=' + event.pk,
        success: function (result) {
            var files = JSON.parse(result['files']);
            console.log(files);
            for (var i = 0; i < files.length; i++) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                document.getElementById('slider_contents').appendChild(li);
                a.setAttribute('href', '/media/' + files[i].fields.file_field);
                a.setAttribute('class', 'html5lightbox');
                li.appendChild(a);
                var img = document.createElement('img');
                if (files[i].fields.type == 'video') {
                    img.setAttribute('data-src', '/media/' + files[i].fields.poster);
                } else if (files[i].fields.type == 'image') {
                    img.setAttribute('src', '/media/' + files[i].fields.file_field);
                }
                a.appendChild(img);
            }
            setTimeout(function () {
                var script1 = document.createElement('script');
                script1.setAttribute('src', '/static/js/initslider-1.js');
                script1.setAttribute('id', 'slider_script');
                document.head.appendChild(script1);
            }, 500);

        }
    });
    document.getElementById('event_time').innerHTML = event.fields.duration;
    document.getElementById('event_schedule').innerHTML = event.fields.schedule_text;
    document.getElementById('event_description').innerHTML = event.fields.description;
    currentEventDivIndex = index;
}
function closeEventDiv() {
    document.getElementById('event_div').style.right = "-700px";
    currentEventDivMarker = null;
}
function openEventDiv(marker) {
    document.getElementById('event_div').style.right = '0';
    currentEventDivMarker = marker;
}

function clearEventDiv() {
    var script = document.getElementById('slider_script');
    if (script) {
        script.parentNode.removeChild(script);
    }
    var sliderDiv = document.getElementById('amazingslider-wrapper-1');
    if (sliderDiv) {
        sliderDiv.innerHTML = '';
        document.getElementById('event_title').innerHTML = '';
        document.getElementById('event_time').innerHTML = '';
        document.getElementById('event_schedule').innerHTML = '';
        document.getElementById('event_description').innerHTML = '';
    }
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
        if (map.getZoom() > 13) {
            for (var i = 0; i < zones.length; i++) {
                zones[i].setMap(map);
            }
        } else {
            for (var i = 0; i < zones.length; i++) {
                zones[i].setMap(null);
            }
        }

    });
}

function populateEmbeddedList() {
    $.ajax({
        url: '/event/data?request=places&place_type=smart_furniture',
        success: function (result) {
            var places = JSON.parse(result['places']);
            console.log(places);
            for (var i = 0; i < places.length; i++) {
                $.ajax({
                    url: '/event/data?request=location&place=' + places[i].pk,
                    success: function (result) {
                        var location = locationParse(result['location']);
                        var marker = new google.maps.Marker({
                            position: location,
                            icon: '/static/icons/map/smart_furniture_deselected.png'
                        });
                        embeddedList.push(marker);
                    }
                });


            }
        }
    });

}
function locationParse(string) {
    var data = string.split(',');
    return new google.maps.LatLng(parseFloat(data[0]), parseFloat(data[1]));
}


function createOpacity() {
    opacity = document.createElement('div');
    opacity.setAttribute('id', 'opacity');
    opacity.addEventListener('mousedown', menu.close);
    document.body.appendChild(opacity);
}

function addCloseInfoWindowMapListener() {
    map.addListener('mousemove', function () {
        if (currentInfoWindow) {
            currentInfoWindow.close();
            currentInfoWindow = null;
        }
    });
}


function populateAboutUsSlideShow() {
    $.ajax({
        url: '/event/data?request=aboutus',
        success: function (result) {
            var aboutUsSlideShow = document.getElementById('aboutus_slideshow');
            var aboutUsText = document.getElementById('aboutus_text');
            var aboutUs = JSON.parse(result['aboutus']);
            var lang = result['lang'];
            for (var i = 0; i < aboutUs.length; i++) {
                var img = document.createElement('img');
                img.setAttribute('src', '/media/' + aboutUs[i].fields.picture);
                img.setAttribute('class', 'my_slide');
                aboutUsSlideShow.appendChild(img);
                var text = document.createElement('div');
                text.setAttribute('class', 'my_slide_text');
                if (lang == 'fa') text.innerHTML = aboutUs[i].fields.persian_text;
                else if (lang == 'en') text.innerHTML = aboutUs[i].fields.english_text;
                aboutUsText.appendChild(text);
            }
            var left_button = document.createElement('a');
            var right_button = document.createElement('a');
            left_button.setAttribute('class', 'w3-btn-floating w3-display-left');
            right_button.setAttribute('class', 'w3-btn-floating w3-display-right');
            left_button.addEventListener('click', function () {
                plusDivs(-1)
            });
            right_button.addEventListener('click', function () {
                plusDivs(1)
            });
            left_button.innerHTML = '&#10094;';
            right_button.innerHTML = '&#10095;';
            aboutUsSlideShow.appendChild(left_button);
            aboutUsSlideShow.appendChild(right_button);
            showDivs(aboutUsSlideIndex);
        }
    });
}


function plusDivs(n) {
    showDivs(aboutUsSlideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("my_slide");
    var y = document.getElementsByClassName('my_slide_text');
    if (n > x.length) {
        aboutUsSlideIndex = 1
    }
    if (n < 1) {
        aboutUsSlideIndex = x.length
    }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        y[i].style.display = 'none';
    }
    x[aboutUsSlideIndex - 1].style.display = "block";
    y[aboutUsSlideIndex - 1].style.display = "block";
}

function openOtherEvents() {
    document.getElementById('other_events_div').style.top = 0;
}

function closeOtherEvents() {
    document.getElementById('other_events_div').style.top = '100%';
}

function createOtherEventsDiv(events) {
    var parent = document.getElementById('other_events_cards');
    for (var i = 0; i < events.length; i++) {
        if (i == currentEventDivIndex) {
            continue;
        }
        var current = events[i];
        var card = document.createElement('div');
        card.setAttribute('class', 'card');
        var cardTitle = document.createElement('h3');
        cardTitle.setAttribute('class', 'card_title');
        cardTitle.innerHTML = current.fields.title;
        var cardImage = document.createElement('img');
        cardImage.setAttribute('src', '/media/' + current.fields.image);
        cardImage.setAttribute('class', 'card_image');
        var cardIndex = document.createElement('div');
        cardIndex.innerHTML = i.toString();
        cardIndex.style.display = 'none';
        parent.appendChild(card);
        card.appendChild(cardIndex);
        card.appendChild(cardTitle);
        card.appendChild(cardImage);


        card.addEventListener('click', function () {
            clearEventDiv();
            var index = parseInt(this.firstChild.innerHTML);
            createEventDiv(events[index], index);
            closeOtherEvents();
            clearOtherEventsDiv();
            createOtherEventsDiv(events);
        });
    }

}

function clearOtherEventsDiv() {
    document.getElementById('other_events_cards').innerHTML = '';
}

