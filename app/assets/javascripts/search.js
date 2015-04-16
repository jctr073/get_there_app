/**
 * Created by jctr073 on 4/14/15.
 */
$(document).ready(function () {
    $elm = $('#event-list');

    $.ajax({
        type: "GET",
        url: "/search.json",
        dataType: "json",
        success: function (resp) {
            //console.log(resp);
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
    $mbody.append(event.startDate + " - " + event.endDate);

}