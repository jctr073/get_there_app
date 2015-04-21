/**
 * Created by jctr073 on 4/14/15.
 */
$(document).ready(function () {
    $wel = $('#welcome');
    $elm = $('#event-list');
    $map = $('#map-canvas');

    $('#frmSearch').keypress(function (event) {
        if (event.which == 13) {
            $('#search').trigger('click');
        }
    })
    
    $('#new-search').keypress(function (event) {  //adding reload functionality to the "new search" button
        window.location.reload();
    })


    $('#search').click(function(){

        console.log('startDate: ' + $('#startDate').val());
        $wel.addClass("hidden");
        $.ajax({
            type: "POST",
            url: "/search.json",
            dataType: "json",
            data: { search: {
                    keywords: $('#keywords').val(),
                    city: $('#city').val(),
                    state: $('#state').val()
                }
            },
            success: function (resp) {

                if (resp.pagination.object_count > 0) {
                    // Setup map
                    var event1 = resp.events[0];
                    console.log(event1);
                    var mapOptions = {
                        center: { lat: Number(event1.venue.latitude), lng: Number(event1.venue.longitude)},
                        zoom: 13
                    };
                    var map = new google.maps.Map(document.getElementById('map-canvas'),
                        mapOptions);

                    loadEvents(resp, map);
                } else {
                    noResults();
                }

            }
        });
    })

});

function noResults () {
    $elm.empty();
    $map.empty();
    $elm.html("No results for search.");
}
function loadEvents (resp, map) {
    $elm.empty();
    var events = resp.events;
    for (var i = 0; i < events.length; i++) {
        curEvent = events[i];
        writeEventListing( $elm, curEvent );
        plotMapPoints( i, map, curEvent );
    }
}

function writeEventListing($domElm, curEvent) {

    var $media = $('<div class="media"></div>').appendTo($domElm);
    var $a     = $('<a class="pull-left" href="#"></a>').appendTo($media);

    if (curEvent.logo != null) {
        var $img   = $('<img class="media-object img-thmb" src="'+ curEvent.logo.url +'" alt="">').appendTo($a);
    }

    var $mbody = $('<div class="media-body"></div>').appendTo($media);
    var $h5    = $('<h5 class="media-heading">'+ curEvent.name.text +'</h5>').appendTo($mbody);

    //$($media).find('a.media-heading').html(curEvent.title);
    //$mbody.append(curEvent.category.name + "<br>");
    $mbody.append("Start: " + formatDate12HR(curEvent.start.local) + "<br>");
    $mbody.append("End:   " + formatDate12HR(curEvent.end.local));

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
        
    
     var nextMkr = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: gmap,
                icon: icon1+itr+icon2, //creating unique markers dynamically 
                title: title
            });

              var infoWindowOptions = {
                content: veName+"<br />"+veAddr+"<br />"+veCity+"<br />"+
                'Starts: '+ev_sd+"<br />"+'Ends: '+ev_ed + "<br />"+
                '<a href="'+ ev_url +'" target="_blank">more info</a>' //modifying external url functionality
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