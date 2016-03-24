//Load all settings
function load_settings()
{
    var selectors = {series: $('#series' ), popup: $('#popup_page')};

    selectors.series.addClass('loading');
    //Load and populate select with series of subspedia
    $.getJSON("http://www.subspedia.tv/API/getAllSeries.php", function( data ) {
        $( data ).each(function( index ) {
            selectors.series
                .append($("<option></option>")
                    .attr("value",data[index].id_serie)
                    .text(data[index].nome_serie));
        });
    })
        .fail(function(){
            alert("Errore nel connettersi con Subspedia, controlla la tua connessione.");
        })
        .always(function() {
            selectors.series.removeClass('loading');
        });

    //Load and populate select with series selected series of subspedia
    var i = 0;
    //Load data from local storage
    chrome.storage.sync.get(function(items)
    {
        if (typeof items.series != 'undefined') {
            while (i < items.series.length) {

                $("#selected_series")
                    .append($("<option></option>")
                        .attr({id: items.series[i].num_ep, name: items.series[i].name.replace("'", "")})
                        .text(items.series[i].name));

                i++;
            }
        }

        //Set switch of Notification
        $("#switchNotif").prop('checked', items.settings.notification);

        //Set time of check episode
        $("#timeEp").val(items.settings.timeEp);

        if(items.settings.popup == 'popup/myserie.html')
        {
            selectors.popup.val('Le mie serie');
        }
        else if(items.settings.popup == 'popup/newepisode.html')
        {
            selectors.popup.val('Ultimi episodi');
        }
        else if(items.settings.popup == 'popup/intraduzione.html')
        {
            selectors.popup.val('In traduzione');
        }
    });
}

function save_series(idserie)
{
   var selected_series = $('#selected_series');

    $.getJSON( "http://subspedia.tv/API/getBySerie.php?serie="+idserie, function( data ) {
   chrome.storage.sync.get(function(items)
   {
       if (typeof items.series != 'undefined')
       {
           var Series = items.series;
           var allid = [];

           //Push all the id of the series into a vector
           for (var i = 0; i<Series.length; i++)
           {
               allid.push(Series[i].id);
           }

           //If the series is not already saved, save it
           if (($.inArray(parseInt(idserie), allid) == -1) && allid.length <15 )
           {
               //Add the series to the select of selected series
               selected_series
                   .append($("<option></option>")
                       .attr({id: idserie, name: data[0].nome_serie.replace("'", "")})
                       .text(data[0].nome_serie));

               var temp = ({id: data[0].id_serie, name: data[0].nome_serie, num_ep: data.length, downloaded: false});
               Series.push(temp);
               //Save selected series name and number of episodes into local storage
               chrome.storage.sync.set({'series': Series}, function()
               {
                   chrome.extension.getBackgroundPage().window.location.reload();
               });
           }
           else
           {
               if (allid.length == 15)
               {
                   alert("Non puoi aggiungere più di 15 serie!")
               }
           }
       }
       else
       {
           //Add the series to the select of selected series
           selected_series
               .append($("<option></option>")
                   .attr({id: idserie, name: data[0].nome_serie.replace("'", "")})
                   .text(data[0].nome_serie));

           var series = [];
           series[0] = {id: data[0].id_serie, name: data[0].nome_serie, num_ep: data.length, downloaded: false};
           chrome.storage.sync.set({'series': series}, function()
           {
               chrome.extension.getBackgroundPage().window.location.reload();
           });
       }
   });
   })
        .fail(function(){
            alert("Errore nel salvare la serie, controlla la tua connessione.")
        });
}

//Delete of the selected series from storage
$( "#elimina" ).click(function() {
    var values = $('#selected_series').val();

    if(values != null) {
        chrome.storage.sync.get(function (items) {
            var series = items.series;

            for (var i = 0; i < values.length; i++) {
                series = series.filter(function (obj) {
                    return obj.name !== values[i];
                });

                $("option[name='"+values[i].replace("'", "")+"']").hide();
            }
            chrome.storage.sync.set({'series': series}, function () {
                chrome.extension.getBackgroundPage().window.location.reload();
            });
        });
    }
});

//Function to handle timer of check episodes
$('#timeEp').change(function()
{
    chrome.storage.sync.get(function (items) {
        var settings = items.settings;
        settings.timeEp = $("#timeEp").val();

        chrome.storage.sync.set({'settings': settings}, function()
        {
            chrome.extension.getBackgroundPage().window.location.reload();
        });
    });
});

//Function to disable or enable notification
$("#switchNotif").change(function()
{
    chrome.storage.sync.get(function (items) {
        var settings = items.settings;
        settings.notification = $("#switchNotif").is(':checked');

        chrome.storage.sync.set({'settings': settings}, function()
        {
            chrome.extension.getBackgroundPage().window.location.reload();
        });
    });
});

//Dynamic research into the select
$('#search').keyup(function() {
    var series_option = $('#series option');
    var val = $('#search').val().toUpperCase();

    if (val === "")
        series_option.show();
    else {
        series_option.hide();
        series_option.filter(function () {
            return -1 != $(this).text().toUpperCase().indexOf(val);
        }).show();
    }
});

//Perform action when a series is selected
$( "#series" ).change(function() {
    var id = "";

    $( "#series option:selected" ).each(function() {
        id = $(this).val();
        save_series(id);
    });
});

$('#popup_page').change(function()
{
    var popup, selector_popup = $('#popup_page');

    if (selector_popup.val() == 'Le mie serie')
    {
        popup = 'popup/myserie.html';
    }
    else if (selector_popup.val() == 'Ultimi episodi')
    {
        popup = 'popup/newepisode.html';
    }
    else if (selector_popup.val() == 'In traduzione')
    {
        popup = 'popup/intraduzione.html';
    }

    chrome.browserAction.setPopup({
        popup: popup
    });

    chrome.storage.sync.get(function (items) {
        var settings = items.settings;
        settings.popup = popup;

        chrome.storage.sync.set({'settings': settings}, function() {});
    });
});

//Initialize foundation
$(document).ready(function() {
    $(document).foundation();
});

document.addEventListener('DOMContentLoaded', load_settings);