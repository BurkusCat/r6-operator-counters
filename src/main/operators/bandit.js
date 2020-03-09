import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let bandit = new Operator(r6operators.bandit, operatorId.bandit, "N/A");

export default bandit