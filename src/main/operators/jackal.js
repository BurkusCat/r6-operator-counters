import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let jackal = new Operator(r6operators.jackal, operatorId.jackal, "Operation Velvet Shell");

export default jackal