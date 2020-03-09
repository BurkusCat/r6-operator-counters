import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let kaid = new Operator(r6operators.kaid, operatorId.kaid, "Operation Wind Bastion");

export default kaid