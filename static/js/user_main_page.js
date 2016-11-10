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
var clearButtonDiv;
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
var mapMouseMoveListener;
var events;
var opacity;
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
        document.getElementById("menu").style.width = "198px";
        setTimeout(function () {
            mapClickMenuListener = map.addListener('mousedown', menu.close);
        }, 500)

    };

    menu.close = function () {
        if (menu.selectedMenuDiv) {
            menu.closeSubMenu();
            document.getElementById('triangle-right').style.display = 'none';
            setTimeout(function () {
                document.getElementById("menu").style.width = 0;
                menu.hideOpacity();
            }, 500);
        } else {
            document.getElementById("menu").style.width = 0;
            menu.hideOpacity();
        }
        google.maps.event.removeListener(mapClickMenuListener);
        mapClickMenuListener = null;
    };
    menu.closeButton = function (event) {
        event.stopPropagation();
        menu.close();
    };
    menu.hide = function () {
        document.getElementById("menu").style.width = 0;
        document.getElementById('triangle-right').style.display = 'none';
        document.getElementById('reserve_div').style.right = 0;
        menu.hideOpacity();
        google.maps.event.removeListener(mapClickMenuListener);
        mapClickMenuListener = null;
    };
    menu.unhide = function () {
        document.getElementById('menu').style.width = '198px';
        document.getElementById('reserve_div').style.right = '200px';
        mapClickMenuListener = map.addListener('mousedown', menu.close);
        menu.showOpacity();
        setTimeout(function () {
            document.getElementById('triangle-right').style.display = 'block';
        }, 500);
    };
    menu.openReserveMenu = function (event) {
        event.stopPropagation();
        var reserveLink = document.getElementById('reserve_link');
        if (menu.selectedMenuItem == reserveLink) {
            return;
        }
        if (menu.selectedMenuItem) {
            menu.closeSubMenu();
            reserveLink.style.backgroundColor = '#6DCFF6';
            //reserveLink.style.borderStyle = 'inset';
            document.getElementById('triangle-right').style.top = '94px';
            menu.selectedMenuItem = reserveLink;
            menu.selectedMenuDiv = document.getElementById('reserve_div');
            setTimeout(function () {
                document.getElementById('reserve_div').style.width = '600px';
            }, 500);
        } else {
            menu.selectedMenuItem = reserveLink;
            menu.selectedMenuDiv = document.getElementById('reserve_div');
            reserveLink.style.backgroundColor = '#6DCFF6';
            //reserveLink.style.borderStyle = 'inset';
            document.getElementById('triangle-right').style.display = 'block';
            document.getElementById('triangle-right').style.top = '94px';
            document.getElementById('reserve_div').style.width = '600px';
        }
    };
    menu.closeReserveMenu = function () {
        if (menu.hasLocation) {
            document.getElementById('location_img').setAttribute('src', menu.icons['location']['deselect']);
            document.getElementById('locations_input').setAttribute('value', '');
            menu.hasLocation = false;
        }
        if (menu.selectedPlaceImg) {
            var name = menu.selectedPlaceImg.getAttribute('name');
            menu.selectedPlaceImg.setAttribute('src', menu.icons[name]['deselect']);
            document.getElementById('place_type_input').setAttribute('value', '');
            menu.selectedPlaceImg = null;
        }
        if (selectedMapUI != 'disable') {
            mapUI['disable']();
            selectedMapUI = 'disable';
        }
        document.getElementsByClassName('dropdown-menu')[0].style.display = 'none';
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        var reserveLink = document.getElementById('reserve_link');
        document.getElementById('reserve_div').style.width = 0;
        reserveLink.style.backgroundColor = 'transparent';
        //reserveLink.style.borderStyle = 'none';
        //reserveLink.style.borderBottom = 'solid #e1e1e1 2px';
    };
    menu.closeAboutusMenu = function () {
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        var aboutusLink = document.getElementById('aboutus_link');
        document.getElementById('aboutus_div').style.width = 0;
        aboutusLink.style.backgroundColor = 'transparent';
        //aboutusLink.style.borderStyle = 'none';
        aboutusLink.style.borderBottom = 'solid #e1e1e1 2px';
    };
    menu.openAboutusMenu = function (event) {
        event.stopPropagation();
        var aboutusLink = document.getElementById('aboutus_link');
        if (menu.selectedMenuItem == aboutusLink) {
            return;
        }
        if (menu.selectedMenuItem) {
            menu.closeSubMenu();
            aboutusLink.style.backgroundColor = '#6DCFF6';
            //aboutusLink.style.borderStyle = 'inset';
            document.getElementById('triangle-right').style.top = '163px';
            menu.selectedMenuItem = aboutusLink;
            menu.selectedMenuDiv = document.getElementById('aboutus_div');
            setTimeout(function () {
                document.getElementById('aboutus_div').style.width = '400px';
            }, 500);
        } else {
            menu.selectedMenuItem = aboutusLink;
            menu.selectedMenuDiv = document.getElementById('aboutus_div');
            aboutusLink.style.backgroundColor = '#6DCFF6';
            //aboutusLink.style.borderStyle = 'inset';
            document.getElementById('triangle-right').style.display = 'block';
            document.getElementById('triangle-right').style.top = '163px';
            document.getElementById('aboutus_div').style.width = '400px';
        }
    };
    menu.closeSubMenu = function () {
        if (menu.selectedMenuDiv == document.getElementById('reserve_div')) {
            menu.closeReserveMenu();
        } else if (menu.selectedMenuDiv == document.getElementById('aboutus_div')) {
            menu.closeAboutusMenu();
        }
    };
    menu.selectPlace = function (img) {
        if (menu.selectedPlaceImg == img) {
            return;
        }
        if (menu.selectedPlaceImg) {
            var name = menu.selectedPlaceImg.getAttribute('name');
            menu.selectedPlaceImg.setAttribute('src', menu.icons[name]['deselect']);
        }
        var imgName = img.getAttribute('name');
        img.setAttribute('src', menu.icons[imgName]['select']);
        document.getElementById('place_type_input').setAttribute('value', imgName);
        menu.selectedPlaceImg = img;
        removeClearButton();
        if (showMarkers) {
            hideMarkers();
        }
        document.getElementById('location_img').setAttribute('src', '/static/icons/menu/location.png');
        mapUI[imgName]();
        selectedMapUI = imgName;
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
        document.getElementById('event_div').style.width = 0;
    });
    addTuicLogo();
    addProjectLogo();
    addMenuIcon();
    draw(null);
    addZoomListener();
    populateEmbeddedList();
    createClearButton();
    createOpacity();
    getFacilities();
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
                url: '/event/data?request=current_events&time=' + selectedTime + '&place=' + this.place_id,
                success: function (result) {
                    var event = JSON.parse(result['events'])[0];
                    if (currentEventDivMarker) {
                        closeEventDiv();
                        setTimeout(function () {
                            clearEventDiv();
                            createEventDiv(event);
                            openEventDiv(marker);
                        }, 500);

                    } else {
                        createEventDiv(event);
                        openEventDiv(marker);
                    }

                }
            });
        }
    )
    ;
}
function createEventDiv(event) {
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

}
function closeEventDiv() {
    document.getElementById('event_div').style.width = 0;
    currentEventDivMarker = null;
}
function openEventDiv(marker) {
    document.getElementById('event_div').style.width = '700px';
    currentEventDivMarker = marker;
}

