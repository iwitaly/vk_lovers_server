var HOME_URL = 'http://62.109.1.60:8000/'

function checkForUsersConfession (whoVkIdNumber) {
    var whoVkIdString = whoVkIdNumber.toString();
    $.getJSON(HOME_URL + 'users/' + whoVkIdString + '/who_confession/', {}, function(data) {

    })
            .always(function(data) {
                for (i = 0; i < data.length; i++) {
                    var toWhoVkIdString = data[i].to_who_vk_id;
                    var currentType = data[i]['type'];
                    var toWhoType = data[i]['reverse_type'];
                    if (currentType == 0) {
                        $('#date' + toWhoVkIdString).addClass('date-pressed');
                        var currentRow = $('#date' + toWhoVkIdString).closest('tr');
                        currentRow.detach();
                        $('#main-table').prepend(currentRow);
                    } else {
                        $('#sex' + toWhoVkIdString).addClass('sex-pressed');
                        var currentRow = $('#sex' + toWhoVkIdString).closest('tr');
                        currentRow.detach();
                        $('#main-table').prepend(currentRow);
                    }
                    showMatchScreen(currentType, toWhoType, toWhoVkIdString);
                }
            });
}

function addRowToTableWithFriends (viewerUserIdNumber, cellUserIdNumber, photo, first_name, last_name) {
    var toWhoVkIdString = cellUserIdNumber.toString();
    var idDateString = "'date" + toWhoVkIdString + "'" ;
    var idSexString = "'sex" + toWhoVkIdString + "'" ;
    var valueDateString = "'" + toWhoVkIdString + "'" ;
    var valueSexString = "'" + toWhoVkIdString + "'" ;
    $('#main-table').append("<tr class='item'>" +
        '<td>' + "<img src='" + photo + "'>" + '</td>' +
        "<td class='name-field'>" + first_name + ' ' + last_name + '</td>' +
        '<td>' + "<button class='button-date' id=" + idDateString + ' value=' + valueDateString + '>' + 'Date'+ '</button>' + '</td>' +
        '<td>' + "<button class='button-sex' id=" + idSexString + ' value=' +  valueSexString + '>'  + 'Sex'+ '</button>' + '</td>' +
    '</tr>');
}

function makeTableWithFriends(viewerUserIdNumber, viewerUserSex) {
    VK.api('friends.get', {order: 'hints', fields: 'id, first_name, last_name, sex, photo_50' }, function(data) {
       switch (viewerUserSex) {
            case 0: {
                for(i = 0; i < data.response.length; i++) {
                    addRowToTableWithFriends(viewerUserIdNumber, data.response[i].uid, data.response[i].photo_50,
                            data.response[i].first_name, data.response[i].last_name);
                }
                break;
            }
            case 1: {
                for(i = 0; i < data.response.length; i++) {
                    if (data.response[i].sex == 2)
                        addRowToTableWithFriends(viewerUserIdNumber,  data.response[i].uid, data.response[i].photo_50,
                                data.response[i].first_name, data.response[i].last_name);
                }
                break;
            }
            case 2: {
                for(i = 0; i < data.response.length; i++) {
                    if (data.response[i].sex == 1)
                        addRowToTableWithFriends(viewerUserIdNumber, data.response[i].uid, data.response[i].photo_50,
                                data.response[i].first_name, data.response[i].last_name);
                }
                break;
            }
        }
        checkForUsersConfession(viewerUserIdNumber);
    });
}

function showMatchScreen (whoType, toWhoType, toWhoVkIdString) {
    if ((whoType == -1) || (toWhoType == -1)) {
        return;
    }
    var toWhoName = $('#date' + toWhoVkIdString).closest('td').prev().text();
    var minType = Math.min(whoType, toWhoType);
    if (minType == 0) {
        $('#pop-up-confession-text').text(toWhoName + ' хочет сходить с вами на свидание...');
    } else {
        $('#pop-up-confession-text').text(toWhoName + ' хочет заняться с вами любовью...');
    }
    $('#pop-up-window').dialog({
        width: 180,
        height: 150
    });
}

