import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let caviera = new Operator(r6operators.caveira, operatorId.caviera, "Operation Skull Rain");

caviera.addCounterNode(operatorId.jackal, counterType.hard, "When Caveira is using Silent Step, she leaves no footsteps and therefore cannot be scanned by Jackal's Eyenox.")
caviera.addCounterNode(operatorId.blackbeard, counterType.minor, "Caveira's Lusion pistol can destroy Blackbeard's Rifle-Shield in a single shot at close range.");


export default caviera