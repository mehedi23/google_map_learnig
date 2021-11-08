// all global variables ====================

var map;
var geocoder;
var bounds;
var infoWindow;
var click_1st = null;
var click_2nd = null;
var last_time_start_address = null;
var last_time_end_address = null;
var success_first_distance = false;
var directionsService;
var directionsRenderer;
const custom_markers_array = [];
const labels = "AB";

var action_btn = document.querySelector('.action-button');
var travel_model = document.getElementById('travel_model_val').value;
var first_location = document.getElementById("first_location");
var second_location = document.getElementById("second_location");
var response_map_display = document.getElementById("response_map")



// init google map ============================

function initMap() {
    // map init

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: {
            lat: 41.85,
            lng: -87.65
        },
    });

    bounds = new google.maps.LatLngBounds();
    geocoder = new google.maps.Geocoder();
    infoWindow = new google.maps.InfoWindow();
    infoWindow.open(map);

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map
    });
    directionsRenderer.setMap(map);

    directionsRenderer.addListener("directions_changed", function () {
        const directions = directionsRenderer.getDirections();
        var res_info = directions.routes[0].legs[0];
        first_location.value = res_info.start_address;
        second_location.value = res_info.end_address;
        click_1st = res_info.start_address;
        click_2nd = res_info.end_address;
        last_time_start_address = res_info.start_address;
        last_time_end_address = res_info.end_address;

        response_map_display.innerText = `${res_info.start_address} to ${res_info.end_address} d ${res_info.distance.text}les t ${res_info.duration.text}`;
    });

    search_box();

    document.getElementById('travel_model_val').addEventListener("change", travel_model_selector);

    map.addListener("click", (e) => {
        custom_mark(e.latLng);
        !click_2nd && geocode_recording(e.latLng);
    });

    function travel_model_selector() {
        travel_model = this.value;
        click_1st && click_2nd && the_routes(directionsService, directionsRenderer, click_1st, click_2nd);
    };



    // end init map
};




// functions =============================
action_btn.addEventListener("click", function () {
    click_1st && click_2nd && the_routes(directionsService, directionsRenderer, click_1st, click_2nd);
});


function custom_mark(latLng) {
    if (custom_markers_array.length < 2) {
        const single_markers = new google.maps.Marker({
            position: latLng,
            map: map,
            zoom: 14,
            draggable: true,
            clickable: true,
            label: !click_1st ? labels[0] : labels[1],
        });

        custom_markers_array.push(single_markers);
    };
};


function search_box() {
    const searchBox_1 = new google.maps.places.SearchBox(first_location);
    const searchBox_2 = new google.maps.places.SearchBox(second_location);

    searchBox_1.addListener("places_changed", () => {
        const places = searchBox_1.getPlaces();
        !success_first_distance && map_bounce_to(places);
        click_1st = places[0].formatted_address;
        click_1st && click_2nd && the_routes(directionsService, directionsRenderer, click_1st, click_2nd);
    });

    searchBox_2.addListener("places_changed", () => {
        const places = searchBox_2.getPlaces();
        !success_first_distance && map_bounce_to(places);
        click_2nd = places[0].formatted_address;
        click_1st && click_2nd && the_routes(directionsService, directionsRenderer, click_1st, click_2nd);
    });
};


function map_bounce_to(place) {
    custom_mark(place[0].geometry.location);
    if (place[0].geometry.viewport) {
        bounds.union(place[0].geometry.viewport);
    } else {
        bounds.extend(place[0].geometry.location);
    };
    map.fitBounds(bounds);
};


function geocode_recording(latLng) {
    geocoder
        .geocode({
            location: latLng
        })
        .then((response) => {
            if (!click_1st) {
                console.log(response.results[0].formatted_address)
                click_1st = response.results[0].formatted_address;
                first_location.value = response.results[0].formatted_address;
            } else {
                click_2nd = response.results[0].formatted_address;
                second_location.value = response.results[0].formatted_address;
                the_routes(directionsService, directionsRenderer, click_1st, click_2nd);
            };
        })
        .catch((e) => {
            console.log(e)
        });
};



function the_routes(directionsService, directionsRenderer, first, second) {
    directionsService
        .route({
            origin: {
                query: first,
            },
            destination: {
                query: second,
            },
            travelMode: google.maps.TravelMode[travel_model],
        })
        .then((response) => {
            custom_markers_array[0].setMap(null);
            custom_markers_array[1].setMap(null);
            directionsRenderer.setDirections(response);
            success_first_distance = true;

            var res_info = response.routes[0].legs[0];
            last_time_start_address = res_info.start_address;
            last_time_end_address = res_info.end_address;
            
            response_map_display.innerText = `${res_info.start_address} to ${res_info.end_address} d ${res_info.distance.text}les t ${res_info.duration.text}`;
            
        })
        .catch(() => {
            if (!success_first_distance) {
                custom_markers_array[0].setMap(null);
                custom_markers_array[1].setMap(null);

                while (custom_markers_array.length) {
                    custom_markers_array.pop();
                };

                click_1st = null;
                click_2nd = null;
                second_location.value = null;
                first_location.value = null;
            } else {
                if( click_1st !== last_time_start_address){
                    click_1st = last_time_start_address;
                    first_location.value = last_time_start_address;
                };
                if( click_2nd !== last_time_end_address){
                    click_2nd = last_time_end_address;
                    second_location.value = last_time_end_address;
                };
            };

            response_map_display.innerText = 'Sorry, we could not calculate the directions';
        });
};