// Copyright (c) 2016 Giuseppe Attanasio
// License: Academic Free License ("AFL") v. 3.0
// AFL License page: http://opensource.org/licenses/AFL-3.0
// giuseppeattanasio.me - https://github.com/master94ga

function loadData()
{
    $.getJSON( "http://www.subspedia.tv/API/getByDataUscita.php", function( data) {
        $("#loading").hide();
        var i = 0;

        while (i < 10)
        {
            var $episode = $('<div>', {
                'class':'new_ep'
            }).appendTo('.lastrelease');

            var $text = $("<h7></h7>").text(data[i].nome_serie+" S"+data[i].num_stagione+"E"+data[i].num_episodio).appendTo($episode);

            var $link = $('<a>',{
                'class': 'download',
                'href':  data[i].link_file,
                'download': data[i].nome_serie.replace("'" ,"")+ ' S'+data[i].num_stagione+'E'+data[i].num_episodio+data[i].link_file.slice(-4)
            }).appendTo($text);

            $('<i>',{
                'class': 'fa fa-download'
            }).appendTo($link);

            i++;
        }
    });
}

$("#clearbadge").click(function(){
    clearBadge();
});

document.addEventListener('DOMContentLoaded', loadData);
