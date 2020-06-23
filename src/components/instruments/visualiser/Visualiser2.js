import React, {Component} from 'react';

// import RTChart from "react-rt-chart";
// import d3 from "d3";

// import "/home/kaappo/git/Scientia/node_modules/c3/c3.css"
import C3Chart from "react-c3js";
import "c3/c3.css"


class Visualiser2 extends Component {
    componentDidMount() {
        setInterval(() => this.forceUpdate(), 1000);
    }

    render() {
        // let data = {
        //     date: new Date(),
        //     Car: Math.random() * 2 + 3,
        //     Bus: Math.random() * 2 + 3
        // };
        //
        // let chart = {
        //     axis: {
        //         y: {
        //             type: "linear",
        //             // max: 2000,
        //             inverted: true,
        //             // label: "asd"
        //             tick: {
        //                 format: d => `${d} asd`,
        //             },
        //             outer: false,
        //
        //             // values: [100, 1000, 10000]
        //         },
        //         x: {
        //             show: false
        //         }
        //     },
        //
        //     legend: {
        //         show: false,
        //         position: "inset"
        //     }
        // }
        const grid = {
            y: {
                show: true
            },
            x: {
                show: false,
                lines: []
            }
        }
        console.log(this.props)
        const data = {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25]
            ]
        };
        // return <divq></div>

        // return <RTChart style={{width: this.props.width, height: this.props.height, maxHeight: this.props.height}}
        //     fields={['Car','Bus']}
        //     data={data}
        //     chart={chart}
        //     maxValues={4}
        // />

        return <C3Chart style={{height: this.props.height, width: this.props.width}} grid={grid} data={data} />
    }
}

export default Visualiser2;