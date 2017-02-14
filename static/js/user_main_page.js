var map;
var app;
var pathName = window.location.pathname;
if (pathName == '/') {
    pathName = '';
}
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
var proposalID = -1;
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
        document.getElementById("proposals_div").style.right = "-602px";
        document.getElementById("reserve_div").style.right = "-402px";
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
                document.getElementById("proposals_div").style.right = "-800px";
                document.getElementById("reserve_div").style.right = "-600px";
                document.getElementById("aboutus_div").style.right = "-600px";
                document.getElementById("help_div").style.right = "-600px";
                menu.hideOpacity();
            }, 500);
        } else {
            document.getElementById("menu").style.right = "-198px";
            document.getElementById("proposals_div").style.right = "-800px";
            document.getElementById("reserve_div").style.right = "-600px";
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
    menu.hide = function () {
        document.getElementById("menu").style.right = "-198px";
        document.getElementById("proposals_div").style.right = "-800px";
        document.getElementById("aboutus_div").style.right = "-600px";
        document.getElementById("help_div").style.right = "-600px";
        document.getElementById('triangle-right').style.display = 'none';
        document.getElementById('reserve_div').style.right = 0;
        menu.hideOpacity();
        google.maps.event.removeListener(mapClickMenuListener);
        mapClickMenuListener = null;
    };
    menu.unhide = function () {
        document.getElementById('menu').style.right = '0';
        document.getElementById("menu").style.right = "0";
        document.getElementById("proposals_div").style.right = "-602px";
        document.getElementById("aboutus_div").style.right = "-402px";
        document.getElementById("help_div").style.right = "-402px";
        document.getElementById('reserve_div').style.right = '199px';
        mapClickMenuListener = map.addListener('mousedown', menu.close);
        menu.showOpacity();
        setTimeout(function () {
            document.getElementById('triangle-right').style.display = 'block';
        }, 500);
    };
    menu.openProposalsMenu = function (event) {
        if (event) {
            event.stopPropagation();
        }
        clearProposals();
        populateProposals();
        var proposalsLink = document.getElementById('proposals_link');
        if (menu.selectedMenuItem == proposalsLink) {
            return;
        }
        if (menu.selectedMenuItem) {
            menu.closeSubMenu();
            document.getElementById('triangle-right').style.top = triangle_tops[0];
            menu.selectedMenuItem = proposalsLink;
            menu.selectedMenuDiv = document.getElementById('proposals_div');
            setTimeout(function () {
                document.getElementById('proposals_div').style.right = '199px';
            }, 500);
        } else {
            menu.selectedMenuItem = proposalsLink;
            menu.selectedMenuDiv = document.getElementById('proposals_div');
            document.getElementById('triangle-right').style.display = 'block';
            document.getElementById('triangle-right').style.top = triangle_tops[0];
            document.getElementById('proposals_div').style.right = '199px';
        }
    };
    menu.closeProposalMenu = function (event) {
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        enableProposalEdit();
        setCurrentProposalID(-1);
        document.getElementById('proposals_div').style.right = "-602px";
    };
    menu.openReserveMenu = function (event) {
        if (event) {
            event.stopPropagation();
        }
        var reserveLink = document.getElementById('reserve_link');
        if (menu.selectedMenuItem == reserveLink) {
            return;
        }
        if (menu.selectedMenuItem) {
            menu.closeSubMenu();
            //reserveLink.style.backgroundColor = '#6DCFF6';
            //reserveLink.style.borderStyle = 'inset';
            document.getElementById('triangle-right').style.top = triangle_tops[1];
            menu.selectedMenuItem = reserveLink;
            menu.selectedMenuDiv = document.getElementById('reserve_div');
            setTimeout(function () {
                document.getElementById('reserve_div').style.right = '199px';
            }, 500);
        } else {
            menu.selectedMenuItem = reserveLink;
            menu.selectedMenuDiv = document.getElementById('reserve_div');
            //reserveLink.style.backgroundColor = '#6DCFF6';
            //reserveLink.style.borderStyle = 'inset';
            document.getElementById('triangle-right').style.display = 'block';
            document.getElementById('triangle-right').style.top = triangle_tops[1];
            document.getElementById('reserve_div').style.right = '199px';
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
        $("#select_time_div input[type='text']")[0].value = "";
        $("#select_time_div input[type='text']")[1].value = "";
        $('.checkbox').each(function () {
            this.checked = false;
        });
        $('.time_picker').each(function () {
            this.disabled = true;
        });
        document.getElementById('title_text').value = "";
        document.getElementById('description_text').value = "";
        $('.facility_item').each(function () {
            this.children[1].checked = false;
        });
        menu.selectedMenuItem = null;
        menu.selectedMenuDiv = null;
        var reserveLink = document.getElementById('reserve_link');
        document.getElementById('reserve_div').style.right = "-402px";
        hideAllInvalidForms();
        //reserveLink.style.backgroundColor = 'transparent';
        //reserveLink.style.borderStyle = 'none';
        //reserveLink.style.borderBottom = 'solid #e1e1e1 2px';
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
            //aboutusLink.style.backgroundColor = '#6DCFF6';
            //aboutusLink.style.borderStyle = 'inset';
            document.getElementById('triangle-right').style.top = triangle_tops[2];
            menu.selectedMenuItem = aboutusLink;
            menu.selectedMenuDiv = document.getElementById('aboutus_div');
            setTimeout(function () {
                document.getElementById('aboutus_div').style.right = '198px';
            }, 500);
        } else {
            menu.selectedMenuItem = aboutusLink;
            menu.selectedMenuDiv = document.getElementById('aboutus_div');
            //aboutusLink.style.backgroundColor = '#6DCFF6';
            //aboutusLink.style.borderStyle = 'inset';
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
            document.getElementById('triangle-right').style.top = triangle_tops[3];
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
        if (menu.selectedMenuDiv == document.getElementById('proposals_div')) {
            menu.closeProposalMenu()
        } else if (menu.selectedMenuDiv == document.getElementById('reserve_div')) {
            menu.closeReserveMenu();
        } else if (menu.selectedMenuDiv == document.getElementById('aboutus_div')) {
            menu.closeAboutusMenu();
        } else if (menu.selectedMenuDiv == document.getElementById('help_div')) {
            menu.closeHelpMenu();
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
        closeEventDiv();
    });
    addLanguageUI();
    addTuicLogoAndWelcomeGif();
    addProjectLogo();
    addMenuIcon();
    draw(null);
    addZoomListener();
    populateEmbeddedList();
    createClearButton();
    createOpacity();
    getFacilities();
    populateAboutUsSlideShow();
    populateProposals();
    addCloseInfoWindowMapListener(); // this is a solution for info window is not fully created when user mouseout of the marker
}
function draw(time) {
    $.ajax({
        url: pathName + '/event/data?request=places',
        success: function (result) {
            var places = JSON.parse(result['places']);
            //console.log(places);
            for (var ii = 0; ii < places.length; ii++) {
                if (places[ii].fields.type == 2) {
                    var morningSelectedTime = new Date(selectedTime);
                    morningSelectedTime.setHours(7);
                    morningSelectedTime.setMinutes(0);
                    morningSelectedTime.setSeconds(0);
                    var url = pathName + '/event/data?request=location_set&from=' + morningSelectedTime.getTime() + '&to=' + selectedTime + '&place=' + places[ii].pk
                    $.ajax({
                        url: url,
                        success: function (result) {
                            var location_set = JSON.parse(result['location_set']);
                            console.log(location_set);
                            drawPath(location_set);
                        }
                    });
                    var url2 = pathName + '/event/data?request=zone&place=' + places[ii].pk;
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
                var url = pathName + '/event/data?request=location&place=' + places[ii].pk;
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
            var url = pathName + '/event/data?request=current_events&time=' + selectedTime + '&place=' + place_id;
            $.ajax({
                url: url,
                success: function (result) {
                    var event_obj = JSON.parse(result['events']);
                    var contentString;
                    if (event_obj.length > 0) {
                        contentString = '<div>'
                        + '<img src="'
                        + pathName
                        + '/media/' + event_obj[0].fields.image + '" style="width: 220px; height: 220px; margin-left: 25px; display: block"/>'
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
                url: pathName + '/event/data?request=events&time=' + selectedTime + '&place=' + this.place_id,
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
    a.setAttribute('href', pathName+'/media/' + event.fields.image);
    a.setAttribute('class', 'html5lightbox');
    li.appendChild(a);
    var img = document.createElement('img');
    img.setAttribute('src', pathName +'/media/' + event.fields.image);
    a.appendChild(img);
    $.ajax({
        url: pathName + '/event/data?request=files&event=' + event.pk,
        success: function (result) {
            var files = JSON.parse(result['files']);
            console.log(files);
            for (var i = 0; i < files.length; i++) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                document.getElementById('slider_contents').appendChild(li);
                a.setAttribute('href', pathName + '/media/' + files[i].fields.file_field);
                a.setAttribute('class', 'html5lightbox');
                li.appendChild(a);
                var img = document.createElement('img');
                if (files[i].fields.type == 'video') {
                    img.setAttribute('data-src', pathName + '/media/' + files[i].fields.poster);
                } else if (files[i].fields.type == 'image') {
                    img.setAttribute('src', pathName + '/media/' + files[i].fields.file_field);
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
        url: pathName + '/event/data?request=places&place_type=smart_furniture',
        success: function (result) {
            var places = JSON.parse(result['places']);
            console.log(places);
            for (var i = 0; i < places.length; i++) {
                $.ajax({
                    url: pathName + '/event/data?request=location&place=' + places[i].pk,
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
    clearButton = document.createElement('Button');
    clearButton.setAttribute("class", "menu_button");
    clearButton.style.backgroundColor = "#6DCFF6";
    clearButton.style.display = "block";
    clearButton.style.width = "90px";
    clearButton.style.height = "90px";
    clearButton.style.marginBottom = "10px";
    //clearButton.style.backgroundColor = '#fff';
    //clearButton.style.border = '2px solid #fff';
    //clearButton.style.borderRadius = '3px';
    //clearButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.4)';
    //clearButton.style.cursor = 'pointer';
    //clearButton.style.marginBottom = '22px';
    //clearButton.style.textAlign = 'center';
    //clearButton.title = 'Clear';
    clearButton.innerHTML = 'Clear';
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
    console.log("clear");
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(clearButton);

}

function removeClearButton() {
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
    console.log("declear");
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


function saveProposal() {
    var border = "solid 2px red";
    var hasError = false;
    if (!menu.selectedPlaceImg) {
        showInvalidForm($("#select_place_div")[0].children[0]);
        hasError = true;
    } else {
        hideInvalidForm($("#select_place_div")[0].children[0])
    }
    if (!menu.hasLocation) {
        showInvalidForm($("#select_location_div")[0].children[0]);
        hasError = true;
    } else {
        hideInvalidForm($("#select_location_div")[0].children[0]);
    }
    if (!$("#select_time_div input[type='text']")[0].value) {
        showInvalidForm($(".time_div")[0].children[0]);
        hasError = true;
    } else {
        hideInvalidForm($(".time_div")[0].children[0]);
    }
    if (!$("#select_time_div input[type='text']")[1].value) {
        showInvalidForm($(".time_div")[1].children[0]);
        hasError = true;
    } else {
        hideInvalidForm($(".time_div")[1].children[0]);
    }
    if (!$("#title_text").val()) {
        showInvalidForm($("#title_div")[0].children[0]);
        hasError = true;
    } else {
        hideInvalidForm($("#title_div")[0].children[0]);
    }
    if (!$("#description_text").val()) {
        showInvalidForm($("#description_div")[0].children[0]);
        hasError = true;
    } else {
        hideInvalidForm($("#description_div")[0].children[0]);
    }

    if (!hasError) {
        var csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        var place_type = document.getElementById('place_type_input').getAttribute('value');
        var locations_str = "";
        for (var i = 0; i < locations.length; i++) {
            locations_str += locations[i].lat + "," + locations[i].lng;
            if (i != locations.length - 1) {
                locations_str += ';'
            }
        }
        var dates = $("#select_time_div input[type='text']");
        var start_date = dates[0].value.split(' ')[0].split('/').join('-');
        var end_date = dates[1].value.split(' ')[0].split('/').join('-');
        var schedule = "";
        var weekdays = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
        var scheduleDiv = $('#time_schedule_div');
        for (var i = 0; i < 7; i++) {
            if (scheduleDiv.children()[i].children[0].children[0].checked) {
                schedule += weekdays[i] + ',' + scheduleDiv.children()[i].children[1].value + ',' + scheduleDiv.children()[i].children[3].value;
                schedule += ';';
            }
        }
        if (schedule.length != 0) {
            schedule = schedule.substring(0, schedule.length - 1);
        }
        var title = $('#title_text').val();
        var description = $('#description_text').val();
        var all_facilities = $('.facility_item').find('input');
        var facilities = '';
        for (var i = 0; i < all_facilities.length; i++) {
            if (all_facilities[i].checked) {
                facilities += all_facilities[i].value + ',';
            }
        }
        if (facilities.length > 0) {
            facilities = facilities.substring(0, facilities.length - 1);
        }
        var postData = {
            id: proposalID,
            place_type: place_type,
            locations: locations_str,
            start_date: start_date,
            end_date: end_date,
            jalali_start_date_txt: dates[0].value,
            jalali_end_date_txt: dates[1].value,
            schedule: schedule,
            title: title,
            description: description,
            facilities: facilities,
            csrfmiddlewaretoken: csrfttoken
        };
        $.ajax({
            type: "POST", url: pathName + '/event/reserve', data: postData, success: function (result) {
                console.log(result);
            }
        });
    }

}
function showInvalidFormJQ(element) {
    element.addClass("error");
    element.on("click", function () {
        hideInvalidFormJQ(element);
    });
}
function showInvalidForm(element) {
    var len = element.className.length;
    if (len < 6 || element.className.substring(len - 6, len) != ' error') {
        element.className += " error";
    }
    element.addEventListener("click", function () {
        hideInvalidForm(element);
    });
}
function hideInvalidFormJQ(element) {
    element.removeClass("error");
}
function hideInvalidForm(element) {
    var len = element.className.length;
    if (element.className.substring(len - 6, len) == " error") {
        element.className = element.className.substring(0, len - 6)
    }

}
function hideAllInvalidForms() {
    hideInvalidFormJQ($("#select_place_div"));
    hideInvalidFormJQ($("#select_location_div"));
    hideInvalidForm($(".time_div")[0].children[1]);
    hideInvalidForm($(".time_div")[1].children[1]);
    hideInvalidFormJQ($("#title_text"), "1px solid");
    hideInvalidFormJQ($("#description_text"));
}
function getFacilities() {
    $.ajax({
        url: pathName + '/event/data?request=facility',
        success: function (result) {
            var lang = result['lang'];
            var facilities = JSON.parse(result['facilities']);
            var facilityDiv = document.getElementById('facilities_div');
            for (var i = 0; i < facilities.length; i++) {
                var facilityItem = document.createElement('div');
                facilityItem.setAttribute('class', 'facility_item');
                facilityDiv.appendChild(facilityItem);
                var name;
                if (lang == 'en') name = facilities[i].fields.english_name;
                else if (lang == 'fa') name = facilities[i].fields.persian_name;
                var id = 'fac_' + i;
                var label = document.createElement('label');
                label.setAttribute('for', id);
                label.innerHTML = name;
                facilityItem.appendChild(label);
                var checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('id', id);
                checkbox.setAttribute('name', 'facility');
                checkbox.setAttribute('value', name);
                facilityItem.appendChild(checkbox);
            }
            var br = document.createElement('br');
            br.setAttribute('style', 'clear: both;');
            facilityDiv.appendChild(br);
        }
    });


}

function populateAboutUsSlideShow() {
    $.ajax({
        url: 'event/data?request=aboutus',
        success: function (result) {
            var aboutUsSlideShow = document.getElementById('aboutus_slideshow');
            var aboutUsText = document.getElementById('aboutus_text');
            var aboutUs = JSON.parse(result['aboutus']);
            var lang = result['lang'];
            for (var i = 0; i < aboutUs.length; i++) {
                var img = document.createElement('img');
                img.setAttribute('src', pathName + '/media/' + aboutUs[i].fields.picture);
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
function clearProposals() {
    var table = document.getElementById('proposals_table');
    while (table.children.length > 1) {
        table.removeChild(table.children[1]);
    }
}
function populateProposals() {
    $.ajax({
        url: pathName + '/event/data?request=proposals',
        success: function (result) {
            var proposals = JSON.parse(result['proposals']);
            for (var i = 0; i < proposals.length; i++) {
                console.log(proposals[i]);
                var row = document.createElement('tr');
                document.getElementById('proposals_table').appendChild(row);
                var title = document.createElement('td');
                title.innerHTML = proposals[i].fields.title;
                row.appendChild(title);
                var startDate = document.createElement('td');
                startDate.innerHTML = proposals[i].fields.save_time.split('.')[0];
                row.appendChild(startDate);
                var lastChange = document.createElement('td');
                lastChange.innerHTML = proposals[i].fields.last_change_time.split('.')[0];
                row.appendChild(lastChange);
                var actions = document.createElement('td');
                var index = document.createElement('div');
                index.innerHTML = i;
                index.style.display = 'none';
                actions.appendChild(index);
                var view = document.createElement('a');
                if (result['lang'] == 'fa') {
                    view.innerHTML = 'مشاهده';
                } else {
                    view.innerHTML = 'View';
                }
                view.addEventListener('click', function () {
                    viewProposal(proposals[parseInt(this.parentNode.firstChild.innerHTML)]);
                    disableProposalEdit();
                });

                actions.appendChild(view);
                if (proposals[i].fields.status == 'not submitted') {
                    var edit = document.createElement('a');
                    if (result['lang'] == 'fa') {
                        edit.innerHTML = 'ویرایش';
                    } else {
                        edit.innerHTML = 'Edit';
                    }
                    edit.addEventListener('click', function () {
                        viewProposal(proposals[parseInt(this.parentNode.firstChild.innerHTML)]);
                    });
                    actions.appendChild(edit);
                    var delete1 = document.createElement('a');
                    if (result['lang'] == 'fa') {
                        delete1.innerHTML = 'حذف';
                    } else {
                        delete1.innerHTML = 'Delete';
                    }
                    delete1.addEventListener('click', function () {
                        deleteProposal(proposals[parseInt(this.parentNode.firstChild.innerHTML)].pk);
                    });
                    actions.appendChild(delete1);

                    var submit = document.createElement('a');
                    if (result['lang'] == 'fa') {
                        submit.innerHTML = 'ثبت';
                    } else {
                        submit.innerHTML = 'Submit';
                    }
                    submit.addEventListener('click', function () {
                        submitProposal(proposals[parseInt(this.parentNode.firstChild.innerHTML)].pk);
                    });
                    actions.appendChild(submit);
                }
                row.appendChild(actions);
                var status = document.createElement('td');
                if (result['lang'] == 'fa') {
                    status.innerHTML = proposals[i].fields.status_fa;
                } else {
                    status.innerHTML = proposals[i].fields.status;
                }
                row.appendChild(status);


            }
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
        cardImage.setAttribute('src', pathName + '/media/' + current.fields.image);
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

function viewProposal(proposal) {
    setCurrentProposalID(proposal.pk);
    menu.openReserveMenu();
    var placeTypes = {
        '1': 'container_gallery',
        '2': 'mobile_media_unit', '3': 'smart_furniture'
    };
    var img = document.getElementsByName(placeTypes[proposal.fields.place_type])[0];
    menu.selectPlace(img);
    $.ajax({
        url: pathName + '/event/data?request=proposal_locations&proposal=' + proposal.pk, success: function (result) {
            var proposal_locations = JSON.parse(result['locations']);
            if (proposal.fields.place_type == '1') {
                var lat = parseFloat(proposal_locations[0].fields.position.split(',')[0]);
                var lng = parseFloat(proposal_locations[0].fields.position.split(',')[1]);
                currentMarker = new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: map,
                    draggable: true,
                    icon: '/static/icons/map/container_gallery.png'
                });

                locations = [{lat: lat, lng: lng}];
            } else if (proposal.fields.place_type == '2') {
                currentPolygon = new google.maps.Polygon({
                    strokeColor: '#075572', //rgb: 43 187 242
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: '#0C92C5',
                    fillOpacity: 0.35,
                    editable: true
                });
                currentPolygon.setMap(map);
                for (var i = 0; i < proposal_locations.length; i++) {
                    var lati = parseFloat(proposal_locations[i].fields.position.split(',')[0]);
                    var lngi = parseFloat(proposal_locations[i].fields.position.split(',')[1]);
                    currentPolygon.getPath().push(new google.maps.LatLng({lat: lati, lng: lngi}));
                }

                showClearButton();
                startDeleteMenu();

            } else if (proposal.fields.place_type == '3') {
                var latii = parseFloat(proposal_locations[0].fields.position.split(',')[0]);
                var lngii = parseFloat(proposal_locations[0].fields.position.split(',')[1]);
                locations = [{lat: latii, lng: lngii}];
                for (var ii = 0; ii < embeddedList.length; ii++) {
                    if (embeddedList[ii].position.lat() == latii && embeddedList[ii].position.lng() == lngii) {
                        currentFurniture = embeddedList[ii];
                        embeddedList[ii].setOptions({
                            icon: '/static/icons/map/smart_furniture.png'
                        });
                        break;
                    }
                }

            }

            menu.hasLocation = true;
            document.getElementById('location_img').setAttribute('src', menu.icons['location']['select']);
        }

    });
    $("#select_time_div input[type='text']")[0].value = proposal.fields.jalali_start_date_txt;
    $("#select_time_div input[type='text']")[1].value = proposal.fields.jalali_end_date_txt;
    var schedules = proposal.fields.schedule_txt.split(';');
    console.log(schedules);
    $('.checkbox').each(function () {
        this.checked = false;
    });
    $('.time_picker').each(function () {
        this.disabled = true;
    });

    for (var i = 0; i < schedules.length; i++) {
        var data = schedules[i].split(',');
        var weekday = data[0];
        var from = data[1];
        var to = data[2];
        var checkbox = document.getElementsByClassName('checkbox ' + weekday)[0];
        var time_picker_from = document.getElementsByClassName('time_picker from ' + weekday)[0];
        time_picker_from.disabled = false;
        time_picker_from.value = from;
        var time_picker_to = document.getElementsByClassName('time_picker to ' + weekday)[0];
        time_picker_to.disabled = false;
        time_picker_to.value = to;
        checkbox.checked = true;
    }
    document.getElementById('title_text').value = proposal.fields.title;
    document.getElementById('description_text').value = proposal.fields.description;

    $.ajax({
        url: pathName + '/event/data?request=proposal_facilities&proposal=' + proposal.pk, success: function (result) {
            var facilities = JSON.parse(result['facilities']);
            console.log(facilities);
            for (var i = 0; i < facilities.length; i++) {
                var facilityName;
                if (result['lang'] == 'fa') {
                    facilityName = facilities[i].fields.persian_name;
                } else if (result['lang'] == 'en') {
                    facilityName = facilities[i].fields.english_name;
                }
                $('.facility_item').each(function () {
                    if (this.firstChild.innerHTML == facilityName) {
                        this.children[1].checked = true;
                    }
                });
            }
        }
    });

}

function disableProposalEdit() {
    document.getElementById('save_button').style.display = 'none';
}

function enableProposalEdit() {
    document.getElementById('save_button').style.display = 'inline';
}

function setCurrentProposalID(id) {
    proposalID = id;
}

function deleteProposal(pk) {
    $.ajax({
        url: pathName + '/event/delete?proposal=' + pk, success: function (result) {
            menu.openProposalsMenu(null);
        }
    });
}

function submitProposal(pk) {
    $.ajax({
        url: pathName + '/event/submit?proposal=' + pk, success: function (result) {
            menu.openProposalsMenu(null);
        }
    });
}