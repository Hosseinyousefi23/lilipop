$(document).ready(function () {

    $("#example-basic").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        autoFocus: true,
        stepsOrientation: "vertical",
        onFinished: function () {
            document.getElementById('reserve_form').submit();
        }
    });
});

var map;
var circleRadius = 100;
var embeddedList = [];
var currentMarker = null;
var doneButtonDiv = null;
var cancelButtonDiv = null;
var showDone = false;
var form = $('#reserve_form');
var locations = [];
var listeners = [];
var polygonComplete = false;
var polygonMouseClickListener;
var polygonMouseMoveListener;
var polygonRightClickListener;
var mapMouseMoveListener;
var events;
var places;
var placeTypes;
var currentPolygon;

var mapUI = {

    // should be renamed if place type names in server database renamed

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
                animation: google.maps.Animation.DROP,
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
                    currentPolygon.getPath().removeAt(currentPolygon.getPath().getLength() - 1);
                    google.maps.event.removeListener(polygonMouseClickListener);
                    google.maps.event.removeListener(polygonMouseMoveListener);
                    google.maps.event.removeListener(mapMouseMoveListener);
                    google.maps.event.removeListener(polygonRightClickListener);
                    showDoneAndCancelButton();
                    currentPolygon.setOptions({
                        editable: true
                    });
                    startDeleteMenu();
                    polygonMouseClickListener = null;
                    polygonMouseMoveListener = null;
                    mapMouseMoveListener = null;
                    polygonRightClickListener = null;

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
            embeddedList[i].setOptions({map: map});
        }
        for (var j = 0; j < listeners.length; j++) {
            google.maps.event.removeListener(listeners[j])
        }
        if (showDone) {
            removeDoneAndCancelButton();
        }
        listeners = [];
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


function ChooseLocationTypeControl(controlDiv) {

    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.4)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.style.marginRight = '20px';
    controlDiv.appendChild(controlUI);

    var controlList = document.createElement('select');
    controlList.style.color = 'rgb(25,25,25)';
    controlList.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlList.style.fontSize = '16px';
    controlList.style.lineHeight = '38px';
    controlList.style.paddingLeft = '5px';
    controlList.style.paddingRight = '5px';
    controlUI.appendChild(controlList);
    $.ajax({
        url: "location_types", success: function (result) {
            var locationTypeList = result.split(',');
            for (var i = 0; i < locationTypeList.length; i++) {
                var lisTElement = document.createElement('option');
                var frontendBackendName = locationTypeList[i].split(':');
                var frontendName = frontendBackendName[0];
                var backendName = frontendBackendName[1];
                lisTElement.innerHTML = frontendName;
                lisTElement.value = backendName;
                controlList.appendChild(lisTElement);
            }
        }
    });

    controlList.addEventListener('change', function () {
        var selectedValue = controlList.options[controlList.selectedIndex].value;
        mapUI[selectedValue]();
    });
    mapUI['container_gallery']();


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

function initMap() {
    var tehran = {lat: 35.715298, lng: 51.404343};
    map = new google.maps.Map(document.getElementById('map'), {
        center: tehran,
        zoom: 11,
        streetViewControl: false,
        styles: [
            {
                featureType: 'all',
                stylers: [
                    {saturation: -100}
                ]
            }]
    });
    var locationTypeControlDiv = document.createElement('div');
    var locationTypeControl = new ChooseLocationTypeControl(locationTypeControlDiv, map);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationTypeControlDiv);
    $.ajax({
            url: 'data?request=places&place_type=smart_furniture',
            success: function (result) {
                places = JSON.parse(result['places']);
                console.log(places);
                for (var i = 0; i < places.length; i++) {
                    $.ajax({
                        url: 'data?request=location&place=' + places[i].pk,
                        success: function (result) {
                            var location = locationParse(result);
                            var marker = new google.maps.Marker({
                                position: location,
                                animation: google.maps.Animation.DROP,
                                icon: '/static/icons/map/smart_furniture_deselected.png'
                            });
                            embeddedList.push(marker);
                        }
                    });


                }
            }
        }
    );
    createDoneButton();
    createCancelButton();

}


function findPlaceFromEventIndex(index) { // finding place object from event index
    for (var i = 0; i < places.length; i++) {
        if (events[index].fields.place == places[i].pk) {
            return places[i];
        }
    }
}

function findLatlngFromPlaceIndex(index) { // finding latlng object from place index
    var locationString = places[index].fields.locations;
    var latlngString = locationString.split(',');
    var lat = parseFloat(latlngString[0]);
    var lng = parseFloat(latlngString[1]);
    return new google.maps.LatLng(lat, lng);
}

function findPlaceTypeFromPlaceIndex(index) {
    for (var i = 0; i < placeTypes.length; i++) {
        if (places[index].fields.type == placeTypes[i].pk) {
            return placeTypes[i];
        }
    }
}

function startDeleteMenu() {
    function DeleteMenu() {
        this.div_ = document.createElement('div');
        this.div_.className = 'delete-menu';
        this.div_.innerHTML = 'Delete';

        var menu = this;
        google.maps.event.addDomListener(this.div_, 'click', function () {
            menu.removeVertex();
        });
    }

    DeleteMenu.prototype = new google.maps.OverlayView();

    DeleteMenu.prototype.onAdd = function () {
        var deleteMenu = this;
        var map = this.getMap();
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
        if (e.vertex == undefined) {
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
