import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let amaru = new Operator(r6operators.amaru, operatorId.amaru, "Operation Ember Rise");

export default amaru