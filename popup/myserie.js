var myseries = [], loading_selector = $('#loading');

function chain_all(f, args, f_then)
{
    if (args.length > 0)
    {
        return function()
        {
            return f(args[0], chain_all(f, args.slice(1), f_then));
        }
    }
    else
    {
        return f_then;
    }
}

function loadData()
{
    loadBadge();

    var i = 0;

    //Load data from local storage
    chrome.storage.sync.get(function(items)
    {
        var ids = [];

        if (typeof items.series != 'undefined' && items.series.length != 0) {
            loading_selector.show();
            while (i < items.series.length) {
                ids[i] = {id: items.series[i].id, downloaded: items.series[i].downloaded};
                i++;
            }
            chain_all(loadLastEpisode, ids, function() { loadAllEpisodes(); })();
        }
        else {
            loading_selector.hide();
            $('.groupbox').append("<a href='../settings/settings.html' class='button' target='_blank'>Configura</a> ");
        }
    });
}

function loadLastEpisode(idserie, f_then)
{
    $.getJSON( "http://subspedia.tv/API/getBySerie.php?serie="+idserie.id, function( data) {
        var oneserie = {nome_serie: data[data.length-1].nome_serie,
                        ep_titolo: data[data.length-1].ep_titolo,
                        data_uscita: data[data.length-1].data_uscita,
                        link_file: data[data.length-1].link_file,
                        link_serie: data[data.length-1].link_serie,
                        num_episodio: data[data.length-1].num_episodio,
                        num_stagione: data[data.length-1].num_stagione,
                        immagine: data[data.length-1].immagine,
                        id: idserie.id,
                        downloaded: idserie.downloaded};

        myseries.push(oneserie);

        f_then();
    })
        .fail(function(){
            console.log("Errore nel caricale le serie.");
        });
}

function loadAllEpisodes()
{
    loading_selector.hide();

    myseries.sort(function(a, b){
        var dateA=new Date(a.data_uscita), dateB=new Date(b.data_uscita);
        return dateB-dateA;
    });

    var i = 0, ep_titolo;

    while (i < myseries.length)
    {
        if (myseries[i].ep_titolo.length>12)
        {
            ep_titolo = myseries[i].ep_titolo.substring(0, 12);
            ep_titolo = ep_titolo + '...';
        }
        else
        {
             ep_titolo = myseries[i].ep_titolo;
        }

        var $serie = $('<div>',{
            'class': 'callout series'
        }).appendTo('.groupbox');

        var $row = $('<div>',{
            'class': 'row'
        }).appendTo($serie);

        var $title = $('<div>',{
            'class': 'small-10 columns'
        }).appendTo($row);

        $('<h5>',{
            'class': 'titolo_serie'
        }).text(myseries[i].nome_serie).appendTo($title);

        var $new = $('<div>',{
            'class': 'small-2 columns'
        }).appendTo($row);

        $('<img>',{
            'class': 'float-right new_img ' +myseries[i].id,
            'src': '../img/new.png'
        }).appendTo($new);

        var $row2 = $('<div>',{
            'class': 'row'
        }).appendTo($serie);

        var $div_img = $('<div>',{
            'class': 'small-4 columns'
        }).appendTo($row2);

        var $link_img = $('<a>',{
            'href': myseries[i].link_serie,
            'target': '_blank'
        }).appendTo($div_img);

        $('<img>',{
           'class': 'float-left img_serie',
            'src': myseries[i].immagine
        }).appendTo($link_img);

        var $div_info = $('<div>',{
           'class': 'small-6 columns'
        }).appendTo($row2);

        $('<h6>').text('S' +myseries[i].num_stagione+' E'+myseries[i].num_episodio).appendTo($div_info);
        $('<h6>',{
            'class': 'float-left titolo_ep'
        }).text(ep_titolo).appendTo($div_info);
        $('<h8>').text(myseries[i].data_uscita).appendTo($div_info);

        var $div_download = $('<div>',{
           'class': 'small-2 columns'
        }).appendTo($row2);

        var $link_download = $('<a>',{
            'href': myseries[i].link_file,
            'download': myseries[i].nome_serie.replace("'" ,"")+' S'+myseries[i].num_stagione+'E'+myseries[i].num_episodio+myseries[i].link_file.slice(-4)
        }).appendTo($div_download);

        $('<img>',{
            'class': 'float-right download_img',
            'id': myseries[i].id,
            'src': '../img/download.png'
        }).appendTo($link_download);

        if(myseries[i].downloaded)
        {
            $('.'+myseries[i].id).hide();
        }
        i++;
    }
}

$(document).on('click', ".download_img", function() {
    var myid = $(this).attr('id');

    chrome.storage.sync.get(function(items)
    {
        var series = items.series;

        $.each(series, function () {
            if (this.id == myid && !this.downloaded)
            {
                this.downloaded = true;
                chrome.storage.sync.set({'series': series});
                decreaseBadge();
            }
        });
        location.reload();
    });
});

$("#clearbadge").click(function(){
   clearBadge();
    chrome.storage.sync.get(function(items)
    {
        var series = items.series;

        $.each(series, function () {
            this.downloaded = true;
            chrome.storage.sync.set({'series': series});
        })
    });
    location.reload();
});

document.addEventListener('DOMContentLoaded', loadData);