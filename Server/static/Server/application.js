var HOME_URL = 'http://62.109.1.60/';
var DATE_LIMIT = 7;
var SEX_LIMIT = 3;
var whoVkIdString;
var viewerSex
var confessionDateCount;
var confessionSexCount;
var sendType;

function dateOverFlowHandler () {
    $('tr.item').each( function() {
        $this = $(this);
        var toWhoVkIdString = $this.find('button.button-date').val();
        if (!$('#date' + toWhoVkIdString).hasClass('btn-danger')) {
            $('#date' + toWhoVkIdString).hide();
        }
    });
}

function sexOverFlowHandler () {
    $('tr.item').each( function() {
        $this = $(this);
        var toWhoVkIdString = $this.find('button.button-date').val();
        if (!$('#sex' + toWhoVkIdString).hasClass('btn-danger')) {
            $('#sex' + toWhoVkIdString).hide();
        }
    });
}

function checkForUsersConfession (whoVkIdNumber) {
    var whoVkIdString = whoVkIdNumber.toString();
    $.getJSON(HOME_URL + 'users/' + whoVkIdString + '/who_confession/', {}, function(data) {

    })
            .always(function(data) {
                var arrayOfCompletedRows = [];
                for (i = 0; i < data.length; i++) {
                    var toWhoVkIdString = data[i].to_who_vk_id;
                    var valueSexString = "'" + toWhoVkIdString + "'" ;
                    var idSendString = "'send" + toWhoVkIdString + "'" ;
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
                    } else {
                        if (!($('#send' + toWhoVkIdString).length > 0)) {
                            $('#date' + toWhoVkIdString).css('margin-right', '0px');
                            $('#row' + toWhoVkIdString).append(
                                "<button type='button' class='button-send btn btn-xs btn-default' id=" +
                                    idSendString + ' value=' +  valueSexString + '>'  + "<i class='fa fa-paper-plane fa-2x'></i>"+ '</button>'
                            );
                        }
                    }
                }
                for (i = 0; i < arrayOfCompletedRows.length; i++) {
                    var toWhoVkIdString = data[arrayOfCompletedRows[i]].to_who_vk_id;
                    var currentType = data[arrayOfCompletedRows[i]]['type'];
                    var toWhoType = data[arrayOfCompletedRows[i]]['reverse_type'];
                    showMatchScreen(currentType, toWhoType, toWhoVkIdString);
                }
                if (confessionDateCount >= DATE_LIMIT) {
                    dateOverFlowHandler();
                }
                if (confessionSexCount >= SEX_LIMIT) {
                    sexOverFlowHandler();
                }
            });
    $('#table-part').mCustomScrollbar({
        theme:"minimal-dark",
        scrollbarPosition: "outside"
    });
}

