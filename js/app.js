var ViewModel = function () {

    var self = this;

    // list of locations

    self.locations = [{
            name: "Parque da Paz",
            lat: 38.663434,
            lng: -9.165485,
            type: "Public Park"
        }, {
            name: "Pita.GR",
            lat: 38.6389757,
            lng: -9.2365338,
            type: "Restaurant"
        }, {
            name: "Miradouro Boca do Vento",
            lat: 38.684681,
            lng: -9.1588817,
            type: "Belvedere"
        }, {
            name: "Vegana Burguers",
            lat: 38.732022,
            lng: -9.1469121,
            type: "Restaurant"
        }, {
            name: "Foxtrot",
            lat: 38.713905,
            lng: -9.1518868,
            type: "Bar"
        }, {
            name: "Pensão do Amor",
            lat: 38.7072048,
            lng: -9.1436212,
            type: "Bar"
        }, {
            name: "Caleidoscópio",
            lat: 38.7571159,
            lng: -9.1546839,
            type: "Study Spot"
        },

    ];

    // Create observable array
    self.nav = ko.observableArray(
        self.locations);

    // Create empty observable string
    self.filter = ko.observable('');

    // Show nav and filter
    self.filteredNav = ko.computed(
        function () {
            var filter = self.filter()
                .toLowerCase();
            if (!filter) {
                return self.nav();
            }
            return self.nav().filter(
                function (i) {
                    // Check for proper casing or lowercase
                    return i
                        .name
                        .toLowerCase()
                        .indexOf(
                            filter
                        ) >
                        -1 ||
                        i.name
                        .indexOf(
                            filter
                        ) >
                        -1;
                });
        });

    // Highlight active list item when clicking list item or marker
    self.highlightListItem =
        function (obj) {
            // Set location name depending on argument passed:
            // List item returns object
            // Marker returns string
            var location_name;
            if (typeof obj ===
                "string")
                location_name = obj;
            else if (typeof obj ===
                "object")
                location_name = obj
                .name;

            var target = $(
                ".mdl-navigation a:contains(" +
                location_name +
                ")");
            $(".mdl-navigation a").removeClass(
                "mdl-navigation__link--current"
            );
            $(target).addClass(
                "mdl-navigation__link--current"
            );
        };

    // Initialize locationInfo function as an observable
    self.panToLocation = ko.observable();

    self.location_array = ko.observableArray();
    self.infowindow_array = ko.observableArray();

    self.clickListItem = function (
        obj) {
        self.highlightListItem(
            obj);
        self.panToLocation(obj);
    };


};

// Load Knockout.js or fail gracefully with error message and page reload link
if (typeof ko === 'object') {
    var vm = new ViewModel();
    ko.applyBindings(vm);
} else {
    $("#error_msg").html(
        'Error: Knockout.js did not load. Please <a href="' +
        window.location.href +
        '">reload</a> to try again.'
    ).show();
}

