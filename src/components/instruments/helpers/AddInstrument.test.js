import "@testing-library/jest-dom";
import React from "react";

import { render, fireEvent, screen } from "@testing-library/react";
import AddInstrument from "./AddInstrument";
import App from "../../../App";

it("should render AddInstrument", () => {
	const onInstrumentAdded = jest.fn(instrument => {
		console.log(instrument);
		return instrument;
	});

	render(<AddInstrument colors={App.getColors(false)} width={100} height={100} onInstrumentAdded={onInstrumentAdded} />);
	let plusButton = screen.getByRole("button");

	return expect(plusButton).toBeInTheDocument();
});

it("should not call onInstrumentAdded when pressing cancel", () => {
	const onInstrumentAdded = jest.fn(instrument => {
		console.log(instrument);
		return instrument;
	});

	render(<AddInstrument colors={App.getColors(false)} width={100} height={100} onInstrumentAdded={onInstrumentAdded} />);
	let plusButton = screen.getByRole("button");
	fireEvent.click(plusButton);

	const cancel = screen.getByText(/cancel/i);
	fireEvent.click(cancel);

	return expect(onInstrumentAdded).not.toHaveBeenCalled();
});

it("should call onInstrumentAdded when pressing ok", () => {
	const onInstrumentAdded = jest.fn(instrument => {
		console.log(instrument);
		return instrument;
	});

	render(<AddInstrument colors={App.getColors(false)} width={100} height={100} onInstrumentAdded={onInstrumentAdded} />);
	let plusButton = screen.getByRole("button");
	fireEvent.click(plusButton);

	let ok = screen.getByText(/ok/i);
	fireEvent.click(ok);

	return expect(onInstrumentAdded).toHaveBeenCalled();
});
