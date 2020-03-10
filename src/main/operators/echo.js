import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let echo = new Operator(r6operators.echo, operatorId.echo, "Operation Red Crow");

echo.addCounterNode(operatorId.dokkabi, counterType.hard, "Echo's Yokai drone camera cannot be hacked by Dokkaebi. Echo does not drop a phone upon death. In addition, Echo is unaffected by Dokkaebi's Logic Bomb.");
echo.addCounterNode(operatorId.jackal, counterType.soft, "Echo's Yokai drone will cause Jackal's goggles to be kicked off.");


export default echo