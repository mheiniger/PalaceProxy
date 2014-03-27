var users = {};
var me = {};
var server = {};
me.isWhisperingTo = null;
var socket = null;

function startSocket() {
    socket = io.connect();
    socket.on('log', function (data) {
        var logWindow = $('#log');
        logWindow.append(data.text + '<br>');
        logWindow.animate({"scrollTop":$('#log')[0].scrollHeight}, "slow");
    });

    socket.on('roomList', function (data) {
        var rooms = data.data;

        var gridData = [];
        for (var i = 0; i < rooms.length; i++) {
            gridData.push({ recid: rooms[i].id, roomName: rooms[i].name});
        }
        w2ui['grid'].add(gridData);
    });

    socket.on('userList', function (data) {
        var users = data.data;
console.log(users);
        var gridData = [];
        for (var i = 0; i < users.length; i++) {
            gridData.push({ recid: users[i].id, userName: users[i].name, roomName: users[i].roomName});
        }
        w2ui['userGrid'].add(gridData);
    });

    socket.on('chat', function (data) {
        console.log(data);
        var logWindow = $('#log');
        logWindow.append('<b>' + data.user.name + ':</b> ' + data.chatText + '<br>');
        logWindow.animate({"scrollTop":$('#log')[0].scrollHeight}, "slow");
        showChatBubble(data.user, data.chatText, 'chat');
    });
    socket.on('whisper', function (data) {
        console.log(data);
        var logWindow = $('#log');
        logWindow.append('<em><b>' + data.user.name + ':</b> ' + data.chatText + '</em><br>');
        logWindow.animate({"scrollTop":$('#log')[0].scrollHeight}, "slow");
        showChatBubble(data.user, data.chatText, 'whisper');
    });
    socket.on('dev-log', function (data) {
        console.log(data);
    });
    socket.on('connectComplete', function (data) {
        server.host = data.host;
        server.port = data.port;
        $('#login-box').hide(1000);
    });

    socket.on('roomChanged', function (roomData, mediaServer) {
        var room = $('#room');
        var roomName = $('#room-name');
        var stage = $('#room-stage');
        var roomImage = $('#room-image');
        roomImage.attr('src', mediaServer + roomData.backgroundFile);
        roomName.html(roomData.name);
        $('.userDiv').remove();
    });

    socket.on('serverInfoChanged', function(data){
        var serverName = data.serverInfo.name;
        $('#palace-name').html(serverName);
    });

    socket.on('userEntered', function (data) {
        users[data.user.id] = data.user;
        if (data.user.isSelf === true) {
            me = data.user;
        }
        var div = createUserDiv(data.user);
        $('#room-stage').append(div);
        setUserName(data.user.id, data.user.name);
        setFace(data.user.id, data.user.face, data.user.color);
        div.click(function () {
            handleClickOnUser(data.user);
        });
        data.user.div = div;
        console.log(data);
    });

    socket.on('userMoved', function (data) {
        var user = data.user;
        moveUser(user.id, user.x, user.y);
    });

    socket.on('userLeft', function (data) {
        var user = data.user;
        $('#user-' + user.id).remove();
    });

    socket.on('faceChanged', function (data) {
        var user = data.user;
        console.log(user);
        setFace(user.id, user.face, user.color);
    });
    socket.on('propLoaded', function (data) {
        console.log(data);
        addProp(data.user.id, data.user);
    });
}


$("#room-image").click(function (e) {
    var x = e.pageX - e.currentTarget.x;
    var y = e.pageY - e.currentTarget.y;
    socket.emit('userMoved', { 'x':x, 'y':y });
    moveUser(me.id, x, y);
});

$("#notification-area").click(function(e) {
   stopWhispering();
});

$('#input').on('keypress', function (e) {
    if (!e) e = window.event;
    if (e.keyCode == '13') {
        if (me.isWhispering === true){
            socket.emit('whisper', { 'text': this.value, 'user': me.isWhisperingTo });
        } else {
            socket.emit('chat', { 'text':this.value });
        }
        this.value = '';
        return false;
    }
    return true;
});

$('#login').on('click', function () {
    $('#login-box').show(500);
});

$('#connect').on('click', function () {
    socket.emit('connect',
        $('#palace-address').val(),
        $('#palace-port').val(),
        $('#user-name').val()
    );
});

$('#logout').on('click', function () {
    socket.emit('logout');
    clearStage();
});

function clearStage() {
    $('.userDiv').remove();
    $('#room-name').html('');
    $('#palace-name').html('');
    var roomImage = $('#room-image');
    roomImage.attr('src', 'assets/images/start-screen.png');
}

function setFace(userId, face, color) {
    var userDiv = $('#user-' + userId + ' .face');
    var row = color;
    var column = face;
    userDiv.css({
        'backgroundPosition':(45 * column * -1) + 'px ' + (45 * row * -1) + 'px'
    });
}

