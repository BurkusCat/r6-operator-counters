import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let nomad = new Operator(r6operators.nomad, operatorId.nomad, "Operation Wind Bastion");

export default nomad