import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let smoke = new Operator(r6operators.smoke, operatorId.smoke, "N/A");

export default smoke