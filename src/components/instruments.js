import  React from "react";

import Compass from "./compass"
import Wind from "./wind"
import Tridata from "./tridata";

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
            this.setState({data: message});

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


    render () {
        const setCallback = (paths, callback) => {
            this.subscribers.push({paths: paths, callback: callback})
        };

        const instruments = [Wind,
            Compass,
            Tridata];

        return (        
            <div className="row">
                {
                    instruments.map(instrument => {

                        return <InstrumentContainer children={instrument} callback={setCallback} />

                    })
                }

                {/*<Wind className="" width={400} height={400} subscribe={setCallback} />*/}
                {/*<Tridata className="" width={400} height={400} subscribe={setCallback} />*/}
                {/*<Compass className="" width={400} height={400} subscribe={setCallback} />*/}
                {/*<div className="col-3 col-t-4 col-s-6" />*/}
                {/*<div className="col-3 col-t-4 col-s-6" />*/}
                {/*<div className="col-3 col-t-4 col-s-6" />*/}
                {/*<div className="col-3 col-t-4 col-s-6" />*/}
                {/*<div className="col-3 col-t-4 col-s-6" />*/}
                {/*<div className="col-3 col-t-4 col-s-6" />*/}

            </div>
        );
    }
}

export default Instruments

                // <InstrumentContainer /*className="col-3 col-t-4 col-s-6"*/  />
                // <InstrumentContainer /*className="col-3 col-t-4 col-s-6"*/  />
                // <InstrumentContainer /*className="col-3 col-t-4 col-s-6"*/  />
                // <InstrumentContainer /*className="col-3 col-t-4 col-s-6"*/  />
                // <InstrumentContainer /*className="col-3 col-t-4 col-s-6"*/  />
                // <InstrumentContainer /*className="col-3 col-t-4 col-s-6"*/  />