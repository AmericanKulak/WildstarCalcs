var chalk = require("Chalk");

(function() {

	var setup = function() {};

	var player;
	var stepTime = 0.25;
	var duration = 5;

	var situation = {};

	situation.debugMessages = true;
	situation.castMessages = true;
	situation.damageMessages = true;
	situation.resourceMessages = true;

	situation.setup = function(settings) {
		setup = function() {
			stepTime = settings.stepTime;
			player = settings.player;
			duration = settings.duration;
		}
	}

	situation.runSimulation = function() {
		setup();
		for (var i = 0; i < duration / stepTime; i++) {
			player.step(stepTime);
		};
	}

	situation.log = function(messageType, message) {
		switch(messageType) {
			case "debug":
				if(this.debugMessages) console.log(chalk.yellow.bold(message));
				break;	
			case "cast":
				if(this.castMessages) console.log(chalk.blue.bold(message));
				break;
			case "damage":
				if(this.damageMessages) console.log(chalk.red.bold(message));
				break;
			case "resource":
				if(this.resourceMessages) console.log(chalk.red(message));
				break;
			default:
				console.log(chalk.white.bold(message));
				break;
		}
	}

	module.exports = situation;
})();