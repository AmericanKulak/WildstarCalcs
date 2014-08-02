(function() {

	var Spell = function() {

		this.name = "";
		this.tier = 0;
		this.cooldown = 1.25;
		this.isUnique = true;
		this.cast = function(player) {};
		this.canCast = function(player) { return true };
		this.step = function(player) {};
		this.plannedDamage = function(player) {};

	}

	var Player = function() {

		this.abilityPower = 0;
		this.castChain = [];
		this.time = 0;
		this.LAS = [];
		this.GCDtime = 0;

		var totalDamage = 0;

		var damageListeners = [];
		this.damageDealt = function(src, damage){
			totalDamage += damage;
			console.log(src + " dealt " + damage + " damage.");
			for (var i = 0; i < damageListeners.length; i++) {
				damageListeners[i]();
			};
		}

		this.damageModifiers = [];
		this.modifyDamage = function(damage) {
			var extraDamage = 0;
			for (var i = 0; i < this.damageModifiers.length; i++) {
				extraDamage += this.damageModifiers[i](damage);
			};
			return damage + extraDamage;
		}
		


		var activeSpells = [];
		this.step = function(time){
			for (var i = 0; i < activeSpells.length; i++) {
				activeSpells[i].step(this);
			};
			if(this.time >= this.GCDtime) {
				this.castNext();
			}
			this.time += time;
		}

		this.cast = function(spell) {
			console.log("Casting " + spell.name + " at time " + this.time + ".");
			activeSpells.push(spell);
			spell.cast(this);
		}

		this.finishCast = function(spell) {
			var found = false;
			for (var i = 0; i < activeSpells.length; i++) {
				if(activeSpells[i].name == spell.name && !found) {
					found = true;
					activeSpells.splice(i, 1);
					console.log(spell.name + " has finished.");
				}
			};
		}

		this.castNext = function() {
			console.dir(this.LAS);

			var castableSpells = this.LAS.filter(function(el, index, arr) {
				return el.canCast(this);
			}, this);

			var optimal = optimalSpell(castableSpells);

			if(optimal) this.cast(optimal);	

			
		}

		var optimalSpell = function(castableSpells) {

			var optimal = castableSpells[0];
			for (var i = 1; i < castableSpells.length; i++) {
				if(castableSpells[i].totalDamage > optimal.totalDamage) {
					optimal = castableSpells[i];
				}
			};
			return optimal;

		}

		this.printDamage = function() {
			console.log("Dealt " + totalDamage + " in " + this.time + " seconds. (" + totalDamage / this.time + " dps)");
		}
	}

	var library = {};

	library.Spell = Spell;
	library.Player = Player;

	module.exports = library;

})();