function callBackOnClickToDateButton (whoVkIdString, toWhoVkIdString) {
    var flagDatePressed = $('#date' + toWhoVkIdString).hasClass('date-pressed');
    var flagSexPressed = $('#sex' + toWhoVkIdString).hasClass('sex-pressed');
    if ((flagDatePressed == false) && (flagSexPressed == false)) {
        $('#date' + toWhoVkIdString).addClass('date-pressed');
        var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 0};
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/',
            type: 'POST',
            data: JSON.stringify(confessionInfo),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            complete: function (data) {
                var whoType = data.responseJSON['type'];
                var toWhoType = data.responseJSON['reverse_type'];
                showMatchScreen(whoType, toWhoType, toWhoVkIdString);
            }
        });
    } else if ((flagDatePressed == true) && (flagSexPressed == false)) {
        $('#date' + toWhoVkIdString).removeClass('date-pressed');
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
            type: "DELETE"
        });
    } else {
        $('#date' + toWhoVkIdString).addClass('date-pressed');
        $('#sex' + toWhoVkIdString).removeClass('sex-pressed');
        var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 0};
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/',
            type: 'POST',
            data: JSON.stringify(confessionInfo),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            complete: function (data) {
                var whoType = data.responseJSON['type'];
                var toWhoType = data.responseJSON['reverse_type'];
                showMatchScreen(whoType, toWhoType, toWhoVkIdString);
            }
        });
    }
}

function callBackOnClickToSexButton (whoVkIdString, toWhoVkIdString) {
    var flagDatePressed = $('#date' + toWhoVkIdString).hasClass('date-pressed');
    var flagSexPressed = $('#sex' + toWhoVkIdString).hasClass('sex-pressed');
    if ((flagDatePressed == false) && (flagSexPressed == false)) {
        $('#sex' + toWhoVkIdString).addClass('sex-pressed');
        var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 1};
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/',
            type: 'POST',
            data: JSON.stringify(confessionInfo),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            complete: function (data) {
                var whoType = data.responseJSON['type'];
                var toWhoType = data.responseJSON['reverse_type'];
                showMatchScreen(whoType, toWhoType, toWhoVkIdString);
            }
        });
    } else if ((flagDatePressed == false) && (flagSexPressed == true)) {
        $('#sex' + toWhoVkIdString).removeClass('sex-pressed');
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
            type: "DELETE"
        });
    } else {
        $('#sex' + toWhoVkIdString).addClass('sex-pressed');
        $('#date' + toWhoVkIdString).removeClass('date-pressed');
        var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 1};
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/',
            type: 'POST',
            data: JSON.stringify(confessionInfo),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            complete: function (data) {
                var whoType = data.responseJSON['type'];
                var toWhoType = data.responseJSON['reverse_type'];
                showMatchScreen(whoType, toWhoType, toWhoVkIdString);
            }
        });
    }
}

function deleteAllConfessions (whoVkIdString) {
    $('tr.item').each( function() {
        $this = $(this);
        var toWhoVkIdString = $this.find('button.button-date').val();
        $('#date' + toWhoVkIdString).removeClass('date-pressed');
        $('#sex' + toWhoVkIdString).removeClass('sex-pressed');
    });
    $.ajax({
        url: HOME_URL + 'users/' + 'who_confession/' + whoVkIdString + '/',
        type: "DELETE"
    });
};

function makeAllPossibleConfessions (whoVkIdString, typeOfConfessions) {
    var arrayToPost = [];
    $('tr.item').each( function() {
        $this = $(this);
        var toWhoVkIdString = $this.find('button.button-date').val();
        if (typeOfConfessions == 0) {
            $('#date' + toWhoVkIdString).addClass('date-pressed');
            $('#sex' + toWhoVkIdString).removeClass('sex-pressed');
        } else {
            $('#date' + toWhoVkIdString).removeClass('date-pressed');
            $('#sex' + toWhoVkIdString).addClass('sex-pressed');
        }
        var elementConfession = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: typeOfConfessions};
        arrayToPost.push(elementConfession);
    });
    $.ajax({
        url: HOME_URL + 'users/' + 'who_confession/' + whoVkIdString + '/',
        type: 'POST',
        data: JSON.stringify(arrayToPost),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        complete: function(data) {
            for (i = 0; i < data.responseJSON.length; i++) {
                var whoType = data.responseJSON[i]['type'];
                var toWhoType = data.responseJSON[i]['reverse_type'];
                showMatchScreen(whoType, toWhoType, data.responseJSON[i].to_who_vk_id);
            }
        }
    });
}

