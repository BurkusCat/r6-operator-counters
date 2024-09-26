'use strict';
import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let thorn = new Operator(r6operators.thorn, operatorId.thorn, "Operation High Calibre");

export default thorn