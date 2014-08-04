(function() {


	var Target = function() {

		var totalDamage = 0;

	}

	Target.prototype.takeDamage = function(damage) {
		this.totalDamage += damage;
	}

	Target.prototype.report = function() {
		console.log("Target took " + this.totalDamage + " damage.");
	}


	module.exports = Target;

})();