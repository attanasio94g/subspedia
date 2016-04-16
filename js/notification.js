// Copyright (c) 2016 Giuseppe Attanasio
// License: Academic Free License ("AFL") v. 3.0
// AFL License page: http://opensource.org/licenses/AFL-3.0
// giuseppeattanasio.me - https://github.com/master94ga

function showNotification(nome_serie) {
    var id = '1'; //Id of the notification

    //Object with options of notification
    var opt = {
        type: "basic",
        title: "Subspedia",
        message: "Nuovo episodio di: " +nome_serie,
        iconUrl: "img/128x128.png"
    };

    chrome.notifications.create(id, opt);
}

//Update badge value into local storage
function saveBadge()
{
    chrome.storage.sync.get(function(items)
    {
       if (typeof items.badge === 'undefined' || items.badge == '')
       {
           chrome.storage.sync.set({'badge': 1});
       }
       else
       {
           var num = items.badge;
           num ++;

           chrome.storage.sync.set({'badge': num});
       }
    });
}

//Load badge value from local storage
function loadBadge()
{
    chrome.storage.sync.get(function(items)
    {
        if (typeof items.badge != 'undefined' || items.badge == '')
        {
            chrome.browserAction.setBadgeBackgroundColor({color: "#FFA500"});
            chrome.browserAction.setBadgeText({text: items.badge.toString()});
        }
    });
}

//Reset badge
function clearBadge()
{
    chrome.storage.sync.set({'badge': ''});

    chrome.browserAction.setBadgeText({text: ''});
}

//Decrease the badge when there is a download of episode.
function decreaseBadge()
{
    chrome.storage.sync.get(function(items)
    {
        var num = items.badge;
        if (num != 1)
        {
            num --;
        }
        else
        {
            num = '';
        }

        chrome.storage.sync.set({'badge': num});
    });
}