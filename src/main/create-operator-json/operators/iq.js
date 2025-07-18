'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let iq = new Operator(r6operators.iq, operatorId.iq, "N/A");

iq.addCounterNode(operatorId.pulse, counterType.hard, "IQ's Electronics Detector can detect Pulse's Heartbeat Sensor and therefore him.");
iq.addCounterNode(operatorId.mute, counterType.soft, "IQ's Electronics Detector can detect Mute's Signal Disruptors.");
iq.addCounterNode(operatorId.kapkan, counterType.soft, "IQ's Electronics Detector can detect Kapkan's EDDs.");
iq.addCounterNode(operatorId.jager, counterType.minor, "IQ's Electronics Detector can detect Jäger's ADS.");
iq.addCounterNode(operatorId.bandit, counterType.minor, "IQ's Electronics Detector can detect Bandit's Shock Wires.");
iq.addCounterNode(operatorId.smoke, counterType.minor, "IQ's Electronics Detector can detect Smoke's Gas Grenades.");
iq.addCounterNode(operatorId.valkyrie, counterType.hard, "IQ's Electronics Detector can detect Valkyrie's Black Eye cameras.");
iq.addCounterNode(operatorId.echo, counterType.hard, "IQ's Electronics Detector can detect Echo's Yokai drones, his wrist phone and therefore him.");
iq.addCounterNode(operatorId.ela, counterType.soft, "IQ's Electronics Detector can detect Ela's Grzmot mines.");
iq.addCounterNode(operatorId.vigil, counterType.hard, "IQ's Electronics Detector can detect Vigil while he is using his ERC-7 ability.");
iq.addCounterNode(operatorId.maestro, counterType.minor, "IQ's Electronics Detector can detect Maestro's Evil Eyes.");
iq.addCounterNode(operatorId.alibi, counterType.soft, "IQ's Electronics Detector can detect Alibi's Prismas.");
iq.addCounterNode(operatorId.clash, counterType.minor, "IQ's Electronics Detector can detect Clash's Electro Shield while it is firing.");
iq.addCounterNode(operatorId.mozzie, counterType.hard, "IQ's Electronics Detector can detect Mozzie's Pests or Attacker drones that have been hacked by a Pest.");
iq.addCounterNode(operatorId.warden, counterType.hard, "IQ's Electronics Detector can detect Warden's smart glasses while they are active.");
iq.addCounterNode(operatorId.kaid, counterType.soft, "IQ's Electronics Detector can detect Kaid's electroclaws.");
iq.addCounterNode(operatorId.thunderbird, counterType.soft, "IQ's Electronics Detector can detect Thunderbird's Kona Stations.");
iq.addCounterNode(operatorId.thorn, counterType.soft, "IQ's Electronics Detector can detect Thorns's Razorbloom Shell.")
iq.addCounterNode(operatorId.solis, counterType.hard, "IQ's Electronics Detector can detect Solis' visor while it is active.")
iq.addCounterNode(operatorId.fenrir, counterType.hard, "IQ's Electronics Detector can detect Fenrir's Dread Mines.");
iq.addCounterNode(operatorId.skopos, counterType.hard, "IQ's Electronics Detector can detect Skopos' inactive shell.");

export default iq