function addRowToTableWithFriends (viewerUserIdNumber, cellUserIdNumber, photo, first_name, last_name) {
    var toWhoVkIdString = cellUserIdNumber.toString();
    var idDateString = "'date" + toWhoVkIdString + "'" ;
    var idSexString = "'sex" + toWhoVkIdString + "'" ;
    var idSendString = "'send" + toWhoVkIdString + "'" ;
    var idRowString = "'row" + toWhoVkIdString + "'" ;
    var valueDateString = "'" + toWhoVkIdString + "'" ;
    var valueSexString = "'" + toWhoVkIdString + "'" ;
    //
    $('#main-table').append("<tr class='item'>" +
        "<td class='vert-align avatar-field'>" + "<img class='img-circle avatar' width='60px' height='60px' src='" + photo + "'>" + '</td>' +
        "<td class='name-field vert-align'>" + first_name + ' ' + last_name + '</td>' +
        "<td class='vert-align three-buttons'" + " id=" + idRowString + '>'  + "<button type='button' class='button-date btn btn-xs btn-default' id=" +
            idDateString + ' value=' + valueDateString + '>' + "<i class='fa fa-heart-o fa-2x'></i>"+ '</button>' +
         "<button type='button' class='button-sex btn btn-xs btn-default' id=" +
            idSexString + ' value=' +  valueSexString + '>'  + "<i class='fa fa-heart fa-2x'></i>"+ '</button>' +
          '</td>' +
    '</tr>');
    /*
    $('#main-table').append("<tr class='item'>" +
        "<td class='vert-align'>" + "<img class='img-circle' width='60px' height='60px' src='" + photo + "'>" + '</td>' +
        "<td>" + "<div class='name-field vert-align'>" + first_name + ' ' + last_name + '</div>' +
        "<div class='vert-align'>" + "<button type='button' class='button-date btn btn-default' id=" + idDateString + ' value=' +
            valueDateString + '>' + "<i class='fa fa-heart-o'></i>"+ '</button>'  +
            "<button type='button' class='button-sex btn btn-default' id=" + idSexString + ' value=' +
            valueSexString + '>'  + "<i class='fa fa-venus-mars'></i>"+ '</button>' + '</div>' + '</td>' +
    '</tr>');
    "<button type='button' class='button-send btn btn-xs btn-default' id=" +
            idSendString + ' value=' +  valueSexString + '>'  + "<i class='fa fa-paper-plane fa-2x'></i>"+ '</button>' +
    */
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
    showAdv('#adv-first', 0);
    $('#accept-date-pop-up-date-first').val(toWhoVkIdString);
    $('#not-accept-date-pop-up-date-first').val(toWhoVkIdString);
    $('main-window').addClass('pop-up-container');
    var toWhoName = $('#date' + toWhoVkIdString).closest('td').prev().text();
    if (viewerSex == 2) {
        $('#accept-date-pop-up-date-first').text('Она мне нравится');
        $('#not-accept-date-pop-up-date-first').text('Я влюблен!');
        $('#pop-up-date-first-text').text(toWhoName + ' призналась, что вы ей нравитесь, но вы в нее влюблены.. Что ей отправить?');
        $('#pop-up-window-date-first').show();
    }
    else {
        $('#accept-date-pop-up-date-first').text('Он мне нравится');
        $('#not-accept-date-pop-up-date-first').text('Я влюблена!');
        $('#pop-up-date-first-text').text(toWhoName + ' признался, что вы ему нравитесь, но вы в него влюблены.. Что ему отправить?');
        $('#pop-up-window-date-first').show();
    }
}

function showAdv(selectorAdv, wishType) {
    if (wishType == 0) {
        var msg = "Мы очень рады, что ваши симпатии оказались взаимны и надеемся, что вы скоро встретитесь. Ну а чтобы встреча прошла успешно, можете, например, ";
    } else {
        if (wishType == 1)
            var msg = "Мы очень рады, что ваши симпатии оказались взаимны и надеемся, что вы скоро встретитесь. Ну а чтобы встреча прошла успешно, можете, например, ";
    }
    var coin = Math.floor((Math.random() * 2) + 1);
    if (viewerSex == 1) {
        if (coin == 1) {
            $(selectorAdv + '-img').attr('src', '//62.109.1.60/static/Server/dress.png');
            $(selectorAdv + '-text').text(msg + "порадовать его красивым платьишком.");
        }
        else{
            $(selectorAdv + '-img').attr('src', '//62.109.1.60/static/Server/parfume.png');
            $(selectorAdv + '-text').text(msg + "порадовать его вкусными духами.");
        }
    } else {
        if (coin == 1) {
            $(selectorAdv + '-img').attr('src', '//62.109.1.60/static/Server/rose.png');
            $(selectorAdv + '-text').text(msg + "порадовать её красивыми цветами.");
        }
        else{
            $(selectorAdv + '-img').attr('src', '//62.109.1.60/static/Server/candy.png');
            $(selectorAdv + '-text').text(msg + "порадовать её коробкой вкусных конфет.");

        }
    }
}

function showWishesTheSame (wishType, toWhoVkIdString) {
    showAdv('#adv-same', wishType);
    $('#pop-up-window-same').show();
    $('#ok-button-pop-up-same').val(toWhoVkIdString);
    $('main-window').addClass('pop-up-container');
    var toWhoName = $('#date' + toWhoVkIdString).closest('td').prev().text();
    var completedRow = $('#date' + toWhoVkIdString).closest('tr');
    completedRow.addClass('success');
    $('#date' + toWhoVkIdString).hide();
    $('#sex' + toWhoVkIdString).hide();
    $('#send' + toWhoVkIdString).hide();
    completedRow.detach();
    $('#main-table').prepend(completedRow);
    $('#date' + toWhoVkIdString).removeClass('btn-danger');
    $('#sex' + toWhoVkIdString).removeClass('btn-danger');
    $('#date' + toWhoVkIdString).addClass('btn-default');
    $('#sex' + toWhoVkIdString).addClass('btn-default');
    if (viewerSex == 2) {
        if (wishType == 0) {
            $('#pop-up-same-text').text(toWhoName + ' призналась, что вы ей нравитесь...');
        } else {
            $('#pop-up-same-text').text(toWhoName + ' влюблена в вас..');
        }
    } else {
        if (wishType == 0) {
            $('#pop-up-same-text').text(toWhoName + ' признался, что вы ему нравитесь...');
        } else {
            $('#pop-up-same-text').text(toWhoName + ' влюблен в вас..');
        }
    }


}

