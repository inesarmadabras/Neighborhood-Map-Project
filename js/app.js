//(1) Resubmission -  API keys are now at the top of the file
//(2) Resubmission -  single-quotes (') over double-quotes (")
var flickrKey = '04ae986d31f8a3d5993799e1d88c48c5';
// Night mode map:
// ref: https://developers.google.com/maps/documentation/javascript/examples/style-array
var styles = [
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
                color: '746855'
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
        }];
var ViewModel = function() {
    var self = this;
    // (3) Resubmission - added new locations.
    // (4) Resubmission - All locations show flickr images
    self.locations = [{
        name: 'Parque da Paz',
        lat: 38.663434,
        lng: -9.165485,
        type: 'Public Park'
    }, {
        name: 'Miradouro Boca do Vento',
        lat: 38.684681,
        lng: -9.1588817,
        type: 'Belvedere'
    }, {
        name: 'Casa do Alentejo',
        lat: 38.7158848,
        lng: -9.1422239,
        type: 'Restaurant'
    }, {
        name: 'Jardim da Estrela',
        lat: 38.715134,
        lng: -9.1594065,
        type: 'Public Park'
    }, {
        name: 'Miradouro Santa Catarina',
        lat: 38.709626,
        lng: -9.1474478,
        type: 'Belvederet'
    }, {
        name: 'Foxtrot',
        lat: 38.713905,
        lng: -9.1518868,
        type: 'Bar'
    }, {
        name: 'Pensão do Amor',
        lat: 38.7072048,
        lng: -9.1436212,
        type: 'Bar'
    }, {
        name: 'Caleidoscópio',
        lat: 38.7571159,
        lng: -9.1546839,
        type: 'Study Spot'
    }];

    // Create observable array
    self.nav = ko.observableArray(self.locations);

    // Create empty observable string
    self.filter = ko.observable('');
    // Show nav and filter
    //(7) Resubmission  - Need Help at this part! How can I filter the markers?
    self.filteredNav = ko.computed(function() {

     var filter = self.filter().toLowerCase();

        if (!filter) {
            return self.nav();
        }
        return self.nav().filter(function(i) {
            // Check for proper casing or lowercase
            return i.name.toLowerCase().indexOf(filter) > -1 || i.name.indexOf(filter) > -1;


        });
    });

    //ALTERNATIVE
    /*  self.filteredNav = ko.computed(function() {

     var filter = self.filter().toLowerCase();

        if (!filter) {
            for (var i = 0; i < location_array()[i].length; i++) {

                location_array()[i].setVisible(true);
            }
            return self.nav();
        }
        return self.nav().filter(function(i) {
            // Check for proper casing or lowercase
             var match = i.name.toLowerCase().indexOf(filter) > -1 || i.name.indexOf(filter) > -1;
             location_array()[i].setVisible(match);
            return match;


        });
    });*/

        // Highlight active list item when clicking list item or marker
    self.highlightListItem = function(obj) {
        // console.log(this.locations[0].name);
        // Set location name depending on argument passed:
        // List item returns object
        // Marker returns string
        var location_name;
        if (typeof obj === 'string') location_name = obj;
        else if (typeof obj === 'object') location_name = obj.name;

        var target = $('.mdl-navigation a:contains(' + location_name + ')');
        $('.mdl-navigation a').removeClass('mdl-navigation__link--current');
        $(target).addClass('mdl-navigation__link--current');
    };

    // Initialize locationInfo function as an observable
    self.panToLocation = ko.observable();
    self.location_array = ko.observableArray();
    self.infowindow_array = ko.observableArray();

    self.clickListItem = function(obj) {
        self.highlightListItem(obj);
        self.panToLocation(obj);

    };

    // Set default coordinates
    self.lat = ko.observable(38.6766764);
    self.lon = ko.observable(-9.184167);
    // Set default Flickr API call
    self.flickrApi = ko.observable('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrKey + '&safe_search=1&per_page=10&lat=' + self.lat() + '&lon=' + self.lon() + '&format=json&jsoncallback=?');

    // Create empty observable array
    self.srcs = ko.observableArray();

    self.updateJson = ko.observable();

    // Load Flickr data or fail gracefully with error message and page reload link
    //(5) - Resubmission - getJSON() and srcs(data) repeated calls have been removed. Now at only at the setLocationInfo function.

};

// Load Knockout.js or fail gracefully with error message and page reload link
if (typeof ko === 'object') {
    var vm = new ViewModel();
    ko.applyBindings(vm);
} else {
    alert('Error: Knockout.js did not load.Please reload to try again.');

}

// (6) Resubmission - Now I don't use JS to request Google Map API. Example send by the last revisor: http://codepen.io/NKiD/pen/XNrYXa
initMap = () => {
    // Create variable for DOM node in which to place Google map
    var mapDiv = document.getElementById('map');

    // Initialize map
    var map = new google.maps.Map(mapDiv, {
        zoom: 13,
        styles: styles,
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
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1500);
        }
    }

    var closeAllInfoWindows = function() {
        for (var i = 0; i < vm.locations.length; ++i) {
            vm.infowindow_array[i].close();
        }
    };


    vm.panToLocation = function(location) {
        var name = (location.title) ? location.title : location.name;
        var lat = (location.position) ? location.position.lat() : location.lat;
        var lng = (location.position) ? location.position.lng() : location.lng;

        map.panTo({
            lat: lat,
            lng: lng
        });
        closeAllInfoWindows();
        // 1. Open infowindow when clicking marker
        // 2. Set latitude and longitude for Flickr API call
        // 3. Animate marker on click
        for (var i = 0; i < vm.locations.length; i++) {
            //(7) Resubmission - When a marker is clicked, it's the only one visible
              // vm.location_array()[i].setVisible(true); /*7.1 uncoment this line */

            if (vm.locations[i].name === name) {
                vm.infowindow_array[i].open(map, vm.location_array()[i]);
                vm.lat(vm.locations[i].lat);
                vm.lon(vm.locations[i].lng);
                toggleBounce(vm.location_array()[i]);
            }
            /*7.2 uncomment the next segment */
            /*else {
             vm.location_array()[i].setVisible(false);
            }*/
        }

        vm.flickrApi('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrKey +
            '&safe_search=1&per_page=10&lat=' + vm.lat() + '&lon=' + vm.lon() + '&text=' + name +
            '&sort=relevance&format=json&jsoncallback=?');
        vm.updateJson();

    };

    var clickMarker = function() {
        vm.highlightListItem(this.title);
        vm.panToLocation(this);
    };

    var setLocationInfo = function() {
        // Get Flickr data or fail
        // (5) Resubmission - getJSON() and srcs(data) repeated calls have been removed
        vm.updateJson = function() {
            $.getJSON(vm.flickrApi())
                .done(function(data) {
                    vm.srcs(data);
                })
                .fail(function() {
                    alert('Error: Flickr data did not load.Please reload to try again.');
                });

        };

        for (var i = 0; i < vm.locations.length; i++) {
            //initialize markers

            vm.location_array()[i] = new google.maps.Marker({
                map: map,
                position: {
                    lat: vm.locations[i].lat,
                    lng: vm.locations[i].lng
                },
                title: vm.locations[i].name,
                type: vm.locations[i].type,
                animation: google.maps.Animation.DROP
            });


            vm.infowindow_array[i] = new google.maps.InfoWindow({
                content: '<h1 class="places">' + vm.locations[i].name + '</h1><br>' + '<p>' + vm.locations[i].type + "</p><br>" +
                    '<img class="images" src= http://maps.googleapis.com/maps/api/streetview?size=200x100&location=' + vm.locations[i].lat +
                    ',' + vm.locations[i].lng + '>'




            });

            // Add event listeners to handle info display on marker click
            vm.location_array()[i].addListener('click', clickMarker);


        }
    };

    setLocationInfo();
};
mapError = () => {
    alert('Error: Map data did not load. Please reload to try again.');
};

// Cache .getScript AJAX request
$.ajaxSetup({
    cache: true
});
