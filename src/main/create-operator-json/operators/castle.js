'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let castle = new Operator(r6operators.castle, operatorId.castle, "N/A");

castle.addCounterNode(operatorId.amaru, counterType.hard, "Castle's Armor Panels prevent Amaru's Garra Hook from targeting windows.");


export default castle