'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let thatcher = new Operator(r6operators.thatcher, operatorId.thatcher, "N/A");

thatcher.addCounterNode(operatorId.mute, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Mute's Signal Disruptors.");
thatcher.addCounterNode(operatorId.smoke, counterType.soft, "Thatcher's EMP Grenades can temporarily prevent Smoke's Gas Grenades from triggering.");
thatcher.addCounterNode(operatorId.kapkan, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Kapkan's EDDs.");
thatcher.addCounterNode(operatorId.ela, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Ela's Grzmot mines.");
thatcher.addCounterNode(operatorId.valkyrie, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Valkyrie's Black Eyes.");
thatcher.addCounterNode(operatorId.jager, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Jäger's ADS when thrown carefully. However, ADS also counters EMP Grenades.");
thatcher.addCounterNode(operatorId.bandit, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Bandit's Shock Wire.");
thatcher.addCounterNode(operatorId.kaid, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Kaid's Electroclaws.");
thatcher.addCounterNode(operatorId.echo, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Echo's Drone, forcing it to fall to the ground.");
thatcher.addCounterNode(operatorId.pulse, counterType.soft, "Thatcher's EMP Grenades can can disable Pulse's Heartbeat Sensor.");
thatcher.addCounterNode(operatorId.alibi, counterType.minor, "Thatcher's EMP grenades can temporarily disable Alibi's Prisma.");
thatcher.addCounterNode(operatorId.clash, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Clash's taser.");
thatcher.addCounterNode(operatorId.warden, counterType.soft, "Thatcher's EMP grenades can temporarily disable Warden's smart glasses.");
thatcher.addCounterNode(operatorId.mozzie, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Mozzie's Pests and disable hacked drones.");
thatcher.addCounterNode(operatorId.vigil, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Vigil's ERC-7.");
thatcher.addCounterNode(operatorId.melusi, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Melusi's Banshee.");
thatcher.addCounterNode(operatorId.thunderbird, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Thunderbird's Kona Station.");
thatcher.addCounterNode(operatorId.thorn, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Thorn's RazorBloom Shell.");
thatcher.addCounterNode(operatorId.solis, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Solis' visor.");
thatcher.addCounterNode(operatorId.fenrir, counterType.hard, "Thatcher's EMP Grenades can temporarily disable Fenrir's Dread Mines and prevent Fenrir from activating his mines if he's caught in the EMP.");
thatcher.addCounterNode(operatorId.skopos, counterType.soft, "Thatcher's EMP Grenades can temporarily prevent Skopos from transfering shells.");

export default thatcher
