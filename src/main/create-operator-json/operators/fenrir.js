'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let fenrir = new Operator(r6operators.fenrir, operatorId.fenrir, "Operation Dead Factor");

export default fenrir