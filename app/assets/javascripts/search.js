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
            console.log(resp);
            loadEvents(resp);
        }
    });
});

function loadEvents (col) {

    var events = col.events;
    for (var i = 1; i < events.length; i++) {
        obj = events[i];

        if (obj.hasOwnProperty('event')) {
            //console.log(obj.event.title);
            writeEventListing(
                $elm,
                obj.event.title,
                obj.event.logo,
                obj.event.start_date,
                obj.event.end_date
            );
        }
    }
}

function writeEventListing(domElm, title, logoPath, startDate, endDate) {
    //console.log(title);
    //$('<p></p>').appendTo(domElm).html('test');

    $media = $('<div class="media"></div>').appendTo(domElm);
    $a     = $('<a class="pull-left" href="#"></a>').appendTo($media);
    $img   = $('<img class="media-object" src="" alt="">').appendTo($a);

    $mbody = $('<div class="media-body"></div>').appendTo($media);
    $h4    = $('<h4 class="media-heading">Something</h4>').appendTo($mbody);

    //$img.src(logoPath);
    $h4.html(title);
    //$mbody.html(startDate + " - " + endDate);
    console.log($media);

}