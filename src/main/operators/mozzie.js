import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let mozzie = new Operator(r6operators.mozzie, operatorId.mozzie, "Operation Burnt Horizon");

export default mozzie