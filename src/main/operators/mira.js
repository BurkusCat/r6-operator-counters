import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let mira = new Operator(r6operators.mira, operatorId.mira, "Operation Velvet Shell");

export default mira