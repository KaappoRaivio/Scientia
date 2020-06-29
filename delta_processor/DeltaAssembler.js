import deltaPipeline from "./DeltaPipeline.js"

class DeltaAssembler {
    constructor () {
        this.fullState = {
            vessels: {
                self: {

                }
            }
        }
    }

    onDelta (delta) {
        this._mergeToFullState(delta);
    }

    _mergeToFullState (delta) {
        delta.updates.forEach(update => update.values.forEach(value => {
            // this._addMissingKeys(value.path);
            let processedValue = this._processDeltaValue(value)
            this._createBranchAndLeaf(processedValue.path, processedValue.value);
            // this.fullState.vessels.self[]
            // value.path.split(".").reduce((object, index) => object[index], this.fullState.vessels.self);
        }))
    }

    _createBranchAndLeaf (branch, leaf) {
        const pathArray = branch.split(".");
        pathArray.reduce((object, index) => {
            if (pathArray.indexOf(index) < pathArray.length - 1) {
                if (object[index] === undefined) {
                    object[index] = {};
                }
                return object[index];
            } else {
                object[index] = leaf;
                return object[index];
            }
        }, this.fullState.vessels.self);
    }

    _processDeltaValue (delta) {
        // return deltaPipeline.process(delta);
    }

    toString () {
        return JSON.stringify(this.fullState, null, 4)
    }
}

let assembler = new DeltaAssembler();
assembler._createBranchAndLeaf("environment.depth.belowTransducer", 12)
assembler._createBranchAndLeaf("environment.wind.speedTrue", 24)
assembler._createBranchAndLeaf("navigation.speedThroughWater", 3)
// console.log(JSON.stringify(assembler.fullState, null, " "))
console.log(assembler.toString())