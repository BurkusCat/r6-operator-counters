'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let zofia = new Operator(r6operators.zofia, operatorId.zofia, "Operation White Noise");

zofia.addCounterNode(operatorId.ela, counterType.soft, "Zofia is affected for a reduced amount of time by Ela's Grzmot mines.");
zofia.addCounterNode(operatorId.echo, counterType.soft, "Zofia is affected for a reduced amount of time by Echo's Yokai drone.");
zofia.addCounterNode(operatorId.clash, counterType.hard, "Zofia's Concussion Grenades can make Clash very vulnerable.");
zofia.addCounterNode(operatorId.castle, counterType.hard, "Zofia's Impact Grenades can destroy Castle's Armor Panels.");
zofia.addCounterNode(operatorId.maestro, counterType.hard,  "Zofia's Impact Grenades can destroy Maestro's Evil Eye cameras while they are closed.");
zofia.addCounterNode(operatorId.melusi, counterType.hard, "Zofia's Impact Grenades can destroy Melusi's Banshee.");

export default zofia