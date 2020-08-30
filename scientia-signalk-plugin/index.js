module.exports = function (app) {
	let plugin = {};

	plugin.id = "Scientia";
	plugin.name = "Scientia";
	plugin.description = "Scientia for SignalK developed and maintained by Kaappo Raivio";

	plugin.start = function (options, restartPlugin) {
		app.debug("Plugin started");
	};

	plugin.stop = function () {
		app.debug("Plugin stopped");
	};

	plugin.schema = {};

	return plugin;
};