$('#accept-date-pop-up-date-first').on('click', function() {
    var toWhoVkIdString = $('#accept-date-pop-up-date-first').val();
    var completedRow = $('#date' + toWhoVkIdString).closest('tr');
    completedRow.addClass('success');
    $('#date' + toWhoVkIdString).hide();
    $('#sex' + toWhoVkIdString).hide();
    $('#send' + toWhoVkIdString).hide();
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
        url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
        type: 'PUT',
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
    var completedRow = $('#date' + toWhoVkIdString).closest('tr');
    completedRow.addClass('success');
    $('#date' + toWhoVkIdString).hide();
    $('#sex' + toWhoVkIdString).hide();
    $('#send' + toWhoVkIdString).hide();
    completedRow.detach();
    $('#main-table').prepend(completedRow);
    var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 3};
    $.ajax({
        url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString  + '/',
        type: 'PUT',
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
    if ((whoType == 0 && toWhoType == 1) || (toWhoType == -1)) {
        return;
    }
    if (whoType == toWhoType) {
        showWishesTheSame(whoType, toWhoVkIdString);
    }
    if ((whoType == 1) && (toWhoType == 0)) {
        showSheWantsDateFirst(toWhoVkIdString);
    }
    if ((whoType == 0) && (toWhoType == 3)) {
        showWishesTheSame(1, toWhoVkIdString);
    }
}

function callBackOnClickToDateButton (whoVkIdString, toWhoVkIdString) {
    var valueSexString = "'" + toWhoVkIdString + "'" ;
    var idSendString = "'send" + toWhoVkIdString + "'" ;
    if (!($('#send' + toWhoVkIdString).length > 0)) {
        $('#date' + toWhoVkIdString).css('margin-right', '0px');
        $('#row' + toWhoVkIdString).append(
            "<button type='button' class='button-send btn btn-xs btn-default' id=" +
                idSendString + ' value=' +  valueSexString + '>'  + "<i class='fa fa-paper-plane fa-2x'></i>"+ '</button>'
        );
    }
    var flagDatePressed = $('#date' + toWhoVkIdString).hasClass('btn-danger');
    var flagSexPressed = $('#sex' + toWhoVkIdString).hasClass('btn-danger');
    if ((flagDatePressed == false) && (flagSexPressed == false)) {
        $('#date' + toWhoVkIdString).addClass('btn-danger');
        $('#date' + toWhoVkIdString).removeClass('btn-default');
        var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 0};
        confessionDateCount++;
        $('#who-date-number-text').text((DATE_LIMIT - confessionDateCount).toString() + " признаний");
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
        if (confessionDateCount >= DATE_LIMIT) {
            dateOverFlowHandler();
        }
    } else if ((flagDatePressed == true) && (flagSexPressed == false)) {
        $('#date' + toWhoVkIdString).removeClass('btn-danger');
        $('#date' + toWhoVkIdString).addClass('btn-default');
        if (confessionDateCount >= DATE_LIMIT) {
            $('#date' + toWhoVkIdString).hide();
        }
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
            type: "DELETE"
        });
    } else {
        if (confessionSexCount >= SEX_LIMIT) {
            $('#sex' + toWhoVkIdString).hide();
        }
        $('#date' + toWhoVkIdString).addClass('btn-danger');
        $('#date' + toWhoVkIdString).removeClass('btn-default');
        $('#sex' + toWhoVkIdString).removeClass('btn-danger');
        $('#sex' + toWhoVkIdString).addClass('btn-default');
        var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 0};
        confessionDateCount++;
        $('#who-date-number-text').text((DATE_LIMIT - confessionDateCount).toString() + " признаний");
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
        if (confessionDateCount >= DATE_LIMIT) {
            dateOverFlowHandler();
        }
    }
}

