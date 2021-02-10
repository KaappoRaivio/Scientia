import React from "react";

import "./Instruments.css";
import "./helpers/QuadrantInstrumentContainer.css";

import SingleInstrumentContainer from "./helpers/SingleInstrumentContainer";
import AddInstrument from "./helpers/AddInstrument";

const Instruments = ({
	colors,
	instruments,
	onInstrumentAdded,
	onInstrumentRemoved,
	onInstrumentChanged,
	layoutEditingEnabled,
	signalkState,
	settings: { animation, darkMode },
}) => {
	const additionalProps = { animation, darkMode, data: signalkState };
	return (
		<div className="instrument-grid-container">
			{instruments.map((instrument, index) => {
				if (instrument.type === "single") {
					const component = instrument.instruments[0];

					return (
						<SingleInstrumentContainer
							children={component.component}
							additionalProps={{ ...component.additionalProps, ...additionalProps }}
							colors={colors}
							onRemoveClick={onInstrumentRemoved}
							index={index}
							layoutEditingEnabled={layoutEditingEnabled}
						/>
					);
				} else {
					return <div>Unknown instrument type {instrument.type}</div>;
				}
			})}

			{layoutEditingEnabled && (
				<SingleInstrumentContainer
					children={AddInstrument}
					data={signalkState}
					additionalProps={{ ...additionalProps, onInstrumentAdded }}
					colors={colors}
					layoutEditingEnabled={false}
				/>
			)}
		</div>
	);
};

export default Instruments;