function addProp(userId, userData) {
    var userDiv = $('#user-' + userId);
    userDiv.find('.prop').remove();
    var userFace = $('#user-' + userId + ' .face');
    if (userData.showFace) {
        userFace.css('visibility', 'visible');
    } else {
        userFace.css('visibility', 'hidden');
    }
    var i;
    for (i=0;i<userData.propCount;i++) {
        var propDiv = document.createElement("div");
        propDiv.setAttribute("class", "prop");
        propDiv.style.top = (parseInt(userData.props.data[i].verticalOffset) + 1) + 'px';
        propDiv.style.left = (parseInt(userData.props.data[i].horizontalOffset) + 1) + 'px';
        if (userData.props.data[i].url) {
            propDiv.style.backgroundImage = "url('" + userData.props.data[i].url + "')";
            propDiv.style.width = '220px';
            propDiv.style.height = '220px';
        } else {
            propDiv.style.backgroundImage = "url('prop/" + userData.palaceUrl + "/" + userId +"/"+ userData.propIds[i] +".png')";
            propDiv.style.width = '44px';
            propDiv.style.height = '44px';
        }
        propDiv.style.backgroundRepeat = "no-repeat";
        userDiv.append(propDiv);
    }
}

function moveUser(userId, x, y) {
    var roomImage = $('#room-image');
    x = Math.max(x, 22);
    x = Math.min(x, roomImage.width() - 22);
    y = Math.max(y, 22);
    y = Math.min(y, roomImage.height() - 22);
    var userDiv = $('#user-' + userId);
    userDiv.css({
        'top':y - 22,
        'left':x - 22
    });
}

function showChatBubble(user, message, type) {
    var bubbleClass = 'bubble right';
        if (type == 'whisper') {
            message = '<em>'+message+'</em>';
        }
//        if (message.search(/^:/) === 0) {
//            bubbleClass = 'oval-thought';
//        }
    var bubbleDiv = $("#user-" + user.id + "-chatBubble");
    if (bubbleDiv.length > 0) {
        bubbleDiv.find('p').html(message);
        var spike = $("#user-" + user.id + " .spike");
        bubbleDiv.attr('class', bubbleClass);
        bubbleDiv.show();
        spike.show();
    } else {
        bubbleDiv = $('<div/>', {
            class:bubbleClass,
            id:'user-' + user.id + '-chatBubble'
        });
        var spike = $('<div/>', {
            'class':'spike right'
        });
        var p = $('<p>' + message + '</p>');
        bubbleDiv.append(p);

        var userDiv = $("#user-" + user.id);
        spike.appendTo(userDiv);
        bubbleDiv.appendTo(userDiv);
    }
    setTimeout(function () {
        spike.hide();
        bubbleDiv.hide();
    }, 3000 + parseInt(message.length * 100));
}

function createUserDiv(user) {
    var div = $('<div/>');
    //div.style.width = '80px';
    div.attr("class", "userDiv");
    div.attr("id", "user-" + user.id);

    div.css("top", user.y - 22);
    div.css("left", user.x - 22);

    var userFace = document.createElement("div");
    userFace.setAttribute("class", "face");
    userFace.style.width = '44px';
    userFace.style.height = '44px';
    userFace.style.backgroundImage = "url('assets/faces/defaultsmileys.png')";
    userFace.style.backgroundRepeat = "no-repeat";
    userFace.style.backgroundPosition = "-1px -1px";
    div.append(userFace);

    var userName = $('<div/>');
    userName.attr("class", "name");
    userName.html(user.name);
    userName.appendTo(div);

    return div;
}

function setUserName(id, name) {
    var div = $("#user-" + id + " .name")
    div.css('left', (div.outerWidth() / -2) + 22);
}

function handleClickOnUser(user) {
    // clicking on yourself stops whispering
    if (user.id === me.id) {
        stopWhispering();
    } else {
//        alert('you clicked on ' + user.name);
        // clicking on a person you're already whispering with stops whispering
        if (me.isWhispering && me.isWhisperingTo == user.id){
            stopWhispering();
        } else {
            setUsersToTransparent(users);
            var whisperingUsers = {};
            whisperingUsers[user.id] = users[user.id];
            whisperingUsers[me.id] = me;
            setUsersToSolid(whisperingUsers);
            me.isWhispering = true;
            me.isWhisperingTo = user.id;
            $('#notification-area').html('Whispering to: ' + user.name + '<a class="close" href="#">&times;</a>').css('visibility', 'visible');
        }
    }
}

function stopWhispering() {
    setUsersToSolid(users);
    $('#notification-area').html('').css('visibility', 'hidden');
    me.isWhispering = false;
}

function setUsersToSolid(users){
    for (var user in users) {
        users[user].div.css('opacity', '1');
    }
}

function setUsersToTransparent(users){
    for (var user in users) {
        users[user].div.css('opacity', '0.5');
    }
}