// Initialize Google map
function initMap() {
    // Create variable for DOM node in which to place Google map
    var mapDiv = document.getElementById(
        'map');

    // Initialize map
    var map = new google.maps.Map(
        mapDiv, {
            zoom: 13,
            // Night mode map:
            // ref: https://developers.google.com/maps/documentation/javascript/examples/style-array
            styles: [
                {
                    elementType: 'geometry',
                    stylers: [{
                        color: '#242f3e'
                    }]
                }, {
                    elementType: 'labels.text.stroke',
                    stylers: [{
                        color: '#242f3e'
                    }]
                }, {
                    elementType: 'labels.text.fill',
                    stylers: [{
                        color: '#746855'
                    }]
                }, {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{
                        color: '#d59563'
                    }]
                }, {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{
                        color: '#d59563'
                    }]
                }, {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{
                        color: '#263c3f'
                    }]
                }, {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{
                        color: '#6b9a76'
                    }]
                }, {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{
                        color: '#38414e'
                    }]
                }, {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{
                        color: '#212a37'
                    }]
                }, {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{
                        color: '#9ca5b3'
                    }]
                }, {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{
                        color: '#746855'
                    }]
                }, {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{
                        color: '#1f2835'
                    }]
                }, {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{
                        color: '#f3d19c'
                    }]
                }, {
                    featureType: 'transit',
                    elementType: 'geometry',
                    stylers: [{
                        color: '#2f3948'
                    }]
                }, {
                    featureType: 'transit.station',
                    elementType: 'labels.text.fill',
                    stylers: [{
                        color: '#d59563'
                    }]
                }, {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{
                        color: '#17263c'
                    }]
                }, {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{
                        color: '#515c6d'
                    }]
                }, {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{
                        color: '#17263c'
                    }]
                }
            ],

            center: {
                lat: 38.6766764,
                lng: -9.184167
            },
            // Hide Map/Satellite links for better responsive experience
            disableDefaultUI: true
        });

    // Animate marker on click
    // ref: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    function toggleBounce(marker) {
        if (marker.getAnimation() !==
            null) {
            marker.setAnimation(null);
        } else {
            // Bounce twice (bounce = 750ms)
            marker.setAnimation(google.maps
                .Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(
                    null);
            }, 1500);
        }
    }

    var closeAllInfoWindows = function () {
        var i = 0;
        for (i; i < vm.locations.length; i++) {
            vm.infowindow_array[i].close();
        }
    };

    vm.panToLocation = function (
        location) {
        var name = (location.title) ?
            location.title :
            location.name;
        var lat = (location.position) ?
            location.position.lat() :
            location.lat;
        var lng = (location.position) ?
            location.position.lng() :
            location.lng;

        map.panTo({
            lat: lat,
            lng: lng
        });

        closeAllInfoWindows();

        // 1. Open infowindow when clicking marker
        // 2. Animate marker on click
        var i = 0;
        for (i; i < vm.locations.length; i++) {
            if (vm.locations[i].name ===
                name) {
                vm.infowindow_array[
                    i].open(map,
                    vm.location_array[
                        i]);
            }
        }
        vm.updateJson();

    };

    var clickMarker = function () {
        vm.highlightListItem(this.title);
        vm.panToLocation(this);
    };


    var setLocationInfo = function () {
        var i = 0;
        for (i; i < vm.locations.length; i++) {
            vm.location_array[i] =
                new google.maps.Marker({
                    map: map,
                    position: {
                        lat: vm
                            .locations[
                                i
                            ].lat,
                        lng: vm
                            .locations[
                                i
                            ].lng
                    },
                    title: vm.locations[
                        i].name,
                    type: vm.locations[
                        i].type,
                    animation: google
                        .maps.Animation
                        .DROP
                });


            vm.infowindow_array[i] =
                new google.maps.InfoWindow({
                    content: '<h1 class="places">' +
                        vm.locations[
                            i].name +
                        '</h1><br>' +
                        '<p>' +
                        vm.locations[
                            i].type +
                        '</p><br>' +
                        '<img class="images" src= http://maps.googleapis.com/maps/api/streetview?size=200x100&location=' +
                        vm.locations[
                            i].lat +
                        ',' +
                        vm.locations[
                            i].lng +
                        '>'
                });

            // Add event listeners to handle info display on marker click
            vm.location_array[i].addListener(
                'click',
                clickMarker);

        }
    };

    setLocationInfo();

}

// Get Google Maps script or fail gracefully with error message and page reload link

var map_url =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCDm6-E4pK_fRcLMpRYEMnnaPKXYjl7aw";

$.getScript(map_url)
    .done(function () {
        initMap();
    })
    .fail(function () {
        $("#error_msg").html(
            'Error: Map data did not load. Please <a href="' +
            window.location.href +
            '">reload</a> to try again.'
        ).show();
    });

// Cache .getScript AJAX request
$.ajaxSetup({
    cache: true
});