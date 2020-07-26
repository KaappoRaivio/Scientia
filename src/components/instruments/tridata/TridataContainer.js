import React from 'react';

import "./tridata.css"
import Tridata from "./Tridata";
import {getByStringPath} from "delta-processor";
import {componentTypes} from "@data-driven-forms/react-form-renderer";
import validatorTypes from "@data-driven-forms/react-form-renderer/dist/cjs/validator-types";

class TridataContainer extends React.Component {
    static schema = [
        {
            component: componentTypes.FIELD_ARRAY,
            name: "paths",
            label: "Tridata",
            fieldKey: "paths",
            fields: [
                {
                    component: componentTypes.TEXT_FIELD,
                    name: "paths.0",
                    placeholder: "Path"
                }
            ],
            validate: [
                {
                    type: validatorTypes.MIN_LENGTH,
                    threshold: 1
                }
            ]
        }
    ];

    render () {
        const values = this.props.paths.map(path => getByStringPath(path, this.props.data.vessels.self) || {meta: {displayScale: {}}});

        return <Tridata
                width={this.props.width}
                height={this.props.height}
                values={values}
                colors={this.props.colors}
                darkMode={this.props.darkMode}
            />
    }
}

export default TridataContainer;