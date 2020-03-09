import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let nokk = new Operator(r6operators.nokk, operatorId.nokk, "Operation Phantom Sight");

export default nokk