import  React from "react";

import Compass from "./compass"
import Wind from "./wind"


const server_root = "ws://localhost:3000"

class Instruments extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data: null
        }

        this.ws = new WebSocket(server_root + "/signalk/v1/stream/?subscribe=none")

        this.subscribers = []

    }

    componentDidMount () {
        const preparePath = (name) => {
            return {
                "path": name,
                "period": 100,
                "format": "full",
                "policy": "ideal",
                // "minPeriod": 200
            }
        }

        this.ws.onopen = () => {
            console.log("open")
            this.ws.send(JSON.stringify({
                "context": "vessels.self",
                "subscribe": [
                    preparePath("environment.depth.belowTransducer"),
                    preparePath("environment.wind.*"),
                    preparePath("navigation.speedThroughWater"),
                    preparePath("navigation.courseOverGroundTrue"),
                    preparePath("navigation.position"),
                ]
            }))
        }

        this.ws.onmessage = (event) => {
            // console.log(event)
            const message = JSON.parse(event.data);
            this.setState({data: message});
            // console.log(message);

            for (const subscriber of this.subscribers) {
                try {
                    // console.log(message.updates[0].values[0].path)
                    // console.log(subscriber.paths)
                    
                    message.updates.forEach(update => {
                        update.values.forEach(value => {
                            // if (subscriber.paths.includes(value.path)) {
                                //     subscriber.callback(update)
                                // }
                            // console.log(value.path)
                            subscriber.paths.forEach(subscriberPath => {
                                let re = new RegExp(subscriberPath);
                                if (re.test(value.path)) {
                                    subscriber.callback(update);
                                }
                            })
                        })
                    });

                    
                } catch (err) {
                    console.error(message)
                    // console.error(err)
                }
            }
        }

        
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
        }

        return (        
            <div>
                <div className="table">
                    <Wind width={500} height={500} subscribe={setCallback} />
                    <Compass width={500} height={500} heading={0} subscribe={setCallback} />
                </div>
                <div className="table">
                    {/* <Wind width={500} height={500} subscribe={setCallback}/> */}
                </div>
            </div>
        );
    }
}

export default Instruments