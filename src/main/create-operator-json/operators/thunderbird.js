'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let thunderbird = new Operator(r6operators.thunderbird, operatorId.thunderbird, "North Star");

thunderbird.addCounterNode(operatorId.oryx, counterType.synergy, "Oryx can use the Kóna Station to compensate for the HP loss after breaking through walls using his Remah Dash.");

export default thunderbird