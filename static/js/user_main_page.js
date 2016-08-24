var map;
var places;
markers = [];
var drawPlace = {
    'container_gallery': function (position, place_id) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '/static/icons/map/container_gallery.png'
        });
        marker.place_id = place_id;
        markers.push(marker);
    },
    'mobile_media_unit': function (position, place_id) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '/static/icons/map/mobile_media_unit.png'
        });
        marker.place_id = place_id;
        markers.push(marker);
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
        marker.place_id = place_id;
        markers.push(marker);
    }

};

//function Place(id, placeName, lat, lng) {
//    this.id = id;
//    this.placeName = placeName;
//    this.lat = lat;
//    this.lng = lng;
//}
//
//function SpaceTime(place, startDateTime, endDateTime) {
//    this.place = place;
//    this.startDateTime = startDateTime;
//    this.endDateTime = endDateTime;
//}
//function MyEvent(id, locationType, currentLocation, spaceTimes) {
//    this.id = id;
//    this.locationType = locationType;
//    this.currentLocation = currentLocation;
//    this.spaceTimes = spaceTimes;
//}
function initMap() {
    var tehran = {lat: 35.715298, lng: 51.404343};
    map = new google.maps.Map(document.getElementById('map'), {
            center: tehran,
            zoom: 12,
            streetViewControl: false,
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
        }
    )
    ;
    draw(null);
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
//function createPlace(placeData) {
//    var listData = placeData.split('!!!');
//    var id = listData[0];
//    var placeName = listData[1];
//    var lat = listData[2];
//    var lng = listData[3];
//    return new Place(id, placeName, lat, lng);
//}
//
//function createSpaceTime(spaceTimeData) {
//    var spaceTimeList = spaceTimeData.split('@@@');
//    var place = createPlace(spaceTimeList[0]);
//    var startDateTime = spaceTimeList[1];
//    var endDateTime = spaceTimeList[2];
//    return new SpaceTime(place, startDateTime, endDateTime);
//}
