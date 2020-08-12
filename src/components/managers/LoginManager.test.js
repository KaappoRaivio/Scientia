import "@testing-library/jest-dom";
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import LoginManager from "./LoginManager";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";

import App from "../../App";
import { appName, appVersion } from "../../App";

const USERNAME = "42";
const PASSWORD = "69";

const server = setupServer(
	rest.post("/signalk/v1/auth/login", (req, res, ctx) => {
		const { username, password } = req.body;
		console.log("Login attempt: ", username, password);
		if (username === USERNAME && password === PASSWORD) {
			console.log("200");
			return res(ctx.status(200), ctx.json({ token: "fake_token" }));
		} else {
			return res(ctx.status(401), ctx.json({ error: "unauthorized" }));
		}
	}),

	rest.put("/signalk/v1/auth/logout", (req, res, ctx) => {
		return res(ctx.status(200));
	}),

	rest.get(`/signalk/v1/applicationData/*/${appName}/${appVersion}/layout`, (req, res, ctx) => {
		return res(ctx.status(404));
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("should allow user to login", () => {
	expect.assertions(2);
	expect(LoginManager.login("wrong", "")).resolves.toEqual(401);
	return expect(LoginManager.login(USERNAME, PASSWORD)).resolves.toEqual(200);
});

it("should allow user to logout", () => {
	expect.assertions(1);
	return expect(LoginManager.logout()).resolves.toEqual(200);
});

test("the login form should work", async () => {
	render(<App />);
	expect.assertions(2);

	console.log((await screen.findAllByRole("textbox")).length);
	console.log(screen.getByLabelText(/username/i).type);
	console.log(screen.getByLabelText(/password/i).type);

	fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "wrong" } });
	fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "credentials" } });
	fireEvent.click(screen.getByRole("button"));

	await screen.findByText(/wrong/i);
	expect(screen.getByText(/Wrong username or password/i)).toBeInTheDocument();

	fireEvent.change(screen.getByLabelText(/username/i), { target: { value: USERNAME } });
	fireEvent.change(screen.getByLabelText(/password/i), { target: { value: PASSWORD } });
	fireEvent.click(screen.getByRole("button"));

	await screen.findByText(/configure/i);
	return expect(screen.getByText(/configure/i)).toBeInTheDocument();
});
