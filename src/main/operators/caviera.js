import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let caviera = new Operator(r6operators.caviera, operatorId.caviera, "Operation Skull Rain");

export default caviera