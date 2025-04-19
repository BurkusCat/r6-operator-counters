'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let fuze = new Operator(r6operators.fuze, operatorId.fuze, "N/A");

fuze.addCounterNode(operatorId.jager, counterType.soft, "Fuze's Cluster charges can waste Jäger's ADS total interceptions. Fuze gets four charges each with five sub-grenades (20 total) and Jäger's ADS can block two projectiles each (6 total). This means that one Cluster Charge has the potential to disable two Active Defense Systems.");
fuze.addCounterNode(operatorId.thunderbird, counterType.hard, "Fuze's Cluster charges can destroy Thunderbird's Kona Stations.");
fuze.addCounterNode(operatorId.melusi, counterType.hard, "Fuze's Cluster charges can destroy Melusi's Banshees.");

export default fuze
