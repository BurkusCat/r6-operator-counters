import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let maverick = new Operator(r6operators.maverick, operatorId.maverick, "Operation Grim Sky");

export default maverick