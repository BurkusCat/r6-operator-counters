import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let glaz = new Operator(r6operators.glaz, operatorId.glaz, "N/A");

export default glaz