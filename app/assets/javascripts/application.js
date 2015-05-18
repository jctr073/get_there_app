// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//  danabase was here

//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(document).ready(function () {

    //set default values
    $('#state').val('CA');
    $('#city').val('San Francisco');

    thisPage = 1;
    resultCount = 0;
    $wel = $('#welcome');
    $alt = $('div.alert');
    $pgr = $('#event-pager-container');
    $elm = $('#event-list');
    $map = $('#map-canvas');

    $('#frmSearch').keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#search').trigger('click');
        }
    });

    $('#clear').click(function() {  //adding reload functionality to the "new search" button
        window.location.reload();
    });

    $('#search').click(function(){
        $('#btn-collapse-1').trigger('click'); //Collapse menu
        getEvents();
    });

});

function getEvents (page) {

    var curPage = typeof page == 'undefined' ? 1 : page;
    $wel.addClass("hidden");
    $alt[0].className = "alert alert-info";
    $alt.html("Search in progress...");

    $.ajax({
        type: "POST",
        url: "/search.json",
        dataType: "json",
        data: { search: {
                keywords: $('#keywords').val(),
                city: $('#city').val(),
                state: $('#state').val(),
                fromDt: $('#fromDt').val(),
                toDt: $('#toDt').val()
            }, page: curPage
        },
        success: function (resp) {
            var srchInfo = resp.pagination;
            resultCount = srchInfo.object_count;
            if (resultCount > 0) {

                var alertMsg = resultCount + " item(s) found <br>";
                alertMsg += "Showing page " + srchInfo.page_number;
                alertMsg += " of " + srchInfo.page_count;

                $alt[0].className = "alert alert-success";
                $alt.html(alertMsg);
                setPagination($pgr, srchInfo.page_count);

                // Setup map
                var event1 = resp.events[0];
                var mapOptions = {
                    center: {
                        lat: Number(event1.venue.latitude),
                        lng: Number(event1.venue.longitude)
                    },
                    zoom: 13
                };
                var map = new google.maps.Map(
                    document.getElementById('map-canvas'),
                    mapOptions
                );
                loadEvents(resp, map);
            } else {
                noResults();
            }
        },
        error: function (resp) {
            $alt[0].className = "alert alert-danger";
            $alt.html(resp.status + ": " + resp.statusText);
        }
    });
}

function setPagination($eventPagerContainer, pageCount) {
    var ul = document.createElement("ul");
    ul.id = "pagination";
    ul.className = "pagination-sm";
    $eventPagerContainer.append(ul);
    var showPageNumber = (pageCount > 10) ? 10 : pageCount;

    $('#pagination').twbsPagination({
        totalPages: pageCount,
        visiblePages: showPageNumber,
        onPageClick: function (event, page) {
            getEvents(page);
        }
    });
}

function noResults () {
    $elm.empty();
    $map.empty();
    $alt[0].className = "alert alert-warning";
    $alt.html("No results for search.");
}
function loadEvents (resp, map) {
    $elm.empty();
    var events = resp.events;
    for (var i = 0; i < events.length; i++) {
        curEvent = events[i];
        writeEventListing( i, $elm[0], curEvent );
        plotMapPoints( i, map, curEvent );
    }
}

function writeEventListing(itr, domElm, curEvent) {
    itr++;
    //Create the elements
    var doc     = window.document;
    var media   = doc.createElement("div");
    var a       = doc.createElement("a");
    var a2      = doc.createElement("a");
    var mbody   = doc.createElement("div");
    var h5      = doc.createElement("h5");

    //assign bootstrap classes
    media.className = "media";
    a.className     = "pull-left";
    mbody.className = "media-body";
    h5.className    = "media-heading";
    h5.innerText    = itr + ": " + curEvent.name.text;

    //assemble elements
    $(domElm).append(media);
    media.appendChild(a);
    if (curEvent.logo != null) {
        var img       = doc.createElement("img");
        img.src       = curEvent.logo.url;
        img.className = "media-object img-thmb";
        a.appendChild(img);
    }
    media.appendChild(mbody);
    a2.appendChild(h5);
    a2.href = "/events/" + curEvent.id;
    mbody.appendChild(a2);
    var cat    = (curEvent.category != null)? curEvent.category.name : "";
    var subCat = (curEvent.subcategory != null)? "/" + curEvent.subcategory.name + "<br>" : "";
    $(mbody).append(cat + subCat);
    $(mbody).append("Start: " + formatDate12HR(curEvent.start.local) + "<br>");
    $(mbody).append("End:   " + formatDate12HR(curEvent.end.local));
    $(domElm).append("<hr>");
}

function plotMapPoints(itr, gmap, curEvent) {

    //variables for markers
    itr++;
    var icon1 = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='; //building icon
    var icon2 = '|FF0000|000000'; //building icon
    var lat = curEvent.venue.latitude;
    var lng = curEvent.venue.longitude;
    var title = curEvent.title;
    // console.log($map);

    var veName = curEvent.venue.name;
    var veAddr = curEvent.venue.address.address_1;
    var veCity = curEvent.venue.address.city;
    var ev_sd  = formatDate12HR(curEvent.start.local);
    var ev_ed  = formatDate12HR(curEvent.end.local);
    var ev_url = curEvent.url;

    var t;

    var nextMkr = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: gmap,
        icon: icon1+itr+icon2, //creating unique markers dynamically
        title: title
    });

    var infoWindowOptions = {
        content: '<div id="infodiv">'+ veName+"<br />"+veAddr+"<br />"+veCity+"<br />"+
        'Starts: '+ev_sd+"<br />"+'Ends: '+ev_ed + "<br />"+
        '<a href="'+ ev_url +'" target="_blank">more info</a>'+'</div>' //modifying external url functionality
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    google.maps.event.addListener(nextMkr, 'mouseover', function () {
        infoWindow.open(gmap, nextMkr);
    });

    google.maps.event.addListener(nextMkr, 'mouseout', function () {
        t = setTimeout(function () {
            infoWindow.close()
        }, 1000);
    });

    google.maps.event.addListener(infoWindow, 'domready', function () {
        $('#infodiv').on('mouseenter', function () {
            clearTimeout(t);
        }).on('mouseleave', function () {
            t = setTimeout(function () {
                infoWindow.close()
            }, 1000);
        });
    });
}



        
