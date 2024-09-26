'use strict';
import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let thermite = new Operator(r6operators.thermite, operatorId.thermite, "N/A");

export default thermite