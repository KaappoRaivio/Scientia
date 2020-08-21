export default class WebSocketManager {
	static STATUS_UNKNOWN = 0;
	static STATUS_DISCONNECTED = 1;
	static STATUS_CONNECTING = 2;
	static STATUS_CONNECTED = 3;
	static STATUS_ERROR = 4;

<<<<<<< HEAD
	constructor(address, onDelta, onStatusChangeCallback, endpoint) {
		this.address = address;
		this.onDelta = onDelta;
		this.onStatusChangeCallback = onStatusChangeCallback;
		this.endpoint = endpoint;
	}

	changeAddress(newAddress) {
		console.log(newAddress);
		if (newAddress !== this.address) {
			this.close();
			this.address = newAddress;
			this.open();
		}
=======
	constructor(address, onDelta, onStatusChangeCallback) {
		this.address = address;
		this.onDelta = onDelta;
		this.onStatusChangeCallback = onStatusChangeCallback;
>>>>>>> 0ed8e9d526855e083240a53953a854aaf2f0219d
	}

	initializeWebsocket(address, onDelta) {
		try {
			this.close();
		} catch (e) {
			console.error(e);
		}

		this.onStatusChangeCallback(WebSocketManager.STATUS_CONNECTING);

<<<<<<< HEAD
		this.ws = new WebSocket(address + this.endpoint);
=======
		this.ws = new WebSocket(address);
>>>>>>> 0ed8e9d526855e083240a53953a854aaf2f0219d
		const preparePath = name => ({
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

		this.ws.onmessage = event => {
			this.onStatusChangeCallback(WebSocketManager.STATUS_CONNECTED);
			const message = JSON.parse(event.data);
			onDelta(message);
		};

		this.ws.onclose = event => {
			this.onStatusChangeCallback(WebSocketManager.STATUS_DISCONNECTED);
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
		this.ws.onerror = event => {
			this.onStatusChangeCallback(WebSocketManager.STATUS_ERROR);
		};
	}

	close() {
		this.ws.close();
	}

	open() {
		this.initializeWebsocket(this.address, this.onDelta);
	}
}
