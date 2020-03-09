import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let doc = new Operator(r6operators.doc, operatorId.doc, "N/A");

export default doc