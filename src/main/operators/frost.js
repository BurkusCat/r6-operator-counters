import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let frost = new Operator(r6operators.frost, operatorId.frost, "Operation Black Ice");

frost.addCounterNode(operatorId.zofia, counterType.minor, "Zofia is not able to use her self-revive when trapped in one of Frost's Welcome Mats.");
frost.addCounterNode(operatorId.amaru, counterType.hard, "Amaru cannot shoot Frost's Welcome Mats when she is grappling to a window. She is guaranteed to be hit by the trap.");

export default frost