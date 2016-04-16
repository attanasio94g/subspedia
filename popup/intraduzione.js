// Copyright (c) 2016 Giuseppe Attanasio
// License: Academic Free License ("AFL") v. 3.0
// AFL License page: http://opensource.org/licenses/AFL-3.0
// giuseppeattanasio.me - https://github.com/master94ga

//Request for episodes currently in traduciont
$.ajax({
    url: 'http://www.subspedia.tv/traduzioni.php',
    dataType: "html",
    success: function(data) {
        var found = false;
        var strippedData = data.replace(/src='(?:[^'\/]*\/)*([^']+)'/g, "");
        $(strippedData).find('.itemListaSerie').each(function() {

            var $series = $('<div>', {
                'class':'title_in_trad'
            }).appendTo('.serieintraduzione');

            var $text = $("<h7></h7>").text($(this).attr('title')).appendTo($series);

            var $link = $('<a>',{
                'class': 'info',
                'href':  'http://www.subspedia.tv/traduzioni.php',
                'target': '_blank'
            }).appendTo($text);

            $('<i>',{
                'class': 'fa fa-info-circle'
            }).appendTo($link);

            found = true;
        });
        if (!found)
        {
            $('<h5></h5>',{
                'class': 'no_serie'
            }).text('Nessuna serie in traduzione.').appendTo('.serieintraduzione');
        }
        $("#loading").hide();
    }
});

$("#clearbadge").click(function(){
    clearBadge();
});
