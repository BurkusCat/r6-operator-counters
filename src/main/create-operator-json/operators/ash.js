'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let ash = new Operator(r6operators.ash, operatorId.ash, "N/A");

ash.addCounterNode(operatorId.castle, counterType.hard, "Ash's Breaching rounds can destroy Castle's Armor Panels.");
ash.addCounterNode(operatorId.tachanka, counterType.soft, "Ash's Breaching Rounds can be used to destroy a deployable shield protecting Tachanka's Mounted LMG.");
ash.addCounterNode(operatorId.maestro, counterType.hard, "Ash's Breaching Rounds can destroy Maestro's Evil Eye cameras while they are closed.");
ash.addCounterNode(operatorId.melusi, counterType.hard, "Ash's Breaching rounds can destroy Melusi's Banshee.");
ash.addCounterNode(operatorId.aruni, counterType.soft, "Ash's Breaching rounds can temporarily disable Aruni's Surya laser gates.")
ash.addCounterNode(operatorId.thunderbird, counterType.hard, "Ash's Breaching rounds can destroy Thunderbird's Kona Station.")
ash.addCounterNode(operatorId.thorn, counterType.hard, "Ash's Breaching rounds can destroy Azami's Kiba Barriers.")

export default ash
