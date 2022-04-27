'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let osa = new Operator(r6operators.osa, operatorId.osa, "Crystal Guard");

export default osa