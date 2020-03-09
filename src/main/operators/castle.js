import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let castle = new Operator(r6operators.castle, operatorId.castle, "N/A");

export default castle