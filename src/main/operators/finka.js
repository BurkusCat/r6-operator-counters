import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let finka = new Operator(r6operators.finka, operatorId.finka, "Operation Chimera");

export default finka