function callBackOnClickToSexButton (whoVkIdString, toWhoVkIdString) {
    var valueSexString = "'" + toWhoVkIdString + "'" ;
    var idSendString = "'send" + toWhoVkIdString + "'" ;
    if (!($('#send' + toWhoVkIdString).length > 0)) {
        $('#date' + toWhoVkIdString).css('margin-right', '0px');
        $('#row' + toWhoVkIdString).append(
            "<button type='button' class='button-send btn btn-xs btn-default' id=" +
            idSendString + ' value=' + valueSexString + '>' + "<i class='fa fa-paper-plane fa-2x'></i>" + '</button>'
        );
    }
    var flagDatePressed = $('#date' + toWhoVkIdString).hasClass('btn-danger');
    var flagSexPressed = $('#sex' + toWhoVkIdString).hasClass('btn-danger');
    if ((flagDatePressed == false) && (flagSexPressed == false)) {
        $('#sex' + toWhoVkIdString).addClass('btn-danger');
        $('#sex' + toWhoVkIdString).removeClass('btn-default');
        var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 1};
        confessionSexCount++;
        $('#who-sex-number-text').text((SEX_LIMIT - confessionSexCount).toString() + " признаний");
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
        if (confessionSexCount >= SEX_LIMIT) {
            sexOverFlowHandler();
        }
    } else if ((flagDatePressed == false) && (flagSexPressed == true)) {
        $('#sex' + toWhoVkIdString).removeClass('btn-danger');
        $('#sex' + toWhoVkIdString).addClass('btn-default');
        if (confessionSexCount >= SEX_LIMIT) {
            $('#sex' + toWhoVkIdString).hide();
        }
        $.ajax({
            url: HOME_URL + 'users/' + whoVkIdString + '/who_confession/' + toWhoVkIdString + '/',
            type: "DELETE"
        });
    } else {
        if (confessionSexCount >= SEX_LIMIT) {
            $('#date' + toWhoVkIdString).hide();
        }
        $('#sex' + toWhoVkIdString).addClass('btn-danger');
        $('#sex' + toWhoVkIdString).removeClass('btn-default');
        $('#date' + toWhoVkIdString).removeClass('btn-danger');
        $('#date' + toWhoVkIdString).addClass('btn-default');
        var confessionInfo = {who_vk_id: whoVkIdString, to_who_vk_id: toWhoVkIdString, type: 1};
        confessionSexCount++;
        $('#who-sex-number-text').text((SEX_LIMIT - confessionSexCount).toString() + " признаний");
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
        if (confessionSexCount >= SEX_LIMIT) {
            sexOverFlowHandler();
        }
    }
}

function order(toWhoPhoneNumber) {
    var params = {
      type: 'item',
      item: sendType.toString() + viewerSex.toString()
    };
    VK.callMethod('showOrderBox', params);
}


$('#ok-button-pop-up-payment-success').on('click', function() {
    $('#pop-up-window-payment-success').hide();
});
$('#ok-button-pop-up-payment-failed').on('click', function() {
    $('#pop-up-window-payment-failed').hide();
});
$('#ok-button-pop-up-payment-cancel').on('click', function() {
    $('#pop-up-window-payment-cancel').hide();
});
$('#ok-button-pop-up-send').on('click', function() {
    var screenWidth = window.screen.availWidth;
    var screenHeight = window.screen.availHeight;
    var urlSend = "http://62.109.1.60/mobileinput/?vk_id=" + whoVkIdString;
    window.open(urlSend, "_blank", "width=500, height=150, top=" +
        (screenHeight/2 - 150).toString() + ", left=" + (screenWidth/2 - 225).toString());
    $('#pop-up-window-send').hide();

});

