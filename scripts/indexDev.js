module.exports = function (app) {
	let plugin = {};

	plugin.id = "signalk-scientia-kraivio-dev";
	plugin.name = "signalk-scientia-kraivio-dev";
	plugin.description = "Scientia for SignalK developed and maintained by Kaappo Raivio (development version)";

	plugin.start = function (options, restartPlugin) {
		app.debug("Plugin started");
	};

	plugin.stop = function () {
		app.debug("Plugin stopped");
	};

	plugin.schema = {};

	return plugin;
};
