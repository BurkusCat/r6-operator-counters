import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let alibi = new Operator(r6operators.alibi, operatorId.alibi, "Operation Para Bellum");

export default alibi