import  React from "react";

import Compass from "./compass"
import Wind from "./wind"
import Tridata from "./tridata";
import Visualiser from "./visualiser"

import "./instruments.css"
import InstrumentContainer from "./instrumentcontainer";

const server_root = "ws://192.168.1.115:3000";

class Instruments extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data: null
        };

        this.ws = new WebSocket(server_root + "/signalk/v1/stream/?subscribe=none");

        this.subscribers = []

    }

    componentDidMount () {
        const preparePath = (name) => {
            return {
                "path": name,
                "period": 1000,
                "format": "full",
                "policy": "fixed",
                // "minPeriod": 200
            }
        };

        this.ws.onopen = () => {
            console.log("open");
            this.ws.send(JSON.stringify({
                context: "vessels.self",
                subscribe: [
                    preparePath("environment.depth.belowTransducer"),
                    preparePath("environment.wind.*"),
                    preparePath("navigation.speedThroughWater"),
                    preparePath("navigation.courseOverGroundTrue"),
                    preparePath("navigation.position"),
                    preparePath("navigation.speedOverGround"),
                    preparePath("performance.velocityMadeGood"),
                ]
            }))
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            for (const subscriber of this.subscribers) {
                try {

                    message.updates.forEach(update => {
                        update.values.forEach(value => {
                            subscriber.paths.forEach(subscriberPath => {
                                let re = new RegExp(subscriberPath);
                                if (re.test(value.path)) {
                                    subscriber.callback(update);
                                }
                            })
                        })
                    });
                    
                } catch (err) {
                    console.error(err)
                }
            }
        };

        
        console.log(this.refs);

        this.ws.onclose = () => {
            // this.ws.send(JSON.stringify({
            //     "context": "*",
            //     "unsubscribe": [{
            //         "path": "*"
            //     }]
            // }))
        }
        
        // setInterval(() => {
        //     this.ws.send(JSON.stringify({
        //         "context": "*",
        //         "unsubscribe": [{
        //             "path": "*"
        //         }]
        //     }));
        //     this.ws.close()
        // }, 10000)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // console.log(nextProps, nextState)
        return true
    }


    render () {
        const setCallback = (paths, callback) => {
            this.subscribers.push({paths: paths, callback: callback})
        };

        const instruments = [
            [Wind, {}],
            [Compass, {}],
            [Tridata, {}],
            [Visualiser, {path: "environment.depth.belowTransducer", ranges: [5, 10, 20, 40, 100], numberOfPointsToShow: 100, negate: true, upperBound: 100, lowerBound: 0}],
            // [Visualiser, {path: "environment.wind.speedTrue", ranges: [10, 20, 40], numberOfPointsToShow: 100, upperBound: 100, lowerBound: 0}]
        ];

        // console.log("rerendering!")

        return (        
            <div className="row">
                {
                    instruments.map(instrument =>
                        <InstrumentContainer  children={instrument[0]} callback={setCallback} additionalProps={instrument[1]} />
                    )
                }

            </div>
        );
    }
}

export default Instruments
