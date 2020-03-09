import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let montagne = new Operator(r6operators.montagne, operatorId.montagne, "N/A");

export default montagne