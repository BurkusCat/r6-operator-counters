'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let ash = new Operator(r6operators.ash, operatorId.ash, "N/A");

ash.addCounterNode(operatorId.castle, counterType.hard, "Ash's Breaching rounds can destroy Castle's Armor Panels.");
ash.addCounterNode(operatorId.maestro, counterType.hard, "Ash's Breaching rounds can destroy Maestro's Evil Eye cameras.");
ash.addCounterNode(operatorId.melusi, counterType.hard, "Ash's Breaching rounds can destroy Melusi's Banshee.");
ash.addCounterNode(operatorId.aruni, counterType.soft, "Ash's Breaching rounds can temporarily disable Aruni's Surya laser gates.")
ash.addCounterNode(operatorId.thunderbird, counterType.hard, "Ash's Breaching rounds can destroy Thunderbird's Kona Station.")
ash.addCounterNode(operatorId.thorn, counterType.hard, "Ash's Breaching rounds can destroy Azami's Kiba Barriers.")
ash.addCounterNode(operatorId.skopos, counterType.hard, "Ash's Breaching rounds can destroy Skopos' inactive shell.")
ash.addCounterNode(operatorId.goyo, counterType.hard, "Ash's Breaching rounds can destroy Goyo's Volcán Canisters.");
ash.addCounterNode(operatorId.kapkan, counterType.hard, "Ash's Breaching rounds can destroy Kapkan's EDDs when shooting barricades or deployable shields in doorways or windows.");
ash.addCounterNode(operatorId.mira, counterType.hard, "Ash's Breaching rounds can destroy Mira's Black Mirror.");

export default ash
