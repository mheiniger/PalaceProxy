var socket = io.connect('http://localhost');
var users = {};
socket.on('log', function (data) {
    var logWindow = document.getElementById('log');
    logWindow.innerHTML = logWindow.innerHTML + data.text + '<br>';
    logWindow.scrollTop = logWindow.scrollHeight;
});
socket.on('dev-log', function (data) {
    console.log(data);
});
socket.on('roomChanged', function (roomData, mediaServer) {
    console.log(roomData);
    var room = document.getElementById('room');
    var roomName = document.getElementById('room-name')
    var stage = document.getElementById('room-stage');
    var roomImage = document.getElementById('room-image');
    roomImage.src = mediaServer + roomData.backgroundFile;
    roomName.innerHTML = roomData.name;
//    room.style.width = img.width;
//    stage.style.height = img.height;
});
socket.on('userEntered', function(data){
    users[data.user.id] = data.user;
    console.log(data.user.name);
    var div = createUserDiv(data.user);
    document.getElementById('room-stage').appendChild(div);
});

socket.on('userMoved', function(data){
    console.log(data.user);
    var user = data.user;
    var userDiv = document.getElementById('user-' + user.id);
    userDiv.style.top = user.y - 22;
    userDiv.style.left = user.x - 22;
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
