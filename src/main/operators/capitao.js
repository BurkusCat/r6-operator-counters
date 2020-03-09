import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let capitao = new Operator(r6operators.capitao, operatorId.capitao, "Operation Skull Rain");

export default capitao