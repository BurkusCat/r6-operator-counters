import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let gridlock = new Operator(r6operators.gridlock, operatorId.gridlock, "N/A");

export default gridlock