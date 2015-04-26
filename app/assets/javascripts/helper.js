
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