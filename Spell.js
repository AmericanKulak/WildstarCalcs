(function() {

	var Spell = function(tier) {

		this.name = "";
		this.tier = tier;
		this.startTime = 0;
		this.castProgress = 0;

	}

	Spell.prototype.cast = function(player) { console.log("Base Cast called.")};
	Spell.prototype.canCast = function(player) { return player.outOfGCD(); };
	Spell.prototype.step = function(player) {};

	
	module.exports = Spell;

})();