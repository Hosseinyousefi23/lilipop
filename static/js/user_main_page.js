var map;
var data = [];
var drawingTools = {
    'container_gallery': function (eventData) {

    },
    'media_mobile_unit': function (eventData) {

    },
    'embedded_culture': function (eventData) {

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