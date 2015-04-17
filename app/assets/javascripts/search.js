/**
 * Created by jctr073 on 4/14/15.
 */
$(document).ready(function () {
    $elm = $('#event-list');
    $map = $('#map-canvas');

    $.ajax({
        type: "GET",
        url: "/search.json",
        dataType: "json",
        success: function (resp) {
            // Setup map
            var event1 = resp.events[1].event;

            var mapOptions = {
                center: { lat: event1.venue.latitude, lng: event1.venue.longitude},
                zoom: 13
            };
            var map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);

            loadEvents(resp);
        }
    });
});

function loadEvents (col) {

    var events = col.events;
    for (var i = 1; i < events.length; i++) {
        obj = events[i];

        if (obj.hasOwnProperty('event')) {
            writeEventListing( $elm, obj.event );
            plotMapPoints( $map, obj.event );
        }
    }
}

function writeEventListing($domElm, event) {

    $media = $('<div class="media"></div>').appendTo($domElm);
    $a     = $('<a class="pull-left" href="#"></a>').appendTo($media);
    $img   = $('<img class="media-object img-thmb" src="'+ event.logo +'" alt="">').appendTo($a);

    $mbody = $('<div class="media-body"></div>').appendTo($media);
    $h5    = $('<h5 class="media-heading">'+ event.title +'</h5>').appendTo($mbody);

    //$($media).find('a.media-heading').html(event.title);
    $mbody.append(event.start_date + " - " + event.end_date);

}
function plotMapPoints($map, curEvent) {
    //TODO: map the current event

}