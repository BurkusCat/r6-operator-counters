'use strict';

import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let thermite = new Operator(r6operators.thermite, operatorId.thermite, "N/A");

export default thermite