function searchAndDraw (searchString) {
    $('tr.item').each( function() {
        $this = $(this);
        var name = $this.find('td.name-field').text();
        name = name.toLowerCase();
        if (name.indexOf(searchString.toLowerCase()) == -1) {
            $this.hide('fast');
        }
        else {
            $this.show('fast');
        }
    });
}

//function interActionWithViewer(whoVkIdNumber) {
var whoVkIdString;
var viewerSex
$('#table-part').on('click', 'button', function() {
    var toWhoVkIdString = $(this).attr('value');
    if ($(this).hasClass('button-date') == true) {
        callBackOnClickToDateButton(whoVkIdString, toWhoVkIdString);
    } else {
        callBackOnClickToSexButton(whoVkIdString, toWhoVkIdString);
    }
});
$('#date-all').on('click', function () {
    if (!$('#date-all').hasClass('date-all-pressed') && !$('#sex-all').hasClass('sex-all-pressed')) {
        makeAllPossibleConfessions(whoVkIdString, 0);
        $('#date-all').addClass('date-all-pressed');
    } else if ($('#date-all').hasClass('date-all-pressed') && !$('#sex-all').hasClass('sex-all-pressed')) {
        deleteAllConfessions(whoVkIdString);
        $('#date-all').removeClass('date-all-pressed');
    } else {
        makeAllPossibleConfessions(whoVkIdString, 0);
        $('#date-all').addClass('date-all-pressed');
        $('#sex-all').removeClass('sex-all-pressed');
    }
});
$('#sex-all').on('click', function () {
    if (!$('#date-all').hasClass('date-all-pressed') && !$('#sex-all').hasClass('sex-all-pressed')) {
        makeAllPossibleConfessions(whoVkIdString, 1);
        $('#sex-all').addClass('sex-all-pressed');
    } else if (!$('date-all').hasClass('date-all-pressed') && $('#sex-all').hasClass('sex-all-pressed')) {
        deleteAllConfessions(whoVkIdString);
        $('#sex-all').removeClass('sex-all-pressed');
    } else {
        makeAllPossibleConfessions(whoVkIdString, 1);
        $('#sex-all').addClass('sex-all-pressed');
        $('#date-all').removeClass('date-all-pressed');
    }
});
$('#share').on('click', function () {
    VK.api('wall.post', {message: 'Test-message', attachments: 'photo-11982368_346772314'});
})
$("#search-field").keyup(function () {
    var searchString = $("#search-field").val();
    searchAndDraw(searchString);
});
//}

function initSuccess () {
    // access to wall +8192, access to notifications +1, link +256
    VK.api ('users.isAppUser', function (msg) {
        if (msg.response == 0) {
            VK.api('getUserSettings', function (data) {
                if (data.response) {
                    if (!(256 & data.response) || !(1 & data.response))
                        VK.callMethod('showSettingsBox', (256 + 1));
                }
            });
        }
    });
    VK.api('users.get', {fields: 'sex'}, function(dataFromVk) {
        var viewerUserIdNumber = dataFromVk.response[0].uid;
        var userInfo = {vk_id: viewerUserIdNumber.toString(), email: 'unknown@unknown.com', mobile: 'unknown'};
        $.ajax({
            url: HOME_URL + 'users/',
            type: 'POST',
            data: JSON.stringify(userInfo),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function() {
                // What should I do if User once been in app?
                //alert('Welcome!')
            },
            error: function() {
                // What should I do else?
                //alert("You've been here!")
            }
        });
        whoVkIdString = viewerUserIdNumber.toString();
        viewerSex = dataFromVk.response[0].sex
        makeTableWithFriends(viewerUserIdNumber, dataFromVk.response[0].sex);
        //interActionWithViewer(viewerUserIdNumber);
    });
}

$(document).ready(
    VK.init(initSuccess())
);
