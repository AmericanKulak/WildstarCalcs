var lib = require("./Spells")
  , Player = lib.Player
  , Spell = lib.Spell;

(function() {

	var stepTime = 0.25;

	var Medic = function() {

		this.actuators = 4;
		this.addActuator = function(addition) {
			this.actuators += addition;
			if (this.actuators > 4)
				this.actuators = 4;
		}

		this.removeActuator = function(removal) {
			this.actuators -= removal;
			if (this.actuators < 0)
				throw new Error("Cannot use more actuators than we have. #programmerError  check to make sure we have actuators before cast.");
		}
	}

	Medic.prototype = new Player();

	var Discharge = function(tier) {
		this.name = "Discharge";
		this.tier = tier;

	}

	Discharge.prototype = new Spell();

	var discharge = new Spell();
	discharge.name = "Discharge";
	discharge.tier = 3;

	discharge.cast = function(medic) {
		var startTime = medic.time;
		medic.GCDtime = startTime + 1.25;
		discharge.step = function() {
			var timeFrame = medic.time - startTime;
			if(timeFrame - stepTime < 0.41 && 0.41 <= timeFrame)
			{
				discharge.tick();
			} else if (timeFrame - stepTime < 0.82 && 0.82 <= timeFrame) {
				discharge.tick();
			} else if (timeFrame - stepTime < 1.25 && 1.25 <= timeFrame) {
				discharge.tick();
				//medic.addActuator();
				medic.finishCast(this);
			}
		}

		discharge.tick = function() {
			var baseTickDamage = 448 + ((0.8961 + (this.tier * 0.0629)) * medic.abilityPower);

			medic.damageDealt(this.name, medic.modifyDamage(baseTickDamage));
		}
	}

	var Go = function() {
		var me = new Medic();
		me.cast(discharge);
		for (var i = 0; i < 5 / stepTime; i++) {
			me.time += stepTime;
			me.step();
		};
	}

	Go();

})();