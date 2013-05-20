var socket = io.connect('http://localhost');
var users = {};
var me = {};
socket.on('log', function (data) {
    var logWindow = $('#log');
    logWindow.append(data.text + '<br>');
    logWindow.animate({"scrollTop": $('#log')[0].scrollHeight}, "slow");
});
socket.on('dev-log', function (data) {
    console.log(data);
});
socket.on('roomChanged', function (roomData, mediaServer) {
    console.log(roomData);
    var room = $('#room');
    var roomName = $('#room-name');
    var stage = $('#room-stage');
    var roomImage = $('#room-image');
    roomImage.attr('src', mediaServer + roomData.backgroundFile);
    roomName.html(roomData.name);
    $('.userDiv').remove();
//    room.style.width = img.width;
//    stage.style.height = img.height;
});
socket.on('userEntered', function(data){
    users[data.user.id] = data.user;
    if(data.user.isSelf === true) {
        me = data.user;
    }
    console.log(data.user);
    var div = createUserDiv(data.user);
    $('#room-stage').append(div);
});

socket.on('userMoved', function(data){
    console.log(data.user);
    var user = data.user;
    moveUser(user.id, user.x, user.y);
});

socket.on('userLeft', function(data){
    var user = data.user;
    $('#user-' + user.id).remove();
});

$("#room-image").click(function(e){
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    socket.emit('userMoved', { 'x': x, 'y': y });
    moveUser(me.id, x, y);
});

$('#input').on('keypress' ,function(e){
    if (!e) e = window.event;
    if (e.keyCode == '13'){
        socket.emit('chat', { 'text': this.value });
        this.value = '';
        return false;
    }
});

function moveUser(userId, x, y) {
    var roomImage = $('#room-image');
    x = Math.max(x, 22);
    x = Math.min(x, roomImage.width() - 22);
    y = Math.max(y, 22);
    y = Math.min(y, roomImage.height() - 22);
    var userDiv = $('#user-' + userId);
    userDiv.css({
        'top' : y - 22,
        'left' : x - 22
    });
}

function createUserDiv(user){
    var div = document.createElement("div");
    //div.style.width = '80px';
    div.setAttribute("class", "userDiv");
    div.id = "user-" + user.id;
    div.innerHTML = user.name;
    div.style.top = user.y - 22;
    div.style.left = user.x - 22;

    return div;
}
