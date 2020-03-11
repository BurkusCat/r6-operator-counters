'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let maestro = new Operator(r6operators.maestro, operatorId.maestro, "Operation Para Bellum");

export default maestro