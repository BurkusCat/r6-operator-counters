import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let kapkan = new Operator(r6operators.kapkan, operatorId.kapkan, "N/A");

export default kapkan