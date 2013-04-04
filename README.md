PalaceProxy
===========

First experiments to write a proxy for ThePalace in NodeJs

How to setup a local palaceserver for testing
=============================================

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