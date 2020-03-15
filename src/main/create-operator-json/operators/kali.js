'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let kali = new Operator(r6operators.kali, operatorId.kali, "Operation Shifting Tides");

kali.addCounterNode(operatorId.goyo, counterType.hard, "Kali's Explosive Lance destroys Goyo's Volcan Shields.");
kali.addCounterNode(operatorId.bandit, counterType.hard, "Kali's Explosive Lance destroys Bandit's Shock Wires.");
kali.addCounterNode(operatorId.mute, counterType.hard, "Kali's Explosive Lance destroys Mute's Signal Disrupters.");
kali.addCounterNode(operatorId.maestro, counterType.hard, "Kali's Explosive Lance destroys Maestro's Evil Eyes.");
kali.addCounterNode(operatorId.castle, counterType.hard, "Kali's Explosive Lance destroys Castle's Armor Panels.");
kali.addCounterNode(operatorId.clash, counterType.hard, "Kali's CSRX 300 Rifle staggers and knocks Clash's CCE Shield aside.");

export default kali 