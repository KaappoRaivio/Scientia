import { mod } from "mathjs";


class DrawHelper {
    constructor (canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        // this.radius = radius;
        // this.arcCenterOffsetY = arcCenterOffsetY;
    }
    
    drawAngleText (origin, angle, radius, text, rotateText) {
        if (rotateText === undefined) {
            rotateText = true;
        }
        
        this.ctx.save();

        if (!rotateText) {
            // radius -= angle / Math.PI * 50
            radius -= 10;  // TODO change magic number - 20200505
        }

        let pos = this.getPosFromAngle(origin, angle, radius)
        let x = pos[0];
        let y = pos[1];

        this.ctx.translate(x, y);
        if (rotateText) {
            this.ctx.rotate(angle);
        }
    
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, 0, 0)// * Math.sin((angle - Math.PI) / 2));
        // this.ctx.fillText(angle.toFixed(2), 0, 10);
    
        this.ctx.restore();
    
    }
    
    getPosFromAngle(origin, angle, radius) {
        let x = origin[0]
        let y = origin[1]
        return [x + Math.sin(Math.PI - angle) * radius, y + Math.cos(Math.PI - angle) * radius]
    }

    drawDivision(origin, radius, division, length, angleProvider, numberTextProvider, rotateNumbers) {
        // console.log(origin, radius, division, length ,angleProvider, numberTextProvider)
        for (let i = 0; i < division; i++) {
            // let angleOffset = this.props.heading * Math.PI / 180;
            // let angleOffset = 0;
            let angle = angleProvider(i)
            // console.log(angle)

            this.drawCompassLine(origin, angle, radius, length)
            

            let angleText = numberTextProvider(i)
            this.drawAngleText(origin, angle, radius - length * 1.5, angleText, rotateNumbers)
        
        }
    }

    drawCompassLine(origin, angle, radius, length) {
        let end = this.getPosFromAngle(origin, angle, radius)
        let start = this.getPosFromAngle(origin, angle, radius - length)
        if (radius === 0) {
            // start = [250, 250]
            // end = [207, 277]
            // console.log(start[0])
            // console.log(end[1])
        }
        this.ctx.moveTo(start[0], start[1]);
        this.ctx.lineTo(end[0], end[1]);
        // this.ctx.moveTo(250, 250);
        // this.ctx.lineTo(207, 277);
    }
}


export default DrawHelper