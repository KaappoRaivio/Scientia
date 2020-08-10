export default class WebSocketManager {
	constructor(address, onDelta) {
		this.address = address;
		this.onDelta = onDelta;
	}

	initializeWebsocket(address, onDelta) {
		try {
			this.close();
		} catch (e) {
			console.error(e);
		}

		this.ws = new WebSocket(address);
		const preparePath = (name) => ({
			path: name,
			period: 1000,
			format: "delta",
			policy: "instant",
			minPeriod: 1000,
		});

		this.ws.onopen = () => {
			this.ws.send(
				JSON.stringify({
					context: "vessels.self",
					subscribe: [preparePath("*")],
				})
			);
		};

		this.ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			onDelta(message);
		};

		this.ws.onclose = (event) => {
			console.log("Closing websocket");
			try {
				this.ws.send(
					JSON.stringify({
						context: "vessels.self",
						unsubscribe: ["*"],
					})
				);
			} catch (error) {}
		};
	}

	close() {
		this.ws.close();
	}

	open() {
		this.initializeWebsocket(this.address, this.onDelta);
	}
}
