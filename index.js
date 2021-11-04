var map;
var geocoder;
var click_1st = null;
var click_2nd = null;


function initMap() {
    // map init
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: {
            lat: 41.85,
            lng: -87.65
        },
    });



    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map
    });


    directionsRenderer.setMap(map);

    const onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    };


    document.getElementById("first_location").addEventListener("change", onChangeHandler);
    document.getElementById("second_input").addEventListener("change", onChangeHandler);

    search_box();
    // on_click_marker();


    geocoder = new google.maps.Geocoder();

    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow();

    infoWindow.open(map);

    map.addListener("click", (e) => {
        geocode_address(e.latLng);

        // console.log( "1", click_2nd)
        // console.log( "2", click_1st)


        if (click_1st) {
            // console.log("now go")
            console.log("1", click_2nd)
            calculateAndDisplayRoute(directionsService, directionsRenderer);
        }
    });
}



function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService
        .route({
            origin: {
                query: click_1st,
            },
            destination: {
                query: click_2nd,
            },
            travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
            directionsRenderer.setDirections(response);
        })
        .catch((e) => console.log("Directions request failed due to " + e));
}



function search_box() {
    const first__input = document.getElementById("first_location");
    const second__input = document.getElementById("second_input");

    new google.maps.places.SearchBox(first__input);
    new google.maps.places.SearchBox(second__input);

    // map.addListener("bounds_changed", () => {
    //     searchBox.setBounds(map.getBounds());
    // });

    // searchBox.addListener("places_changed", () => {
    //     const places = searchBox.getPlaces();
    // })
}



function geocode_address(lat_lng) {
    geocoder
        .geocode({
            location: lat_lng
        })
        .then((response) => {
            if (!click_1st) {
                // console.log("firs")
                click_1st = response.results[0].formatted_address
            } else {
                // console.log(click_1st)
                click_2nd = response.results[0].formatted_address
            };

        })
        .catch((e) => {
            console.log(e)
        })
};

var marker
var marker_item = []

function on_click_marker() {
    google.maps.event.addListener(map, 'click', function (e) {

        placeMarker(e.latLng);

        const lat_lng = {
            lat: parseFloat(e.latLng.lat()),
            lng: parseFloat(e.latLng.lng()),
        };

        car_lat_lan = lat_lng
        // geocode_address(lat_lng);
    });
}

function placeMarker(location) {
    if (marker_item.length < 2) {
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
            clickable: true
        });
    } else {
        marker.setPosition(location);
    }
    marker_item.push(marker);
};