function clearEventDiv() {
    var script = document.getElementById('slider_script');
    script.parentNode.removeChild(script);
    var sliderDiv = document.getElementById('amazingslider-wrapper-1');
    sliderDiv.innerHTML = '';
    document.getElementById('event_title').innerHTML = '';
    document.getElementById('event_time').innerHTML = '';
    document.getElementById('event_schedule').innerHTML = '';
    document.getElementById('event_description').innerHTML = '';
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
            for (var i = 0 ; i < zones.length ; i++) {
                zones[i].setMap(map);
            }
        } else {
            for (var i = 0 ; i < zones.length ; i++) {
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
function doneButton(event) {
    event.preventDefault();
    document.getElementById('locations_input').setAttribute('value', JSON.stringify(locations));
    removeDoneAndCancelButton();
    menu.unhide();
    document.getElementById('location_img').setAttribute('src', '/static/icons/menu/location_selected.png');
    if (currentPolygon) {
        for (var i = 0; i < currentPolygon.getPath().length; i++) {
            locations.push({
                lat: currentPolygon.getPath().getAt(i).lat(),
                lng: currentPolygon.getPath().getAt(i).lng()
            });
        }
    }
    menu.hasLocation = true;
}

function cancelButton(event) {
    event.preventDefault();
    if (currentPolygon) {
        currentPolygon.setMap(null);
        currentPolygon = null;
    }
    if (currentMarker) {
        currentMarker.setMap(null);
        currentMarker = null;
    }
    if (currentFurniture) {
        currentFurniture.setOptions({
            icon: '/static/icons/map/smart_furniture_deselected.png'
        });
        currentFurniture = null;
    }
    removeClearButton();
    removeDoneAndCancelButton();
    menu.unhide();
    google.maps.event.removeListener(mapMouseMoveListener);
    mapMouseMoveListener = null;
    document.getElementById('location_img').setAttribute('src', '/static/icons/menu/location.png');
    menu.hasLocation = false;
}


function startDeleteMenu() {
    function DeleteMenu() {
        this.div_ = document.createElement('div');
        this.div_.className = 'delete-menu';
        this.div_.innerHTML = 'Delete';

        var menu = this;
        google.maps.event.addDomListener(this.div_, 'click', function () {
            if (currentPolygon.getPath().length > 3) {
                menu.removeVertex();
            }
        });
    }

    DeleteMenu.prototype = new google.maps.OverlayView();

    DeleteMenu.prototype.onAdd = function () {
        var deleteMenu = this;
        this.getPanes().floatPane.appendChild(this.div_);

        // mousedown anywhere on the map except on the menu div will close the
        // menu.
        this.divListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousedown', function (e) {
            if (e.target != deleteMenu.div_) {
                deleteMenu.close();
            }
        }, true);
    };

    DeleteMenu.prototype.onRemove = function () {
        google.maps.event.removeListener(this.divListener_);
        this.div_.parentNode.removeChild(this.div_);

        // clean up
        this.set('position');
        this.set('path');
        this.set('vertex');
    };

    DeleteMenu.prototype.close = function () {
        this.setMap(null);
    };

    DeleteMenu.prototype.draw = function () {
        var position = this.get('position');
        var projection = this.getProjection();

        if (!position || !projection) {
            return;
        }

        var point = projection.fromLatLngToDivPixel(position);
        this.div_.style.top = point.y + 'px';
        this.div_.style.left = point.x + 'px';
    };

    /**
     * Opens the menu at a vertex of a given path.
     */
    DeleteMenu.prototype.open = function (map, path, vertex) {
        this.set('position', path.getAt(vertex));
        this.set('path', path);
        this.set('vertex', vertex);
        this.setMap(map);
        this.draw();
    };

    /**
     * Deletes the vertex from the path.
     */
    DeleteMenu.prototype.removeVertex = function () {
        var path = this.get('path');
        var vertex = this.get('vertex');

        if (!path || vertex == undefined) {
            this.close();
            return;
        }

        path.removeAt(vertex);
        this.close();
    };

    var deleteMenu = new DeleteMenu();

    google.maps.event.addListener(currentPolygon, 'rightclick', function (e) {
        // Check if click was on a vertex control point
        if (e.vertex == undefined || currentPolygon.getPath().length <= 3) {
            return;
        }
        deleteMenu.open(map, currentPolygon.getPath(), e.vertex);
    });
}

