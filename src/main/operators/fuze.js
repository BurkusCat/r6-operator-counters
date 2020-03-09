import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let fuze = new Operator(r6operators.fuze, operatorId.fuze, "N/A");

export default fuze