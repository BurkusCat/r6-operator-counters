import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let ying = new Operator(r6operators.ying, operatorId.ying, "Operation Blood Orchid");

export default ying