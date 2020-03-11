'use strict';

import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let ela = new Operator(r6operators.ela, operatorId.ela, "Operation Blood Orchid");

ela.addCounterNode(operatorId.montagne, counterType.hard, "Ela's Grzmot Mines will disorient Montagne, preventing him from extending his shield.");
ela.addCounterNode(operatorId.blitz, counterType.soft, "Ela's Grzmot Mines will disorient Blitz preventing him from sprinting with his shield up.");
ela.addCounterNode(operatorId.jackal, counterType.soft, "Ela's Grzmot Mines will disorient Jackal, causing him to kick off his goggles.");
ela.addCounterNode(operatorId.zofia, counterType.soft,  "Ela can recover quickly if hit by one of Zofia's Concussion Grenades.");


export default ela