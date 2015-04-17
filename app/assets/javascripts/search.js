/**
 * Created by jctr073 on 4/14/15.
 */
$(document).ready(function () {
    $wel = $('#welcome');
    $elm = $('#event-list');
    $map = $('#map-canvas');


    $('#search').click(function(){
        $wel.addClass("hidden");
        $.ajax({
            type: "POST",
            url: "/search.json",
            dataType: "json",
            data: { search: { keywords: $('#keywords').val() } },
            success: function (resp) {
                // Setup map
                var event1 = resp.events[1].event;

                var mapOptions = {
                    center: { lat: event1.venue.latitude, lng: event1.venue.longitude},
                    zoom: 13
                };
                var map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);

                loadEvents(resp, map);
            }
        });
    })

});

function loadEvents (col, map) {
    $elm.empty();
    var events = col.events;
    for (var i = 1; i < events.length; i++) {
        obj = events[i];

        if (obj.hasOwnProperty('event')) {
            writeEventListing( $elm, obj.event );
            plotMapPoints( i, map, obj.event );
        }
    }
}

function writeEventListing($domElm, event) {

    var $media = $('<div class="media"></div>').appendTo($domElm);
    var $a     = $('<a class="pull-left" href="#"></a>').appendTo($media);
    var $img   = $('<img class="media-object img-thmb" src="'+ event.logo +'" alt="">').appendTo($a);

    var $mbody = $('<div class="media-body"></div>').appendTo($media);
    var $h5    = $('<h5 class="media-heading">'+ event.title +'</h5>').appendTo($mbody);

    //$($media).find('a.media-heading').html(event.title);
    $mbody.append(event.start_date + " - " + event.end_date);

}

function plotMapPoints(itr, gmap, curEvent) {
    //TODO: map the current event
    
                                               //variables for markers
      var icon1 = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='; //building icon
      var icon2 = '|FF0000|000000'; //building icon
      var lat = curEvent.venue.latitude;
      var lng = curEvent.venue.longitude;
      var title = curEvent.title;
       // console.log($map);
       
       var veName = curEvent.venue.name;
       var veAddr = curEvent.venue.address;
       var veCity = curEvent.venue.city;
       var ev_sd  = formatDate12HR(curEvent.start_date);
       var ev_ed  = formatDate12HR(curEvent.end_date); 
        
    
     var nextMkr = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: gmap,
                icon: icon1+itr+icon2, //creating unique markers dynamically 
                title: title
            });

              var infoWindowOptions = {
                content: veName+"<br />"+veAddr+"<br />"+veCity+"<br />"+
                'Starts: '+ev_sd+"<br />"+'Ends: '+ev_ed
            };
            
            var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
            
            google.maps.event.addListener(nextMkr,'click',function(e){
              infoWindow.open(gmap, nextMkr);
  
            });
            
           

}

function formatDate12HR(date) {         //formats dates: mm/dd/yyyy 5:30PM
                            //get values
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
    
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
                            
    if (h >= 12) {
        h = hh-12;
        dd = "PM";
    }
    
    if (h === 0) {
        h = 12;
    }
                            
    m = m<10?"0"+m:m;                           
    s = s<10?"0"+s:s;

    
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    var pattern = new RegExp("0?"+hh+":"+m+":"+s);

    var replacement = h+":"+m;
  
    replacement += " "+dd;   
    var x =[month, day, year].join('/');
    date = x + " "+replacement;
    
    return date;
}