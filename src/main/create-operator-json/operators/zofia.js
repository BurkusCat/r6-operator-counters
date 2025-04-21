'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let zofia = new Operator(r6operators.zofia, operatorId.zofia, "Operation White Noise");

zofia.addCounterNode(operatorId.ela, counterType.soft, "Zofia is affected for a reduced amount of time by Ela's Grzmot mines.");
zofia.addCounterNode(operatorId.echo, counterType.soft, "Zofia is affected for a reduced amount of time by Echo's Yokai drone.");
zofia.addCounterNode(operatorId.clash, counterType.hard, "Zofia's Concussion Grenades can make Clash very vulnerable.");
zofia.addCounterNode(operatorId.castle, counterType.hard, "Zofia's Impact Grenades can destroy Castle's Armor Panels.");
zofia.addCounterNode(operatorId.maestro, counterType.hard, "Zofia's Impact Grenades can destroy Maestro's Evil Eye cameras.");
zofia.addCounterNode(operatorId.melusi, counterType.hard, "Zofia's Impact Grenades can destroy Melusi's Banshee.");
zofia.addCounterNode(operatorId.aruni, counterType.hard, "Zofia's Impact Grenades can temporarily disable Aruni's Surya laser gates.");
zofia.addCounterNode(operatorId.thunderbird, counterType.hard, "Zofia's Impact Grenades can destroy Thunderbird's Kona Stations.");
zofia.addCounterNode(operatorId.azami, counterType.hard, "Zofia's Impact Grenades can destroy Azami's Kiba Barriers.");
zofia.addCounterNode(operatorId.skopos, counterType.hard, "Zofia's Impact Grenades can destroy Skopos' inactive shell.")
zofia.addCounterNode(operatorId.goyo, counterType.hard, "Zofia's Impact Grenades can destroy Goyo's Volcán Canisters.");

export default zofia
