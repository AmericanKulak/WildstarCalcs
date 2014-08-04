var situation = require("./Situation");

(function() {

	var Player = function() {

		this.abilityPower = 0;
		this.GCDTime = 0;
		this.time = 0;
		this.LAS = [];
		this.totalDamage = 0;
		this.activeSpells = [];

	}

	Player.prototype.step = function(time){
		var $this = this;

		stepThroughActiveSpells();
		this.castNextSpell();
		incrementTimeCounter();

		function stepThroughActiveSpells() {
			for (var i = 0; i < $this.activeSpells.length; i++) {
				$this.activeSpells[i].step($this);
			};
		}

		function incrementTimeCounter() {
			$this.time += time;
		}
	}

	Player.prototype.castNextSpell = function() {
		var $this = this;

		var castableSpells = getCastableSpells();
		if(castableSpells.length == 0) return;
		var optimal = optimalSpell(castableSpells);
		if(optimal) this.cast(optimal);	

		function getCastableSpells() {
			return $this.LAS.filter(function(el, index, arr) {
				return el.canCast($this);
			}, this);
		}

	}

	Player.prototype.cast = function(spell) {
		situation.log("cast", "Casting " + spell.name + " at time " + this.time + ".");
		this.activeSpells.push(spell);
		spell.cast(this);
	}

	Player.prototype.finishCast = function(spell) {
		var found = false;
		for (var i = 0; i < this.activeSpells.length; i++) {
			if(this.activeSpells[i].name == spell.name && !found) {
				found = true;
				this.activeSpells.splice(i, 1);
				situation.log("debug", spell.name + " has finished at " + this.time + ".");
			}
		};
	}

	Player.prototype.dealDamage = function(source, damage){
		var roundedDamage = Math.round(damage);

		this.totalDamage += roundedDamage;
		situation.log("damage", source.name + " dealt " + roundedDamage + " damage at " + this.time + ".");
	}

	Player.prototype.printDamage = function() {
		situation.log("result", "Dealt " + this.totalDamage + " in " + this.time + " seconds. (" + this.totalDamage / this.time + " dps)");
	}

	Player.prototype.outOfGCD = function() {
		return this.time >= this.GCDTime;
	}


	//Private Functions

	var optimalSpell = function(castableSpells) {

		var optimal = castableSpells[0];
		return optimal;

	}


	module.exports = Player;
})();