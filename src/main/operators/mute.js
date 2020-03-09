import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let mute = new Operator(r6operators.mute, operatorId.mute, "N/A");

export default mute