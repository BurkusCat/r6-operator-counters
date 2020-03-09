import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let recruit = new Operator(r6operators.recruit, operatorId.recruit, "N/A");

export default recruit