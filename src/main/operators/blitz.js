'use strict';

import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let blitz = new Operator(r6operators.blitz, operatorId.blitz, "N/A");

export default blitz