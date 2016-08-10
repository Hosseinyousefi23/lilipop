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
    },
    'mobile_media_unit': function () {
        drawingManager.setOptions({
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polyline']
            },
            drawingMode: google.maps.drawing.OverlayType.POLYLINE
        });
    },
    'embedded_culture': function () {
        // TODO show embedded places to select
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
            var locationTypeList = result.split(',')
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