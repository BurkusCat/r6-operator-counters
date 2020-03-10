import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let finka = new Operator(r6operators.finka, operatorId.finka, "Operation Chimera");

finka.addCounterNode(operatorId.ela, counterType.soft, "Finka's Adrenal Surge reduces the duration that Ela's Grzmot mines affect Attackers.");
finka.addCounterNode(operatorId.caviera, counterType.soft, "Finka can use her Adrenal Surge to revive a downed ally preventing an interrogation from Caveira. This ally cannot be downed again.");


export default finka