'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let goyo = new Operator(r6operators.goyo, operatorId.goyo, "Operation Ember Rise");

goyo.addCounterNode(operatorId.twitch, counterType.minor, "Goyo's Volcán Shield cannot be detonated by Twitch's Drones.");

export default goyo