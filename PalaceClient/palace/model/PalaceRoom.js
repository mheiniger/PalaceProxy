/*
This file is part of OpenPalace.

OpenPalace is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

OpenPalace is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with OpenPalace.  If not, see <http://www.gnu.org/licenses/>.
*/

//package net.codecomposer.palace.model
//{
	/* \[Bindable\] */
	function PalaceRoom()
	{
    this.constants = {};
		var name = this.name/* :String */;
		var id = this.id/* :int */;
		var flags = this.flags/* :int */;
		var userCount = this.userCount/* :int */;
		
		var PalaceRoom = this.PalaceRoom = function()
		{
		}

	}
//}

module.exports = PalaceRoom;
var PalaceRoomVar = new PalaceRoom();
for (name in PalaceRoomVar.constants) {
   module.exports[name] = PalaceRoomVar.constants[name];
}