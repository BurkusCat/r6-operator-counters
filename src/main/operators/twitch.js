import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let twitch = new Operator(r6operators.twitch, operatorId.twitch, "N/A");

export default twitch