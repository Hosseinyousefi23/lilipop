$(document).ready(function () {

    $("#example-basic").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        autoFocus: true,
        stepsOrientation: "vertical"
    });
});

var map;
var drawingManager;
var data = [];
var circleRadius = 100;
var embeddedList = [];
var mapUI = {

    // should be renamed if location type names in server database renamed

    'container_gallery': function () {
        drawingManager.setOptions({
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker']
            },
            drawingMode: google.maps.drawing.OverlayType.MARKER
        });
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setMap(null);
        }
    },
    'mobile_media_unit': function () {
        drawingManager.setOptions({
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polyline']
            },
            drawingMode: google.maps.drawing.OverlayType.POLYLINE
        });
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setMap(null);
        }

    },
    'embedded_culture': function () {
        drawingManager.setOptions({
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: []
            },
            drawingMode: google.maps.drawing.OverlayType.MARKER
        });
        for (var i = 0; i < embeddedList.length; i++) {
            embeddedList[i].setMap(map);
        }
    }
};


function ChooseLocationTypeControl(controlDiv, map) {

    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.4)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to set a place';
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
        url: "/event/location_types", success: function (result) {
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
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker']
        },
        markerOptions: {
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            editable: true,
            clickable: true
        }
    });
    drawingManager.setMap(map);
    controlList.addEventListener('change', function () {
        var selectedValue = controlList.options[controlList.selectedIndex].value;
        mapUI[selectedValue]();
    });


}
function initMap() {
    var tehran = {lat: 35.715298, lng: 51.404343};
    map = new google.maps.Map(document.getElementById('map'), {
        center: tehran,
        zoom: 11,
        streetViewControl: false
    });
    var locationTypeControlDiv = document.createElement('div');
    var locationTypeControl = new ChooseLocationTypeControl(locationTypeControlDiv, map);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationTypeControlDiv);
    $.ajax({
        url: '/event/data',
        success: function (result) {
            var eventsCode = result.split('$$$');
            for (var i = 0; i < eventsCode.length; i++) {
                var eventData = eventsCode[i].split('###');
                var eventId = eventData[0];
                var locationType = eventData[1];
                var currentLocation = createPlace(eventData[2]);
                var spaceTimes = [];
                for (var j = 3; j < eventData.length; j++) {
                    spaceTimes.push(createSpaceTime(eventData[j]));
                }
                var event = new MyEvent(eventId, locationType, currentLocation, spaceTimes);
                data.push(event);
            }
            for (var x = 0; x < data.length; x++) {
                if (data[x].locationType == 'embedded_culture') {
                    var lat = parseFloat(data[x].currentLocation.lat);
                    var lng = parseFloat(data[x].currentLocation.lng);
                    var center = {lat: lat, lng: lng};
                    var circle = new google.maps.Circle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35,
                        center: center,
                        radius: circleRadius
                    });
                    embeddedList.push(circle);
                }
            }
        }
    });
}

function Place(id, placeName, lat, lng) {
    this.id = id;
    this.placeName = placeName;
    this.lat = lat;
    this.lng = lng;
}

function SpaceTime(place, startDateTime, endDateTime) {
    this.place = place;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
}
function MyEvent(id, locationType, currentLocation, spaceTimes) {
    this.id = id;
    this.locationType = locationType;
    this.currentLocation = currentLocation;
    this.spaceTimes = spaceTimes;
}
function createPlace(placeData) {
    var listData = placeData.split('!!!');
    var id = listData[0];
    var placeName = listData[1];
    var lat = listData[2];
    var lng = listData[3];
    return new Place(id, placeName, lat, lng);
}

function createSpaceTime(spaceTimeData) {
    var spaceTimeList = spaceTimeData.split('@@@');
    var place = createPlace(spaceTimeList[0]);
    var startDateTime = spaceTimeList[1];
    var endDateTime = spaceTimeList[2];
    return new SpaceTime(place, startDateTime, endDateTime);
}

//function showMap(locationType) {
//
//    mapUI[locationType]();
//
//}


//function initMap() {
//    var map = new google.maps.Map(document.getElementById('map'), {
//        zoom: 4,
//        center: {lat: -25.363882, lng: 131.044922}
//    });
//
//    map.addListener('click', function (e) {
//        placeMarkerAndPanTo(e.latLng, map);
//    });
//}
//
//function placeMarkerAndPanTo(latLng, map) {
//    var marker = new google.maps.Marker({
//        position: latLng,
//        map: map
//    });
//    map.panTo(latLng);
//}