import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let zofia = new Operator(r6operators.zofia, operatorId.zofia, "Operation White Noise");

export default zofia