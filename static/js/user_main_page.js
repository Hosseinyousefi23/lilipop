var map;
var infoWindows = {};
var selectedTime = new Date().getTime();
var markers = [];
var mapClickMenuListener;
var embeddedList = [];
var currentMarker = null;
var doneButtonDiv = null;
var cancelButtonDiv = null;
var showDone = false;
var locations = [];
var listeners = [];
var polygonComplete = false;
var polygonMouseClickListener;
var polygonMouseMoveListener;
var polygonRightClickListener;
var mapMouseMoveListener;
var events;
var currentPolygon;
var menu = new Menu();
var mapUI = {

    // should be renamed if place type names in server database renamed
    'disable': function () {
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setMap(null);
        }
        for (var j = 0; j < listeners.length; j++) {
            google.maps.event.removeListener(listeners[j])
        }
        if (showDone) {
            removeDoneAndCancelButton();
        }
        listeners = [];
        map.setOptions({draggableCursor: null});
        if (currentMarker) {
            currentMarker.setMap(null);
            currentMarker = null;
        }
        if (currentPolygon) {
            currentPolygon.setMap(null);
            currentPolygon = null;
        }
        for (var k = 0; k < markers.length; k++) {
            markers[k].setMap(map);
        }
    },
    'container_gallery': function () {
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setMap(null);
        }
        for (var j = 0; j < listeners.length; j++) {
            google.maps.event.removeListener(listeners[j])
        }
        if (showDone) {
            removeDoneAndCancelButton();
        }
        listeners = [];
        map.setOptions({draggableCursor: 'crosshair'});
        if (currentMarker) {
            currentMarker.setMap(null);
            currentMarker = null;
        }
        if (currentPolygon) {
            currentPolygon.setMap(null);
            currentPolygon = null;
        }
        var listener = map.addListener('click', function (event) {
            if (currentMarker) {
                currentMarker.setMap(null);
                currentMarker = null;
            }
            if (currentPolygon) {
                currentPolygon.setMap(null);
                currentPolygon = null;
            }
            currentMarker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                draggable: true,
                icon: '/static/icons/map/container_gallery.png'
            });
            locations.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
            if (!showDone) {
                map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(doneButtonDiv);
                showDone = true;
            }
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
        if (showDone) {
            removeDoneAndCancelButton();
        }
        listeners = [];
        map.setOptions({draggableCursor: 'crosshair'});
        if (currentMarker) {
            currentMarker.setMap(null);
            currentMarker = null;
        }
        if (currentPolygon) {
            currentPolygon.setMap(null);
            currentPolygon = null;
        }
        var listener1 = map.addListener('click', function (event) {
            if (!currentPolygon) {
                if (!showDone) {
                    showCancelButton();
                }
                currentPolygon = new google.maps.Polygon({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#FF0000',
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
                    if (currentPolygon.getPath().length >= 3) {
                        currentPolygon.getPath().removeAt(currentPolygon.getPath().getLength() - 1);
                        google.maps.event.removeListener(polygonMouseClickListener);
                        google.maps.event.removeListener(polygonMouseMoveListener);
                        google.maps.event.removeListener(mapMouseMoveListener);
                        google.maps.event.removeListener(polygonRightClickListener);
                        showDoneAndCancelButton();
                        startDeleteMenu();
                        polygonMouseClickListener = null;
                        polygonMouseMoveListener = null;
                        mapMouseMoveListener = null;
                        polygonRightClickListener = null;
                    }
                });
                mapMouseMoveListener = map.addListener('mousemove', function (event) {
                    var path = currentPolygon.getPath();
                    path.setAt(path.length - 1, event.latLng);
                });
                google.maps.event.addListener(currentPolygon.getPath(), 'set_at', function () {
                    if (!showDone) {
                        showDoneAndCancelButton()
                    }
                });
                google.maps.event.addListener(currentPolygon.getPath(), 'insert_at', function () {
                    if (!showDone) {
                        showDoneAndCancelButton()
                    }
                });
                google.maps.event.addListener(currentPolygon.getPath(), 'remove_at', function () {
                    if (!showDone) {
                        showDoneAndCancelButton()
                    }
                });

                listeners.push(mapMouseMoveListener);
            }

        });
        listeners.push(listener1);

    },
    'smart_furniture': function () {
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setOptions({map: map, icon: '/static/icons/map/smart_furniture_deselected.png'});
        }
        for (var j = 0; j < listeners.length; j++) {
            google.maps.event.removeListener(listeners[j])
        }
        if (showDone) {
            removeDoneAndCancelButton();
        }
        listeners = [];
        map.setOptions({draggableCursor: null});
        if (currentMarker) {
            currentMarker.setMap(null);
            currentMarker = null;
        }
        if (currentPolygon) {
            currentPolygon.setMap(null);
            currentPolygon = null;
        }
        for (var l = 0; l < embeddedList.length; l++) {
            google.maps.event.addListener(embeddedList[l], 'click', function () {
                for (var x = 0; x < embeddedList.length; x++) {
                    embeddedList[x].setOptions({
                        icon: '/static/icons/map/smart_furniture_deselected.png'
                    });
                }
                locations = [{lat: this.position.lat(), lng: this.position.lng()}];
                this.setOptions({
                    icon: '/static/icons/map/smart_furniture.png'
                });
                if (!showDone) {
                    showDoneButton();
                }
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

    menu.open = function () {
        document.getElementById("menu").style.width = "200px";
        mapClickMenuListener = map.addListener('mousedown', menu.close);
        document.getElementById('map').style.backgroundColor = "rgba(0,0,0,0.4)";
    };

    menu.close = function () {
        if (menu.selectedMenuDiv) {
            menu.closeSubMenu();
            setTimeout(function () {
                document.getElementById("menu").style.width = 0;
                map.getDiv().style.backgroundColor = "rgba(0,0,0,0.4)";
            }, 500);
        } else {
            document.getElementById("menu").style.width = 0;
            document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
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
        document.body.style.backgroundColor = "white";
        google.maps.event.removeListener(mapClickMenuListener);
        mapClickMenuListener = null;
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
            reserveLink.style.borderStyle = 'inset';
            menu.selectedMenuItem = reserveLink;
            menu.selectedMenuDiv = document.getElementById('reserve_div');
            setTimeout(function () {
                document.getElementById('reserve_div').style.width = '600px';
            }, 500);
        } else {
            menu.selectedMenuItem = reserveLink;
            menu.selectedMenuDiv = document.getElementById('reserve_div');
            reserveLink.style.backgroundColor = '#6DCFF6';
            reserveLink.style.borderStyle = 'inset';
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
        mapUI['disable']();
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        var reserveLink = document.getElementById('reserve_link');
        document.getElementById('reserve_div').style.width = 0;
        reserveLink.style.backgroundColor = 'transparent';
        reserveLink.style.borderStyle = 'none';
        reserveLink.style.borderBottom = 'solid #e1e1e1 2px';
    };
    menu.closeAboutusMenu = function () {
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        var aboutusLink = document.getElementById('aboutus_link');
        document.getElementById('aboutus_div').style.width = 0;
        aboutusLink.style.backgroundColor = 'transparent';
        aboutusLink.style.borderStyle = 'none';
        aboutusLink.style.borderBottom = 'solid #e1e1e1 2px';
    };
    menu.hideReserveMenu = function () {
        document.getElementById('reserve_div').style.width = 0;
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
            aboutusLink.style.borderStyle = 'inset';
            menu.selectedMenuItem = aboutusLink;
            menu.selectedMenuDiv = document.getElementById('aboutus_div');
            setTimeout(function () {
                document.getElementById('aboutus_div').style.width = '400px';
            }, 500);
        } else {
            menu.selectedMenuItem = aboutusLink;
            menu.selectedMenuDiv = document.getElementById('aboutus_div');
            aboutusLink.style.backgroundColor = '#6DCFF6';
            aboutusLink.style.borderStyle = 'inset';
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
    populateEmbeddedList();
    createDoneButton();
    createCancelButton();
}
function draw(time) {
    $.ajax({
        url: '/event/data?request=places',
        success: function (result) {
            var places = JSON.parse(result['places']);
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
        if (infoWindows[marker.place_id]) {
            infoWindows[marker.place_id].close()
        }
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

function createDoneButton() {
    doneButtonDiv = document.createElement('div');
    doneButtonDiv.style.backgroundColor = '#fff';
    doneButtonDiv.style.border = '2px solid #fff';
    doneButtonDiv.style.borderRadius = '3px';
    doneButtonDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.4)';
    doneButtonDiv.style.cursor = 'pointer';
    doneButtonDiv.style.marginBottom = '22px';
    doneButtonDiv.style.marginRight = '10px';
    doneButtonDiv.style.marginLeft = '10px';
    doneButtonDiv.style.textAlign = 'center';
    doneButtonDiv.title = 'Done';
    var doneButton = document.createElement('button');
    doneButton.style.fontFamily = 'Roboto,Arial,sans-serif';
    doneButton.style.fontSize = '16px';
    doneButton.style.lineHeight = '38px';
    doneButton.style.paddingLeft = '5px';
    doneButton.style.paddingRight = '5px';
    doneButton.innerHTML = 'Done';
    doneButtonDiv.appendChild(doneButton);
    doneButton.addEventListener('click', function (e) {
        e.preventDefault();
        $('#event_data').attr('value', JSON.stringify(locations));
        removeDoneAndCancelButton();
        $("#example-basic").steps('next');
    });
}

function createCancelButton() {
    cancelButtonDiv = document.createElement('div');
    cancelButtonDiv.style.backgroundColor = '#fff';
    cancelButtonDiv.style.border = '2px solid #fff';
    cancelButtonDiv.style.borderRadius = '3px';
    cancelButtonDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.4)';
    cancelButtonDiv.style.cursor = 'pointer';
    doneButtonDiv.style.marginRight = '10px';
    doneButtonDiv.style.marginLeft = '10px';
    cancelButtonDiv.style.marginBottom = '22px';
    cancelButtonDiv.style.textAlign = 'center';
    cancelButtonDiv.title = 'Done';
    var cancelButton = document.createElement('button');
    cancelButton.style.fontFamily = 'Roboto,Arial,sans-serif';
    cancelButton.style.fontSize = '16px';
    cancelButton.style.lineHeight = '38px';
    cancelButton.style.paddingLeft = '5px';
    cancelButton.style.paddingRight = '5px';
    cancelButton.innerHTML = 'Cancel';
    cancelButtonDiv.appendChild(cancelButton);
    cancelButton.addEventListener('click', function (e) {
        e.preventDefault();
        currentPolygon.setMap(null);
        currentPolygon = null;
        removeDoneAndCancelButton();
        google.maps.event.removeListener(mapMouseMoveListener);
        mapMouseMoveListener = null;
    });
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

function showDoneAndCancelButton() {
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(doneButtonDiv);
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(cancelButtonDiv);
    showDone = true;
}

function removeDoneAndCancelButton() {
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
    showDone = false;
}

function showCancelButton() {
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(cancelButtonDiv);
    showDone = true;
}

function showDoneButton() {
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(doneButtonDiv);
    showDone = true;
}

function locationParse(string) {
    var data = string.split(',');
    return new google.maps.LatLng(parseFloat(data[0]), parseFloat(data[1]));
}


function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function showReserveUI() {
    if (menu.selectedPlaceImg) {
        menu.hideReserveMenu();
        hideMarkers();
        setTimeout(function () {
            menu.hide();
            mapUI[menu.selectedPlaceImg.getAttribute('name')]();
        }, 500);
    } else {
        console.log('select a place type first');
    }
}