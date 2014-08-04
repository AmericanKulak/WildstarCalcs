var Player = require("./Player")
  , Spell = require("./Spell")
  , util = require("util")
  , situation = require("./Situation");

(function() {

	//******************************************
	// Base Medic
	//******************************************

	var Medic = function() {
		Player.apply(this, Array.prototype.slice.call(arguments))

		this.actuators = 4;
	}

	util.inherits(Medic, Player);

	Medic.prototype.addActuator = function(addition) {
		this.actuators += addition;
		if (this.actuators > 4)
			this.actuators = 4;
		logActuators(this.actuators);
	}

	Medic.prototype.removeActuator = function(removal) {
		this.actuators -= removal;
		if (this.actuators < 0)
			throw new Error("Cannot use more actuators than we have. #programmerError  check to make sure we have actuators before cast.");
		logActuators(this.actuators);
	}

	var logActuators = function(actuators) {
		var message = "";
		if(actuators == 0)
			message = "- - - -";
		else if(actuators == 1)
			message = "O - - -";
		else if(actuators == 2)
			message = "O O - -";
		else if(actuators == 3)
			message = "O O O -";
		else
			message = "O O O O";
		situation.log("resource", message);
	}

	//******************************************
	// Discharge
	//******************************************

	var Discharge = function() {
		Spell.apply(this, Array.prototype.slice.call(arguments));

		this.name = "Discharge";
	}

	util.inherits(Discharge, Spell);

	Discharge.prototype.cast = function(medic) {
		this.startTime = medic.time;
		this.castProgress = 0;
		medic.GCDTime = this.startTime + 1.25;
	}

	Discharge.prototype.step = function(medic) {
		var $this = this;
		
		var stepTime = updateProgressAndGetStepTime();

		if(this.castProgress - stepTime < 0.41 && 0.41 <= this.castProgress) {
			tick();
		} else if (this.castProgress - stepTime < 0.82 && 0.82 <= this.castProgress) {
			tick();
		} else if (this.castProgress - stepTime < 1.25 && 1.25 <= this.castProgress) {
			tick();
			if(this.tier >= 4) tier4Damage();
			medic.addActuator(this.tier == 8 ? 2 : 1);
			medic.finishCast(this);
		}

		function updateProgressAndGetStepTime() {
			var oldProgress = $this.castProgress;
			$this.castProgress = medic.time - $this.startTime;
			return $this.castProgress - oldProgress;
		}

		function tick() {
			var baseTickDamage = 213 + ((0.0982 + ($this.tier * 0.021)) * medic.abilityPower);
			medic.dealDamage($this, baseTickDamage);
		}

		function tier4Damage() {
			var baseDamage = (0.252 * medic.abilityPower);
			medic.dealDamage($this, baseDamage);
		}
	}

	//******************************************
	// Gamma Rays
	//******************************************

	var GammaRays = function() {
		Spell.apply(this, Array.prototype.slice.call(arguments));

		this.tier4CastCounter = 0;
		this.tier8CooldownTimer = -2; //guarantees the first one will proc bonus

		this.name = "Gamma Rays";
	}

	util.inherits(GammaRays, Spell);

	GammaRays.prototype.canCast = function(medic) {
		return medic.actuators >= 2 && medic.outOfGCD();
	}

	GammaRays.prototype.cast = function(medic) {
		this.startTime = medic.time;
		this.castProgress = 0;
		medic.GCDTime = this.startTime + this.castTime();
	}

	GammaRays.prototype.step = function(medic) {
		var $this = this;

		var stepTime = updateProgressAndGetStepTime();

		if(this.castProgress - stepTime < this.castTime() && this.castTime() <= this.castProgress) {
			var baseDamage = (710 + ((0.3262 + ($this.tier * 0.0212)) * medic.abilityPower) * 3);
			medic.dealDamage($this, baseDamage);
			medic.removeActuator(2);
			checkTiers();

			medic.finishCast(this);
		}

		function updateProgressAndGetStepTime() {
			var oldProgress = $this.castProgress;
			$this.castProgress = medic.time - $this.startTime;
			return $this.castProgress - oldProgress;
		}

		function checkTiers() {
			updateTier4CastCounter();
			updateAndClaimTier8Bonus();
		}

		function updateTier4CastCounter() {
			if($this.tier >= 4)
				$this.tier4CastCounter = ($this.tier4CastCounter + 1) % 3;
		}

		function updateAndClaimTier8Bonus() {
			if($this.tier == 8 && medic.time - $this.tier8CooldownTimer >= 2)
			{
				medic.addActuator(1);
				$this.tier8CooldownTimer = medic.time;
			}
			situation.log("debug", "Gamma Rays Tier 8 at " + medic.time + ".");
		}

	}

	GammaRays.prototype.castTime = function() {
		return 1.25 - (this.tier4CastCounter * 0.5);

	}




	var lib = {};

	lib.Medic = Medic;
	lib.Discharge = Discharge;
	lib.GammaRays = GammaRays;

	module.exports = lib;

})();