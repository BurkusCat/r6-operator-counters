import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let vigil = new Operator(r6operators.vigil, operatorId.vigil, "Operation White Noise");

export default vigil