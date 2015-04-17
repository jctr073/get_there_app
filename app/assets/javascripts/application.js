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
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

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
        