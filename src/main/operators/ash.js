import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let ash = new Operator(r6operators.ash, operatorId.ash, "N/A");

export default ash