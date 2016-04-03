//Request for episodes currently in translation
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
