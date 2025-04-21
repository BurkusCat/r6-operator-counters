'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let smoke = new Operator(r6operators.smoke, operatorId.smoke, "N/A");

smoke.addCounterNode(operatorId.montagne, counterType.soft, "Smoke's 3 Gas Grenades are very effective against Montagne.");
smoke.addCounterNode(operatorId.blitz, counterType.soft, "Smoke's 3 Gas Grenades are very effective against Blitz.");
smoke.addCounterNode(operatorId.fuze, counterType.soft, "Smoke's 3 Gas Grenades are very effective against a Fuze with a shield.");
smoke.addCounterNode(operatorId.finka, counterType.soft, "Smoke's Gas Grenades deal double amount of damage to Attackers boosted by Finka's Adrenal Surge.");

export default smoke