function createClearButton() {
    clearButtonDiv = document.createElement('div');
    clearButtonDiv.style.backgroundColor = '#fff';
    clearButtonDiv.style.border = '2px solid #fff';
    clearButtonDiv.style.borderRadius = '3px';
    clearButtonDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.4)';
    clearButtonDiv.style.cursor = 'pointer';
    clearButtonDiv.style.marginBottom = '22px';
    clearButtonDiv.style.textAlign = 'center';
    clearButtonDiv.title = 'Clear';
    var clearButton = document.createElement('button');
    clearButton.style.fontFamily = 'Roboto,Arial,sans-serif';
    clearButton.style.fontSize = '16px';
    clearButton.style.lineHeight = '38px';
    clearButton.style.paddingLeft = '5px';
    clearButton.style.paddingRight = '5px';
    clearButton.innerHTML = 'Clear';
    clearButtonDiv.appendChild(clearButton);
    clearButton.addEventListener('click', function (e) {
        e.preventDefault();
        currentPolygon.setMap(null);
        currentPolygon = null;
        google.maps.event.removeListener(mapMouseMoveListener);
        mapMouseMoveListener = null;
        removeClearButton();
        removeDoneButton();
    });
}

function removeDoneAndCancelButton() {
    document.getElementById('done_button').style.display = 'none';
    document.getElementById('cancel_button').style.display = 'none';
}

function showCancelButton() {
    document.getElementById('cancel_button').style.display = 'inline-block';
}

function showDoneButton() {
    document.getElementById('done_button').style.display = 'inline-block';

}
function removeDoneButton() {
    document.getElementById('done_button').style.display = 'none';
}
function showClearButton() {
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(clearButtonDiv);

}

function removeClearButton() {
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
}

function locationParse(string) {
    var data = string.split(',');
    return new google.maps.LatLng(parseFloat(data[0]), parseFloat(data[1]));
}


function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    showMarkers = false;
}

function showReserveUI() {
    if (menu.selectedPlaceImg) {
        menu.hide();
        showCancelButton();
        if (menu.hasLocation) {
            showDoneButton();
        }
    } else {
        console.log('select a place type first');
    }
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

function getFacilities() {
    $.ajax({
        url: '/event/data?request=facility',
        success: function (result) {
            var facilities = JSON.parse(result['facilities']);
            var facilityDiv = document.getElementById('facilities_div');
            for (var i = 0; i < facilities.length; i++) {
                var facilityItem = document.createElement('div');
                facilityItem.setAttribute('class', 'facility_item');
                facilityDiv.appendChild(facilityItem);
                var name = facilities[i].fields.name;
                var id = 'fac_' + i;
                var label = document.createElement('label');
                label.setAttribute('for', id);
                label.innerHTML = name;
                facilityItem.appendChild(label);
                var checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('id', id);
                facilityItem.appendChild(checkbox);
            }
            var br = document.createElement('br');
            br.setAttribute('style', 'clear: both;');
            facilityDiv.appendChild(br);
        }
    });


}