function callBackOnClickToSendButton (whoVkIdString, toWhoVkIdString) {
    if ($('#send' + toWhoVkIdString).hasClass('btn-default')) {
        sendType = ($('#date' + toWhoVkIdString).hasClass('btn-danger')) ? 0 : 1;
        if (sendType == 0 && viewerSex == 2) {
            $('#warning-send-text').text(
                '"Ты мне нравишься, но я не знаю взаимно ли это. Сообщение отправлено через cайт secretvalentine.ru."'
            )
        }
        if (sendType == 1 && viewerSex == 2) {
            $('#warning-send-text').text(
                '"Я влюблен в тебя, но я не знаю взаимно ли это. Сообщение отправлено через cайт secretvalentine.ru."'
            )
        }
        if (sendType == 0 && viewerSex == 1) {
            $('#warning-send-text').text( '"Ты мне нравишься, но я не знаю взаимно ли это. Сообщение отправлено через cайт secretvalentine.ru."'
            )
        }
        if (sendType == 1 && viewerSex == 1) {
            $('#warning-send-text').text(
                '"Я влюблена в тебя, но я не знаю взаимно ли это. Сообщение отправлено через cайт secretvalentine.ru."'
            )
        }
        $('#pop-up-window-send').show();
        $('#to-who-phone-field').focus();
        $('#send' + toWhoVkIdString).removeClass('btn-default');
        $('#send' + toWhoVkIdString).addClass('btn-danger');
    } else {
        order();
        $('#send' + toWhoVkIdString).removeClass('btn-danger');
        $('#send' + toWhoVkIdString).addClass('btn-default');
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
            $this.hide();
        }
        else {
            $this.show();
        }
    });
}

//function interActionWithViewer(whoVkIdNumber) {
$('#table-part').on('click', 'button', function() {
    var toWhoVkIdString = $(this).attr('value');
    if ($(this).hasClass('button-date') == true) {
        callBackOnClickToDateButton(whoVkIdString, toWhoVkIdString);
    } else {
        if ($(this).hasClass('button-sex') == true)
            callBackOnClickToSexButton(whoVkIdString, toWhoVkIdString);
        else
            callBackOnClickToSendButton(whoVkIdString, toWhoVkIdString);
    }
});

$('#cancel-send').on('click', function () {
    $('#pop-up-window-send').hide();
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

function initSuccess () {
    // access to wall +8192, access to notifications +1, link +256
    $('#ok-button-pop-up-send').hide();
    jQuery(function($){
        $("#to-who-phone-field").mask("+7 (999) - 999 - 9999", {
            placeholder:"   ",
            completed: function() {
                $('#cancel-send').css('margin-right', '10px');
                $('#ok-button-pop-up-send').show();
            }
        });
    });
    $('#pop-up-window-send').hide();
    $('#pop-up-window-same').hide();
    $('#pop-up-window-date-first').hide();
    /* VK.api ('users.isAppUser', function (msg) {
        if (msg.response == 0) {
            VK.api('getUserSettings', function (data) {
                if (data.response) {
                    if (!(256 & data.response) || !(1 & data.response))
                        VK.callMethod('showSettingsBox', (256 + 1));
                }
            });
        }
    }); */
    VK.api('users.get', {fields: 'sex, photo_100'}, function(dataFromVk) {
        var viewerUserIdNumber = dataFromVk.response[0].uid;
        whoVkIdString = viewerUserIdNumber.toString();
        viewerSex = dataFromVk.response[0].sex;
        var userInfo = {vk_id: viewerUserIdNumber.toString(), email: '', mobile: '', to_who_mobile: ''};
        $.ajax({
            url: HOME_URL + 'users/',
            type: 'POST',
            data: JSON.stringify(userInfo),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function(data) {
                confessionDateCount = data['confession_count_date'];
                confessionSexCount = data['confession_count_sex'];
                $('#who-date-number-text').text((DATE_LIMIT - confessionDateCount).toString() + " признаний");
                $('#who-sex-number-text').text((SEX_LIMIT - confessionSexCount).toString() + " признаний");
                if (viewerSex == 2) {
                    $('#comment-who-sex').text('"влюблен" осталось');
                } else {
                    $('#comment-who-sex').text('"влюблена" осталось');
                }
            },
            error: function() {
                // What should I do else?
                //alert("You've been here!")
            }
        });
        $('#user-avatar').attr('src', dataFromVk.response[0].photo_100);
        makeTableWithFriends(viewerUserIdNumber, dataFromVk.response[0].sex);
        $.ajax({
            url: HOME_URL + 'users/to_who_confession_number/' + whoVkIdString + '/',
            type: 'GET',
            data: JSON.stringify(userInfo),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function(data) {
                $('#to-who-number-text').text(data['count'] + " человек");
            }
        });
        //interActionWithViewer(viewerUserIdNumber);
    });
}

$(document).ready( function () {
        VK.init({
            apiId: 4771729
        })
        initSuccess();
    }
);