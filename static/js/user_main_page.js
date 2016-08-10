var map;
var data = [];
var circleRadius = 100;
var drawEvent = {
    'container_gallery': function (event) {
        var lat = parseFloat(event.currentLocation.lat);
        var lng = parseFloat(event.currentLocation.lng);
        var center = {lat: lat, lng: lng};
        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: center,
            radius: circleRadius
        });
    },
    'mobile_media_unit': function (event) {
        var lat = parseFloat(event.currentLocation.lat);
        var lng = parseFloat(event.currentLocation.lng);
        var center = {lat: lat, lng: lng};
        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: center,
            radius: circleRadius
        });
        var poly = new google.maps.Polyline({
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 5
        });
        poly.setMap(map);
        var path = poly.getPath();
        for (var x = 0; x < event.spaceTimes.length; x++) {
            var curlat = parseFloat(event.spaceTimes[x].place.lat);
            var curlng = parseFloat(event.spaceTimes[x].place.lng);
            var latLng = new google.maps.LatLng(curlat, curlng);
            path.push(latLng);
        }
    },
    'embedded_culture': function (event) {
        var lat = parseFloat(event.currentLocation.lat);
        var lng = parseFloat(event.currentLocation.lng);
        var center = {lat: lat, lng: lng};
        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: center,
            radius: circleRadius
        });
    }

};

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
function initMap() {
    var tehran = {lat: 35.715298, lng: 51.404343};
    map = new google.maps.Map(document.getElementById('map'), {
        center: tehran,
        zoom: 12,
        streetViewControl: false
    });
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
            for (var k = 0; k < data.length; k++) {
                drawEvent[data[k].locationType](data[k]);
            }
        }
    });
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
