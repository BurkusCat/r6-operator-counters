import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let hibana = new Operator(r6operators.hibana, operatorId.hibana, "Operation Red Crow");

export default hibana