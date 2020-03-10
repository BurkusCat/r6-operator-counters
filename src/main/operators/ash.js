import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let ash = new Operator(r6operators.ash, operatorId.ash, "N/A");

ash.addCounterNode(operatorId.castle, counterType.hard, "Ash's Breaching rounds can destroy Castle's Armor Panels.");
ash.addCounterNode(operatorId.tachanka, counterType.soft, "Ash's Breaching Rounds can be used to destroy a deployable shield protecting Tachanka's Mounted LMG.");
ash.addCounterNode(operatorId.maestro, counterType.hard, "Ash's Breaching Rounds can destroy Maestro's Evil Eye cameras while they are closed.");

export default ash