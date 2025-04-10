'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let kali = new Operator(r6operators.kali, operatorId.kali, "Operation Shifting Tides");

kali.addCounterNode(operatorId.goyo, counterType.hard, "Kali's Explosive Lance can destroy Goyo's Volcán Canisters.");
kali.addCounterNode(operatorId.bandit, counterType.hard, "Kali's Explosive Lance can destroy Bandit's Shock Wires, even through reinforced walls.");
kali.addCounterNode(operatorId.mute, counterType.hard, "Kali's Explosive Lance can destroy Mute's Signal Disrupters.");
kali.addCounterNode(operatorId.maestro, counterType.hard, "Kali's Explosive Lance can destroy Maestro's Evil Eyes.");
kali.addCounterNode(operatorId.castle, counterType.hard, "Kali's Explosive Lance can destroy Castle's Armor Panels.");
kali.addCounterNode(operatorId.clash, counterType.soft, "Kali's CSRX 300 Rifle staggers and knocks Clash's CCE Shield aside.");
kali.addCounterNode(operatorId.castle, counterType.hard, "Kali's Explosive Lance can destroy Melusi's Banshee.");
kali.addCounterNode(operatorId.thunderbird, counterType.hard, "Kali's Explosive Lance can destroy Thunderbird's Kona Station.");
kali.addCounterNode(operatorId.azami, counterType.hard, "Kali's Explosive Lance can destroy Azami's Kiba Barrier.");
kali.addCounterNode(operatorId.jager, counterType.hard, "Kali's Explosive Lance can destroy Jäger's ADS if thrown carefully. However, ADS counters Kali's Explosive Lance.");
kali.addCounterNode(operatorId.kaid, counterType.hard, "Kali's Explosive Lance can destroy Kaid's Electroclaw, even through reinforced walls.");
kali.addCounterNode(operatorId.kapkan, counterType.hard, "Kali's Explosive Lance can destroy Kapkan's EDDs.");
kali.addCounterNode(operatorId.lesion, counterType.hard, "Kali's Explosive Lance can destroy Lesion's Gu mines.");
kali.addCounterNode(operatorId.mira, counterType.hard, "Kali's Explosive Lance can destroy Mira's Black Mirror.");

export default kali 
