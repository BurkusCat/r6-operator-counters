import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let thatcher = new Operator(r6operators.thatcher, operatorId.thatcher, "N/A");

export default thatcher