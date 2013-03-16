var net = require('net'); // require the net module

var users = []; // keep track of the users

// setup a new tcp socket server
net.createServer(function(socket) { // provide a callback in case a new connection gets
    // established, socket is the socket object

    // keep track of this users names, via use of closures
    var name = '';

    // ask the new user for a name
    socket.write('Enter a Name(max 12 chars): ');

    // register a callback on the socket for the case of incoming data
    socket.on('data', function(buffer) { // buffer is a Buffer object containing the data
        if (name !== '') {  // in case this user has a name...

            // send out his message to all the other users...
            for(var i = 0; i < users.length; i++) {
                if (users[i] !== socket) { // ...but himself
                    users[i].write(name + ': '
                        + buffer.toString('ascii').trim()
                        + '\r\n');
                }
            }

            // otherwise take the data and use that as a name
        } else {
            name = buffer.toString('ascii').substring(0, 12).trim().replace(/\s/g, '_');
            socket.write('> You have joined as ' + name + '\r\n');

            // push this socket to the user list
            users.push(socket);
            for(var i = 0; i < users.length; i++) {
                if (users[i] !== socket) {
                    users[i].write('> ' + name + ' has joined' + '\r\n');
                }
            }
        }
    });

    // another callback for removing the user aka socket from the list
    socket.on('end', function() {
        users.splice(users.indexOf(socket), 1);
    });

// bind the server to port 8000
}).listen(8000);