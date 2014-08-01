(function() {

	var Spell = function() {

		this.name = "";
		this.tier = 0;
		this.cooldown = 1.25;
		this.isUnique = true;
		this.cast = function(player) {};
		this.canCast = function(player) {};

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
		this.step = function(){
			for (var i = 0; i < activeSpells.length; i++) {
				activeSpells[i].step(this);
			};
		}

		this.cast = function(spell) {
			console.log("Casting " + spell.name + ".");
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
	}

	var library = {};

	library.Spell = Spell;
	library.Player = Player;

	module.exports = library;

})();