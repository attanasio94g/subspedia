// Copyright (c) 2016 Giuseppe Attanasio
// License: Academic Free License ("AFL") v. 3.0
// AFL License page: http://opensource.org/licenses/AFL-3.0
// giuseppeattanasio.me - https://github.com/master94ga

//Initialize local storage on first installation and update
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get(function(items) {
        //Fired on first installation
        if(typeof items.settings === 'undefined'){
            chrome.storage.sync.set({'settings': ({timeEp: 30, notification: true, popup: 'popup/myserie.html' })});
            window.open('../settings/settings.html');
        }
    });
});

//Load badge and call the check of new episode
function loadData()
{
    loadBadge();

    chrome.storage.sync.get(function (items) {
        $.each(items.series, function (index) {
            checkEpisodes(items.series[index].id, items.series[index].num_ep, index);
        })
    });
}

//Check new episodes
function checkEpisodes(id, num_ep, i)
{
    chrome.storage.sync.get(function(items)
    {
        setInterval(function()
        {
            $.getJSON( "http://subspedia.tv/API/getBySerie.php?serie="+id, function( data ) {
                if(data.length > num_ep)
                {
                    if(items.settings.notification == true)
                    {
                        showNotification(data[0].nome_serie);
                    }

                    //Update storage with new data
                    setTimeout(function(){  updateStorage(data.length,i); }, 500);
                }
            });
        }, items.settings.timeEp*1000)
    });
}

//Update value of episoded if new one is available
function updateStorage(newEp, i)
{
    //Update badge data
    saveBadge();

    chrome.storage.sync.get(function(items)
    {
        var Series = items.series;

        Series[i].num_ep = newEp;
        Series[i].downloaded = false;

        chrome.storage.sync.set({'series': Series}, function()
        {
            setTimeout(function(){ window.location.reload(); }, 5000);
        });
    });
}
document.addEventListener('DOMContentLoaded', loadData);
