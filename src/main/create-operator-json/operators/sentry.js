'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let sentry = new Operator(r6operators.sentry, operatorId.sentry, "Operation New Blood");

export default sentry