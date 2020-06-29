import Pipeline from "pipeline-js";
import createMedianFilter from "moving-median"


const medianFilter = createMedianFilter(3);

const deltaPrinter = delta => {
    console.log("Delta in pipeline: ", delta);
    return delta;
}

export default
    new Pipeline()
        .pipe(medianFilter)
        .pipe(deltaPrinter);