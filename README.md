# Neighborhood Map Project

The goal of this project is to develop a single-page application featuring a map of a neighborhood (In my case, Lisbon & Margem Sul)

## What I'll see?
* This project is built using Google Maps API, Google Street View Image API, Flickr API andknockoutjs framework. Features Include:
* A full-screen map to page using the Google Maps API.
* A Street View Image of the location
* Map markers identifying a number of favorite locations in Lisbon & Margem Sul
* Images of the locations, from Flickr
* List view of the identified locations.

## How to run?

1.1 Open [inesarmadabras.github.io/Neighborhood-Map-Project/](https://inesarmadabras.github.io/Neighborhood-Map-Project/) 
or
1.2 Download the repo. Just launch index.html.
2. Use the filter box to filter list items.
3. Click a list item to move to the corresponding map marker and view more info.

## Resubmission Updates

### index.html - Sugestions
`l.6` (1) Added theme-color
        <meta name="theme-color" content="#0066FF">
`l.9` (2) Added favicon
        <link rel="icon" sizes="150x150" href="icon.png">

`l.12` (3) App is usable on small screen devices. Now you can see a menu button at the corner (only at mobile view)
        
```
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://code.getmdl.io/1.2.1/material.indigo-pink.min.css">
<script defer src="https://code.getmdl.io/1.2.1/material.min.js"></script>
```

`All` (4) More HTML semantic tags.Indentation.

`l.47` (5) All scripts are now at the bottom of the HTML body for Page Speed Optimization
`l.53` (7) Moved GoogleMaps API request from app.js to index.html. Request Google Map API using async.

### index.html - Required
`l.48` (6) async atribute removed.

### app.js - Sugestions
`l.1` (1) API keys are now at the top of the file
`All` (2) single-quotes (') over double-quotes (")
`l.7` (3) added new locations.
`l.121` (6) Now I don't use JS to request Google Map API. Example send by the last revisor: [Example](http://codepen.io/NKiD/pen/XNrYXa)

``` javascript
initMap = () => {...};
mapError = () => {
  alert('Error: Map data did not load. Please reload to try again.');
};
```

### app.js - Required
`l.8` (4) All locations show flickr images.
`l.121` (5) getJSON() and srcs(data) repeated calls have been removed. Now at only at the setLocationInfo function (`l.310`)

`l.56´ and `l.281´ (7) Need Help at this part! How can I filter the markers? What I've done: When a marker is clicked, it's the only one visible (this part is commented)


## Question to the revisor:
This is my last project and my nanodegree subscription ends on 5 November. If, after you review my project, I've some corrections to do and do the resubmission on 5 November, will I lose my whole progress anyway? :(

How can I filter the markers? I don't understand the sugestion made for the revisor. I've tried everything, but I couldn't find a way no apply `marker.setVisible(false);` or `marker.setMap(null)`. I don't know if it's compatible with the way that my app is done. 
``` javascript
  self.filteredNav = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return self.nav();
        }
        return self.nav().filter(function(i) {
            // Check for proper casing or lowercase
            return i.name.toLowerCase().indexOf(filter) > -1 || i.name.indexOf(filter) > -1;
        });
    ```

