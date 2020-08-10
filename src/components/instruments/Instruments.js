import React from "react";

import "./Instruments.css";
import "./helpers/QuadrantInstrumentContainer.css";

import SingleInstrumentContainer from "./helpers/SingleInstrumentContainer";
import QuadrantInstrumentContainer from "./helpers/QuadrantInstrumentContainer";
import AddInstrument from "./helpers/AddInstrument";
import WindContainer from "./wind/WindContainer";
import CompassContainer from "./compass/CompassContainer";
import TridataContainer from "./tridata/TridataContainer";
import GaugeContainer from "./gauge/GaugeContainer";
import VisualiserContainer from "./visualiser/VisualiserContainer";

class Instruments extends React.Component {
	render() {
		const { animation, darkMode } = this.props.settings;
		const { colors, instruments, onInstrumentAdded, onInstrumentRemoved, onInstrumentChanged, layoutEditingEnabled, signalkState } = this.props;

		return (
			<div className="flexbox-container">
				{instruments.map((instrument, index) => {
					if (instrument.type === "single") {
						const component = instrument.instruments[0];

						return (
							<SingleInstrumentContainer
								animate={animation}
								darkMode={darkMode}
								colors={colors}
								children={stringToClass(component.component)}
								data={signalkState}
								additionalProps={component.additionalProps}
								resizeDebounce={0}
								forceResize={true}
								onRemoveClick={onInstrumentRemoved}
								index={index}
								layoutEditingEnabled={layoutEditingEnabled}
							/>
						);
					} else if (instrument.type === "quadrant") {
						return (
							<QuadrantInstrumentContainer
								layoutEditingEnabled={layoutEditingEnabled}
								onInstrumentChanged={onInstrumentChanged}
								index={index}
								colors={colors}
								animation={animation}
								data={instrument.instruments}>
								{[
									...instrument.instruments.map((quadrant, innerIndex) => {
										// console.log(quadrant, stringToClass(quadrant.component))
										return (
											<SingleInstrumentContainer
												animate={animation}
												darkMode={darkMode}
												colors={colors}
												children={stringToClass(quadrant.component)}
												data={signalkState}
												additionalProps={quadrant.additionalProps}
												resizeDebounce={0}
												forceResize={true}
												onRemoveClick={_ => {
													let newInstruments = instrument.instruments
														.slice(0, innerIndex)
														.concat(instrument.instruments.slice(innerIndex + 1));

													onInstrumentChanged(index, {
														type: "quadrant",
														instruments: newInstruments,
													});
												}}
												index={innerIndex}
												layoutEditingEnabled={layoutEditingEnabled}
											/>
										);
									}),
								]}
							</QuadrantInstrumentContainer>
						);
					} else {
						return <div>Unknown instrument type {instrument.type}</div>;
					}
				})}

				{layoutEditingEnabled && (
					<SingleInstrumentContainer
						children={AddInstrument}
						data={signalkState}
						additionalProps={{ onInstrumentAdded }}
						animate={animation}
						darkMode={darkMode}
						colors={colors}
						forceResize={true}
						layoutEditingEnabled={false}
					/>
				)}
			</div>
		);
	}
}

export const stringToClass = string =>
	({
		CompassContainer: CompassContainer,
		WindContainer: WindContainer,
		TridataContainer: TridataContainer,
		GaugeContainer: GaugeContainer,
		VisualiserContainer: VisualiserContainer,
		AddInstrument: AddInstrument,
	}[string]);

export default Instruments;
