'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let fuze = new Operator(r6operators.fuze, operatorId.fuze, "N/A");

fuze.addCounterNode(operatorId.tachanka, counterType.soft, "Fuze's Cluster Charges can be used to take down a defender using Tachanka's Mounted LMG if its position is known.");
fuze.addCounterNode(operatorId.jager, counterType.soft, "Fuze's Cluster charges can waste Jäger's ADS total interceptions. Fuze gets three charges each with five sub-grenades (15 total) and Jäger's ADS can block two projectiles each (6 total). This means that one Cluster Charge has the potential to disable two Active Defense Systems.");
fuze.addCounterNode(operatorId.thunderbird, counterType.hard, "Fuze's Cluster charges can destroy Thunderbird's Kona Station.");

export default fuze