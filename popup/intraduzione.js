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

            var $title = $("<div class='title_in_trad'><h7>"+$(this).attr('title')+"" +
                "<a class='info' href='http://www.subspedia.tv/traduzioni.php' target='_blank'><i class='fa fa-info-circle'></i></a></h7><br></div>");

            $('.serieintraduzione').append($title);
            found = true;
        });
        if (!found)
        {
            $('.serieintraduzione').append("<h5 class='no_serie'>Nessuna serie in traduzione.</h5>");
        }
        $("#loading").hide();
    }
});

$("#clearbadge").click(function(){
    clearBadge();
});
