import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let rook = new Operator(r6operators.rook, operatorId.rook, "N/A");

export default rook