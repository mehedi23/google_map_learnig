var map;
var geocoder;
var click_1st = null;
var click_2nd = null;
var directionsService;
var directionsRenderer;
var all_custom_markers = []

var action_btn = document.querySelector('.action-button');
var first_input = document.getElementById("first_location");
var travel_model = document.getElementById('travel_model_val').value;
var first_location = document.getElementById("first_location");
var second_location = document.getElementById("second_location");


function initMap() {
    // map init
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: {
            lat: 41.85,
            lng: -87.65
        },
    });


    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map
    });

    directionsRenderer.setMap(map);

    const onChangeHandler = function (e , click_val) {
        click_val = e.target.value

        // console.log("click_1st", click_val)
        // calculateAndDisplayRoute(directionsService, directionsRenderer);
    };


    first_location.addEventListener("change" ,  e => onChangeHandler(e, click_1st));
    second_location.addEventListener("change" , e => onChangeHandler(e, click_2nd));


    search_box();


    let infoWindow = new google.maps.InfoWindow();
    infoWindow.open(map);

    geocoder = new google.maps.Geocoder();

    document.getElementById('travel_model_val').addEventListener("change", travel_model_selector);

    const labels = "AB"

    map.addListener("click", (e) => {

        if(all_custom_markers.length < 2){
            const single_markers =  new google.maps.Marker({
                                        position: e.latLng,
                                        map: map,
                                        zoom: 14,
                                        draggable: true,
                                        clickable: true,
                                        label: !click_1st ? labels[0] : labels[1],
                                    });
    
            all_custom_markers.push(single_markers);
        };
        
        !click_2nd && geocode_recording(e.latLng);
    });

    function travel_model_selector() {
        travel_model = this.value;
        click_1st && click_2nd && calculateAndDisplayRoute(directionsService, directionsRenderer, click_1st, click_2nd);
    };



};





function calculateAndDisplayRoute(directionsService, directionsRenderer, first, second) {


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
            all_custom_markers[0].setMap(null);
            all_custom_markers[1].setMap(null);
            directionsRenderer.setDirections(response);
        })
        .catch((e) =>  {
            all_custom_markers[1].setMap(null);
            all_custom_markers.splice(1, 1);
            click_2nd = null;
            console.log("Directions request failed due to " + e)
        });
};



function search_box() {
    new google.maps.places.SearchBox(first_location);
    new google.maps.places.SearchBox(second_location);
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
                calculateAndDisplayRoute(directionsService, directionsRenderer, click_1st, click_2nd);
            };

        })
        .catch((e) => {
            console.log(e)
        });
};



action_btn.addEventListener("click", function () {
    click_1st && click_2nd && calculateAndDisplayRoute(directionsService, directionsRenderer, click_1st, click_2nd);
});

