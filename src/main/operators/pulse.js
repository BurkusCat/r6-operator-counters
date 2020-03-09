import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let pulse = new Operator(r6operators.pulse, operatorId.pulse, "N/A");

export default pulse