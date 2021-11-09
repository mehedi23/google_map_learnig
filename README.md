## Make sure initMap() match with the CDN link callback function.

1. `new google.maps.LatLngBounds()` known as `bounds` use for viewport. For example, search a location and it will jump that viewport are.
2. `new google.maps.Geocoder()` known as geocoder use for get address name or latlng.
3. `new google.maps.InfoWindow()` use for show info or data on display.
4. `new google.maps.places.SearchBox(input_values)` use for autocomplete search location and for this make sure you had this with your cdn `libraries=places`.

For getting the route direction need to use two contractor and those can carry dynamic value like draggable or init map:
- `new google.maps.DirectionsService()`
- `new google.maps.DirectionsRenderer()`



### Getting the address or location with geocode service.
```js
function geocode_recording(latLng) {
    geocoder
        .geocode({
            location: latLng
        })
        .then(response => console.log(response))
        .catch( e => console.log(e));
};
```

### Getting the distance between origin and destination. in my code I use this function as `the_routes()`.
```js
function show_routes_between(directionsService, directionsRenderer) {
    directionsService
        .route({
            origin: {
                query: first_location,
            },
            destination: {
                query: second_location,
            },
            travelMode: google.maps.TravelMode[travel_model],
        })
        .then((response) =>  console.log(e))
        .catch((e) =>  console.log(e));
};
```