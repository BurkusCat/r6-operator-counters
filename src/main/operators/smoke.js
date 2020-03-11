'use strict';

import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let smoke = new Operator(r6operators.smoke, operatorId.smoke, "N/A");

smoke.addCounterNode(operatorId.rook, counterType.hard, "Smoke's 3 Gas Grenades are very effective against Montagne.");
smoke.addCounterNode(operatorId.blitz, counterType.hard, "Smoke's 3 Gas Grenades are very effective against Blitz.");
smoke.addCounterNode(operatorId.fuze, counterType.soft, "Smoke's 3 Gas Grenades are very effective against a Fuze with a shield.");
smoke.addCounterNode(operatorId.finka, counterType.soft, "Smoke's Gas Grenades deal 50% more damage to Attackers boosted by Finka's Adrenal Surge.");
smoke.addCounterNode(operatorId.recruit, counterType.soft, "Smoke's 3 Gas Grenades are very effective against a Recruit with a shield.");


export default smoke