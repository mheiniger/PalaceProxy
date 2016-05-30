PalaceProxy
===========

Purpose:
Having a proxy which deals with the (ugly) palace protocol on the server side, we can start building a fully html5 based chat client which connects with Websockets and uses much less ugly json data to communicate.

Getting started
---------------
You will need nodejs version 0.10

Install https://github.com/creationix/nvm
```
nvm install 0.10
nvm use 0.10
```


Install libpng-dev:
(its not automatically installed by npm)

Linux:
```sudo apt-get install libpng12-dev```

Mac OSX:
```
Download and unpack https://sourceforge.net/projects/libpng/files/ , cd into the folder
export LDFLAGS='-L/usr/local/opt/libpng/lib'
export CPPFLAGS='-I/usr/local/opt/libpng/include'
./configure && make && make install
brew install pkg-config
```

Clone the project and install dependecies with
```
git clone git://github.com/mheiniger/PalaceProxy.git
npm install
```

There is also a little protoype of a web-chat-client, to try out sending commands to the server:
```
node app.js
```
Afterwards open http://localhost:3000 in your Browser to connect.

To run tests, you will need to have a local palace server installed (see instructions below), then run ./runTests.sh

Where is this .as stuff coming from?
------------------------------------

Most of the code comes from https://github.com/theturtle32/OpenPalace.git which is written in Actionscript, which has to be translated to Javascript.

What other sources can help me develop?
---------------------------------------

There's a protocol description in http://www.palaceaholic.com/downloads/developers/pserver_sdk.zip called PalaceProtocolRef.wri

How to install a client for testing
-----------------------------------

Windows:
A fully rewritten client is here: http://pchat.org/

Linux:
You will have to use the original client and wine:
```
sudo apt-get install wine
wget http://www.palaceaholic.com/downloads/client/windows32/PalaceUserWin.exe
wine PalaceUserWin.exe
```
If you're installation is during endless, it's possible that wine has mounted drive z to
the linux root /. You can remove this drive with the tool `winecfg`

After its installed you can start it with:
```
~/.wine/drive_c/Program\ Files/Communities.com/ThePalace/Palace32.exe
```


How to setup a local palaceserver for testing
---------------------------------------------

Linux:

```
wget http://www.palaceaholic.com/downloads/server/linux/PalaceServerLinux.tar.gz
tar -xvzf PalaceServerLinux.tar.gz
cd pserver-4.5.1.i686-unknown-linux
sudo ./install
```

Use standard-answers for any install-questions.
For server registration code use for example this:
6DV3K-PVY6F-RF2VT-QFG8S

After installing the pserver you can start it with:
```
cd /usr/local/palace/bin
./start-palaces
```

pserver will listen on port 9998 by default.

Dev helper
----------

There's a loggingProxy to inspect and compare sent and received packets:
Usage:
````
node dev/loggingProxy.js 9997 localhost 9998
````
This will make the proxy listen on port 9997 and connect to a local palaceserver on localhost:9998.
As soon as its connected, it will create a log folder and inside a folder with the timestamp for the current session, so you will have each session in a separate folder.
You can now see every sent and received packet as a seperate file (i use mc to view them in HEX-mode)

This can help debugging:

https://github.com/dannycoates/node-inspector

Happy hacking!
