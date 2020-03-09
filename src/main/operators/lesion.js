import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let lesion = new Operator(r6operators.lesion, operatorId.lesion, "Operation Blood Orchid");

export default lesion