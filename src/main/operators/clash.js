'use strict';

import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let clash = new Operator(r6operators.clash, operatorId.clash, "Operation Grim Sky");

export default clash