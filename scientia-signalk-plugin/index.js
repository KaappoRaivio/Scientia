module.exports = function (app) {
	let plugin = {};

	plugin.id = "Scientia";
	plugin.name = "Scientia";
	plugin.description =
		"Scientia for Signal K developed and maintained by Kaappo Raivio";

	plugin.start = function (options, restartPlugin) {
		// Here we put our plugin logic
		console.log("asdasdasdasdasdasd");
		app.debug("Plugin started");
	};

	plugin.stop = function () {
		// Here we put logic we need when the plugin stops
		app.debug("Plugin stopped");
	};

	plugin.schema = {
		// The plugin schema
	};

	return plugin;
};
