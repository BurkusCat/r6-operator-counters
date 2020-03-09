import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let ela = new Operator(r6operators.ela, operatorId.ela, "Operation Blood Orchid");

export default ela