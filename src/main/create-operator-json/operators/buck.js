'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let buck = new Operator(r6operators.buck, operatorId.buck, "Operation Black Ice");
buck.addCounterNode(operatorId.bandit, counterType.minor, "Buck's Skeleton Key can destroy Bandit's Shock wire by shooting it through the floor vertically.");
buck.addCounterNode(operatorId.kaid, counterType.minor, "Buck's Skeleton Key can destroy Kaid's Electroclaws by shooting at them through the cieling vertically.")

export default buck
