import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let dokkaebi = new Operator(r6operators.dokkaebi, operatorId.dokkaebi, "Operation White Noise");

export default dokkaebi