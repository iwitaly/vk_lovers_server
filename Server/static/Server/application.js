var HOME_URL = 'http://62.109.1.60:8000/'

function checkForUsersConfession (whoVkIdNumber) {
    var whoVkIdString = whoVkIdNumber.toString();
    $.getJSON(HOME_URL + 'users/' + whoVkIdString + '/who_confession/', {}, function(data) {

    })
            .always(function(data) {
                var arrayOfCompletedRows = [];
                for (i = 0; i < data.length; i++) {
                    var toWhoVkIdString = data[i].to_who_vk_id;
                    var currentType = data[i]['type'];
                    var toWhoType = data[i]['reverse_type'];
                    if (currentType == 0) {
                        $('#date' + toWhoVkIdString).addClass('btn-danger');
                        $('#date' + toWhoVkIdString).removeClass('btn-default');
                        var currentRow = $('#date' + toWhoVkIdString).closest('tr');
                        currentRow.detach();
                        $('#main-table').prepend(currentRow);
                    } else {
                        $('#sex' + toWhoVkIdString).addClass('btn-danger');
                        $('#sex' + toWhoVkIdString).removeClass('btn-default');
                        var currentRow = $('#sex' + toWhoVkIdString).closest('tr');
                        currentRow.detach();
                        $('#main-table').prepend(currentRow);
                    }
                    if (((currentType >= toWhoType) && (toWhoType != -1))) {
                        arrayOfCompletedRows.push(i);
                    }
                }
                for (i = 0; i < arrayOfCompletedRows.length; i++) {
                    var toWhoVkIdString = data[arrayOfCompletedRows[i]].to_who_vk_id;
                    var currentType = data[arrayOfCompletedRows[i]]['type'];
                    var toWhoType = data[arrayOfCompletedRows[i]]['reverse_type'];
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
    //
    $('#main-table').append("<tr class='item'>" +
        "<td class='vert-align avatar-field'>" + "<img class='img-circle avatar' width='60px' height='60px' src='" + photo + "'>" + '</td>' +
        "<td class='name-field vert-align'>" + first_name + ' ' + last_name + '</td>' +
        "<td class='vert-align'>" + "<button type='button' class='button-date btn btn-sm btn-default' id=" + idDateString + ' value=' + valueDateString + '>' + "<i class='fa fa-heart-o fa-2x'></i>"+ '</button>' + '</td>' +
        "<td class='vert-align'>" + "<button type='button' class='button-sex btn btn-sm btn-default' id=" + idSexString + ' value=' +  valueSexString + '>'  + "<i class='fa fa-venus-mars fa-2x'></i>"+ '</button>' + '</td>' +
    '</tr>');
    /*
    $('#main-table').append("<tr class='item'>" +
        "<td class='vert-align'>" + "<img class='img-circle' width='60px' height='60px' src='" + photo + "'>" + '</td>' +
        "<td>" + "<div class='name-field vert-align'>" + first_name + ' ' + last_name + '</div>' +
        "<div class='vert-align'>" + "<button type='button' class='button-date btn btn-default' id=" + idDateString + ' value=' +
            valueDateString + '>' + "<i class='fa fa-heart-o'></i>"+ '</button>'  +
            "<button type='button' class='button-sex btn btn-default' id=" + idSexString + ' value=' +
            valueSexString + '>'  + "<i class='fa fa-venus-mars'></i>"+ '</button>' + '</div>' + '</td>' +
    '</tr>');*/
}

function makeTableWithFriends(viewerUserIdNumber, viewerUserSex) {
    VK.api('friends.get', {order: 'hints', fields: 'id, first_name, last_name, sex, photo_100' }, function(data) {
       switch (viewerUserSex) {
            case 0: {
                for(i = 0; i < data.response.length; i++) {
                    addRowToTableWithFriends(viewerUserIdNumber, data.response[i].uid, data.response[i].photo_100,
                            data.response[i].first_name, data.response[i].last_name);
                }
                break;
            }
            case 1: {
                for(i = 0; i < data.response.length; i++) {
                    if (data.response[i].sex == 2)
                        addRowToTableWithFriends(viewerUserIdNumber,  data.response[i].uid, data.response[i].photo_100,
                                data.response[i].first_name, data.response[i].last_name);
                }
                break;
            }
            case 2: {
                for(i = 0; i < data.response.length; i++) {
                    if (data.response[i].sex == 1)
                        addRowToTableWithFriends(viewerUserIdNumber, data.response[i].uid, data.response[i].photo_100,
                                data.response[i].first_name, data.response[i].last_name);
                }
                break;
            }
        }
        checkForUsersConfession(viewerUserIdNumber);
    });
}

function showSheWantsDateFirst (toWhoVkIdString) {
    $('#accept-date-pop-up-date-first').val(toWhoVkIdString);
    $('#not-accept-date-pop-up-date-first').val(toWhoVkIdString);
    $('main-window').addClass('pop-up-container');
    var toWhoName = $('#date' + toWhoVkIdString).closest('td').prev().text();
    $('#pop-up-date-first-text').text(toWhoName + ' хочет сначала сходить с вами на свидание...');
    $('#pop-up-window-date-first').show();
}

function showWishesTheSame (wishType, toWhoVkIdString) {
    $('#pop-up-window-same').show();
    $('#ok-button-pop-up-same').val(toWhoVkIdString);
    $('main-window').addClass('pop-up-container');
    var toWhoName = $('#date' + toWhoVkIdString).closest('td').prev().text();
    var completedRow = $('#date' + toWhoVkIdString).closest('tr');
    completedRow.addClass('success');
    completedRow.detach();
    $('#main-table').prepend(completedRow);
    $('#date' + toWhoVkIdString).removeClass('btn-danger');
    $('#sex' + toWhoVkIdString).removeClass('btn-danger');
    $('#date' + toWhoVkIdString).addClass('btn-default');
    $('#sex' + toWhoVkIdString).addClass('btn-default');
    if (wishType == 0) {
        $('#pop-up-same-text').text(toWhoName + ' хочет сходить с вами на свидание...');
    } else {
        $('#pop-up-same-text').text(toWhoName + ' хочет заняться с вами любовью...');
    }

}


$('#accept-date-pop-up-date-first').on('click', function() {
    var toWhoVkIdString = $('#accept-date-pop-up-date-first').val();
    var completedRow = $('#date' + toWhoVkIdString).closest('tr');
    completedRow.addClass('success');
    completedRow.detach();
    $('#main-table').prepend(completedRow);
    $('#date' + toWhoVkIdString).removeClass('btn-danger');
    $('#sex' + toWhoVkIdString).removeClass('btn-danger');
    $('#date' + toWhoVkIdString).addClass('btn-default');
    $('#sex' + toWhoVkIdString).addClass('btn-default');
    $('#pop-up-window-date-first').hide();
    $('main-window').removeClass('pop-up-container');
    var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 0};
    $.ajax({
        url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/',
        type: 'POST',
        data: JSON.stringify(confessionInfo),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true
    });
    $.ajax({
        url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
        type: "DELETE"
    });
});

$('#not-accept-date-pop-up-date-first').on('click', function() {
    var toWhoVkIdString = $('#accept-date-pop-up-date-first').val();
    $('#pop-up-window-date-first').hide();
    $('main-window').removeClass('pop-up-container');
    $.ajax({
        url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
        type: "DELETE"
    });

});

$('#ok-button-pop-up-same').on('click', function() {
    $('#pop-up-window-same').hide();
    var toWhoVkIdString = $('#ok-button-pop-up-same').val();
    $('main-window').removeClass('pop-up-container');
    $.ajax({
        url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
        type: "DELETE"
    });
});


function showMatchScreen (whoType, toWhoType, toWhoVkIdString) {
    if ((whoType < toWhoType) || (toWhoType == -1)) {
        return;
    }
    if (whoType == toWhoType) {
        showWishesTheSame(whoType, toWhoVkIdString);
    }
    if ((whoType == 1) && (toWhoType == 0)) {
        showSheWantsDateFirst(toWhoVkIdString);
    }
}

function callBackOnClickToDateButton (whoVkIdString, toWhoVkIdString) {
    var flagDatePressed = $('#date' + toWhoVkIdString).hasClass('btn-danger');
    var flagSexPressed = $('#sex' + toWhoVkIdString).hasClass('btn-danger');
    if ((flagDatePressed == false) && (flagSexPressed == false)) {
        $('#date' + toWhoVkIdString).addClass('btn-danger');
        $('#date' + toWhoVkIdString).removeClass('btn-default');
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
        $('#date' + toWhoVkIdString).removeClass('btn-danger');
        $('#date' + toWhoVkIdString).addClass('btn-default');
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
            type: "DELETE"
        });
    } else {
        $('#date' + toWhoVkIdString).addClass('btn-danger');
        $('#date' + toWhoVkIdString).removeClass('btn-default');
        $('#sex' + toWhoVkIdString).removeClass('btn-danger');
        $('#sex' + toWhoVkIdString).addClass('btn-default');
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
    var flagDatePressed = $('#date' + toWhoVkIdString).hasClass('btn-danger');
    var flagSexPressed = $('#sex' + toWhoVkIdString).hasClass('btn-danger');
    if ((flagDatePressed == false) && (flagSexPressed == false)) {
        $('#sex' + toWhoVkIdString).addClass('btn-danger');
        $('#sex' + toWhoVkIdString).removeClass('btn-default');
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
        $('#sex' + toWhoVkIdString).removeClass('btn-danger');
        $('#sex' + toWhoVkIdString).addClass('btn-default');
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
            type: "DELETE"
        });
    } else {
        $('#sex' + toWhoVkIdString).addClass('btn-danger');
        $('#sex' + toWhoVkIdString).removeClass('btn-default');
        $('#date' + toWhoVkIdString).removeClass('btn-danger');
        $('#date' + toWhoVkIdString).addClass('btn-default');
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
        $('#date' + toWhoVkIdString).removeClass('btn-danger');
        $('#date' + toWhoVkIdString).addClass('btn-default');
        $('#sex' + toWhoVkIdString).removeClass('btn-danger');
        $('#sex' + toWhoVkIdString).addClass('btn-default');
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
            $('#date' + toWhoVkIdString).addClass('btn-danger');
            $('#date' + toWhoVkIdString).removeClass('btn-default');
            $('#sex' + toWhoVkIdString).removeClass('btn-danger');
            $('#sex' + toWhoVkIdString).addClass('btn-default');
        } else {
            $('#date' + toWhoVkIdString).removeClass('btn-danger');
            $('#date' + toWhoVkIdString).addClass('btn-default');
            $('#sex' + toWhoVkIdString).addClass('btn-danger');
            $('#sex' + toWhoVkIdString).removeClass('btn-default');
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
    $('#pop-up-window-same').hide();
    $('#pop-up-window-date-first').hide();
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
