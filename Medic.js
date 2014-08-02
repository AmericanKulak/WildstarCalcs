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

		var $this = this;

		this.name = "Discharge";
		this.tier = tier;

		this.cast = function(medic) {

			var startTime = medic.time;
			medic.GCDtime = startTime + 1.25;

			$this.step = function() {
				var timeFrame = medic.time - startTime;
				if(timeFrame - stepTime < 0.41 && 0.41 <= timeFrame)
				{
					tick();
				} else if (timeFrame - stepTime < 0.82 && 0.82 <= timeFrame) {
					tick();
				} else if (timeFrame - stepTime < 1.25 && 1.25 <= timeFrame) {
					tick();
					medic.addActuator();
					medic.finishCast(this);
				}
			}

			var tick = function() {
				var baseTickDamage = 213 + ((0.0327 + ($this.tier * 0.0070)) * medic.abilityPower);

				medic.damageDealt($this.name, medic.modifyDamage(baseTickDamage));
			}
		}

		this.canCast = function(medic) {
			return true;
		}

	}

	Discharge.prototype = new Spell();


	var Go = function() {
		var me = new Medic();
		me.abilityPower = 1917;
		me.LAS.push(new Discharge(0));
		for (var i = 0; i < 5 / stepTime; i++) {
			me.step(stepTime);
		};

		me.printDamage();
	}

	Go();

})();