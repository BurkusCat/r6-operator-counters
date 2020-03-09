import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let iq = new Operator(r6operators.iq, operatorId.iq, "N/A");

export default iq