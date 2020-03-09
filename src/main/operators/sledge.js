import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let sledge = new Operator(r6operators.sledge, operatorId.sledge, "N/A");

export default sledge