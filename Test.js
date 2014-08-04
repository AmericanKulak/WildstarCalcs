var lib = require("./Medic")
  , Situation = require("./Situation");

var stepTime = 0.25;

Situation.debugMessages = false;
Situation.castMessages = true;
Situation.damageMessages = false;
Situation.resourceMessages = true;

var Go = function() {

	//Player Setup
	var me = new lib.Medic();
	me.abilityPower = 1954;

	//LAS Setup
	me.LAS.push(new lib.GammaRays(8));
	me.LAS.push(new lib.Discharge(8));


	Situation.setup({
		duration : 20,
		player : me,
		stepTime : 0.25
	});
	Situation.runSimulation();
	
	me.printDamage();
}

Go();