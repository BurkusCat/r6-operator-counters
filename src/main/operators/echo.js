import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let echo = new Operator(r6operators.echo, operatorId.echo, "Operation Red Crow");

export default echo