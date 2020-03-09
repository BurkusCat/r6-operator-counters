import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let frost = new Operator(r6operators.frost, operatorId.frost, "Operation Black Ice");

export default frost