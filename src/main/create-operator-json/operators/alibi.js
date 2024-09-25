'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let alibi = new Operator(r6operators.alibi, operatorId.alibi, "Operation Para Bellum");

export default alibi