// all global variables ====================

var map;
var geocoder;
var bounds;
var infoWindow;
var click_1st = null;
var click_2nd = null;
var directionsService;
var directionsRenderer;
var custom_markers_array = [];
const labels = "AB"

var action_btn = document.querySelector('.action-button');
var first_input = document.getElementById("first_location");
var travel_model = document.getElementById('travel_model_val').value;
var first_location = document.getElementById("first_location");
var second_location = document.getElementById("second_location");



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
        click_1st = places[0].formatted_address;
        map_bounce_to(places);
    });

    searchBox_2.addListener("places_changed", () => {
        const places = searchBox_2.getPlaces();
        click_2nd = places[0].formatted_address;
        map_bounce_to(places);
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
    click_1st && click_2nd && the_routes(directionsService, directionsRenderer, click_1st, click_2nd);
};


function geocode_recording(latLng) {
    geocoder
        .geocode({
            location: latLng
        })
        .then((response) => {
            if (!click_1st) {
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
    console.log(first, second)
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
        })
        .catch((e) => {
            custom_markers_array[1].setMap(null);
            custom_markers_array.splice(1, 1);
            click_2nd = null;
            second_location.value = null;
            console.log("Directions request failed due to " + e)
        });
};