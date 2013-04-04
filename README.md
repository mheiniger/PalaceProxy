PalaceProxy
===========

First experiments to write a proxy for ThePalace in NodeJs

Getting started
---------------
You will need nodejs and npm.
* how to install most actual nodejs version - http://stackoverflow.com/questions/5123533/how-can-i-uninstall-or-upgrade-my-old-node-js-version
Clone the project and install dependecies with
```
git clone git://github.com/mheiniger/PalaceProxy.git
npm install -l
```

During first stages of development, use following to start Palaceproxy:
```
nodejs app_test.js localhost 9998
```

Where is this .as stuff coming from?
------------------------------------

Most of the code comes from https://github.com/theturtle32/OpenPalace.git which is written in Actionscript, which has to be translated to Javascript.

How to setup a local palaceserver for testing
---------------------------------------------

Linux:

```
wget http://www.palaceaholic.com/downloads/server/linux/PalaceServerLinux.tar.gz
tar -xvzf PalaceServerLinux.tar.gz
cd pserver-4.5.1.i686-unknown-linux
./install
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

Happy hacking!
