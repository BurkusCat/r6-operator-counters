import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let jager = new Operator(r6operators.jager, operatorId.jager, "N/A");

export default jager