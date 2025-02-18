'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";
let thatcher = new Operator(r6operators.thatcher, operatorId.thatcher, "N/A");

thatcher.addCounterNode(operatorId.mute, counterType.hard, "Thatcher's EMP Grenades can destroy Mute's Signal Disruptors.");
thatcher.addCounterNode(operatorId.lesion, counterType.hard, "Thatcher's EMP Grenades can destroy Lesion's Gu mines.");
thatcher.addCounterNode(operatorId.smoke, counterType.soft, "Thatcher's EMP Grenades can destroy Smoke's Gas Grenades.");
thatcher.addCounterNode(operatorId.kapkan, counterType.hard, "Thatcher's EMP Grenades can destroy Kapkan's Entry Denial Devices.");
thatcher.addCounterNode(operatorId.ela, counterType.hard, "Thatcher's EMP Grenades can destroy Ela's Grzmot mines.");
thatcher.addCounterNode(operatorId.valkyrie, counterType.soft, "Thatcher's EMP Grenades can disable Valkyrie's Black Eyes for a short period of time.");
thatcher.addCounterNode(operatorId.jager, counterType.hard, "Thatcher's EMP Grenades can destroy Jäger's ADS with careful placement. However, ADS also counters EMP Grenades.");
thatcher.addCounterNode(operatorId.bandit, counterType.hard, "Thatcher's EMP Grenades can destroy Bandit's Shock Wire.");
thatcher.addCounterNode(operatorId.kaid, counterType.hard, "Thatcher's EMP Grenades can destroy Kaid's Electroclaws.");
thatcher.addCounterNode(operatorId.echo, counterType.soft, "Thatcher's EMP Grenades disables Echo's Drone and forces it to the ground.");
thatcher.addCounterNode(operatorId.pulse, counterType.soft, "Thatcher's EMP Grenades can can disable Pulse's Heartbeat Sensor for a period of time.");
thatcher.addCounterNode(operatorId.alibi, counterType.minor, "Thatcher's EMP grenades can disable Alibi's Prisma for a short period of time.");
thatcher.addCounterNode(operatorId.clash, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Clash's taser.");
thatcher.addCounterNode(operatorId.warden, counterType.soft, "Thatcher's EMP grenades can disable Warden's smart glasses.");
thatcher.addCounterNode(operatorId.mozzie, counterType.hard, "Thatcher's EMP Grenades can destroy Mozzie's Pests and disable hacked drones.");
thatcher.addCounterNode(operatorId.vigil, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Vigil's ERC-7.");
thatcher.addCounterNode(operatorId.melusi, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Melusi's Banshee.");
thatcher.addCounterNode(operatorId.thunderbird, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Thunderbird's Kona Station.");
thatcher.addCounterNode(operatorId.thorn, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Thorn's RazorBloom Shell.");
thatcher.addCounterNode(operatorId.solis, counterType.soft, "Thatcher's EMP Grenades can temporarily disable Solis' visor.");
thatcher.addCounterNode(operatorId.fenrir, counterType.hard, "Thatcher's EMP Grenades can disable Fenrir's Dread Mines and prevent Fenrir from activating his mines if he's caught in the EMP.");
thatcher.addCounterNode(operatorId.skopos, counterType.soft, "Thatcher's EMP Grenades can prevent Skopos from transfering shells.");


export default thatcher