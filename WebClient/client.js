var socket = io.connect('http://localhost');
var users = {};
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
//    room.style.width = img.width;
//    stage.style.height = img.height;
});
socket.on('userEntered', function(data){
    users[data.user.id] = data.user;
    console.log(data.user.name);
    var div = createUserDiv(data.user);
    $('#room-stage').append(div);
});

socket.on('userMoved', function(data){
    console.log(data.user);
    var user = data.user;
    var userDiv = $('#user-' + user.id);
    userDiv.style.top = user.y - 22;
    userDiv.style.left = user.x - 22;
});

socket.on('userLeft', function(data){
    var user = data.user;
    $('#user-' + user.id).remove();
});

function createUserDiv(user){
    var div = document.createElement("div");
    //div.style.width = '80px';
    div.id = "user-" + user.id;
    div.style.height = "20px";
    div.style.background = "yellow";
    div.style.color = "black";
    div.innerHTML = user.name;
    div.style.position = "absolute";
    div.style.zIndex = 10;
    div.style.top = user.y - 22;
    div.style.left = user.x - 22;

    return div;
}
