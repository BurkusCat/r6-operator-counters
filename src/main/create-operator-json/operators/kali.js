'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let kali = new Operator(r6operators.kali, operatorId.kali, "Operation Shifting Tides");

kali.addCounterNode(operatorId.goyo, counterType.hard, "Kali's Explosive Lance destroys Goyo's Volcan Shields.");
kali.addCounterNode(operatorId.bandit, counterType.hard, "Kali's Explosive Lance destroys Bandit's Shock Wires.");
kali.addCounterNode(operatorId.mute, counterType.hard, "Kali's Explosive Lance destroys Mute's Signal Disrupters.");
kali.addCounterNode(operatorId.maestro, counterType.hard, "Kali's Explosive Lance destroys Maestro's Evil Eyes.");
kali.addCounterNode(operatorId.castle, counterType.hard, "Kali's Explosive Lance destroys Castle's Armor Panels.");
kali.addCounterNode(operatorId.clash, counterType.hard, "Kali's CSRX 300 Rifle staggers and knocks Clash's CCE Shield aside.");
kali.addCounterNode(operatorId.castle, counterType.hard, "Kali's Explosive Lance destroys Melusi's Banshee.");
kali.addCounterNode(operatorId.thunderbird, counterType.hard, "Kali's Explosive Lance destroys Thunderbird's Kona Station.");
kali.addCounterNode(operatorId.azami, counterType.hard, "Kali's Explosive Lance destroys Azami's Kiba Barrier.");

export default kali 
