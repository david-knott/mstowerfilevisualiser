export class FourLeggedLattice {

    private verticalHeight: number;
    private bottomWidth: number;
    private topWidth: number;
    private bottomDepth: number;
    private topDepth: number;
    private thickness: number = 0.00;

    private vertices = [
        [0.5, 0.5], //top right
        [0.5, -0.5], //bottom right
        [-0.5, -0.5], //bottom left
        [-0.5, 0.5], //top left
    ];

    private edges = [
        [3, 0], //t
        [1, 2], //b
	    [0, 1],  //r
	    [2, 3], //l
    //    [3, 1],
    //    [2, 0]
    ];

    constructor(
        bottomWidth: number,
        topWidth: number,
        verticalHeight: number,
        bottomDepth?: number,
        topDepth?: number,
        thickness? : number) {
            this.verticalHeight = verticalHeight;
            this.bottomWidth = bottomWidth;
            this.topWidth = topWidth;
            this.bottomDepth = bottomDepth ? bottomDepth : bottomWidth;
            this.topDepth = topDepth ? topDepth : topWidth;
            this.thickness = thickness ? thickness : 0;
    }

    private getVertices(): Array<Array<number>> {
        return this.vertices;
    }

    private getYRot(rads: number) : Array<Array<number>> {
        return [
            [Math.cos(rads), 0, Math.sin(rads)],
            [0, 1, 0],
            [-Math.sin(rads), 0, Math.cos(rads)]
        ];
    }

    private applyMatrix(matrix:  Array<Array<number>>, vertices: Array<Array<number>>): Array<Array<number>> {
        return vertices;
    }

    public distanceHelper(x1: number, y1: number, x2: number, y2: number) : number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /*
    private getSlope(bw: number, tw: number, h: number): number {
        if(tw - bw == 0) {
            throw new Error("Slope is infinite.");
        }
        let m =  1 / ( 0.5 * tw - 0.5 * bw);
        return m;
    }

    private angle(tw: number, bw: number, h: number){
        let m = this.getSlope(bw, tw, h);
        return (90 * Math.PI / 180) + Math.atan(m);
    }
    */

    private scaleBy(vertices: Array<Array<number>>, h: number, bw: number, tw: number): Array<Array<number>> {
        //take into account the thickness of the members
        var newTw = tw - this.thickness * 2;
        var newBw = bw - this.thickness * 2;
        //infinite slope, just scale up x without factoring in slope
        if(newTw - newBw == 0) {
            return vertices.map((v) => {
                return [v[0] * newBw, v[1]  * h, v[2] * newBw, v[3]  * h];
            });
        }
        //slope is calculated using the new bottom offset
        let m =  1 / ( 0.5 * newTw - 0.5 * newBw);
        let c = -0.5 - m * newBw / 2;
        let xscaledVertices = vertices.map((v) => {
            var factor1 = 2 * (v[1] - c) / m;
            var factor2 = 2 * (v[3] - c) / m;
            return [v[0] * factor1, v[1], v[2] * factor2, v[3]];
        });
        let yscaledVertices = xscaledVertices.map((v) => {
            return [v[0], v[1] * h, v[2], v[3] * h];
        });
        return yscaledVertices;
    }

    /**
    * Returns the unscaled vertices for a typical face using (x, y)
    * we remove the thickness as the 3d library positions objects
    * through their centroid. If we do not subtract the thickness
    * from the lengths the members will slightly overlap.
    */
    public getFaceVertices(): Array<Array<number>> {
        var res = Array<Array<number>>();
        let vertices = this.getVertices();
        for(var i = 0; i < this.edges.length; i++){
            var esx = vertices[this.edges[i][0]][0];
            var esy = vertices[this.edges[i][0]][1];
            var eex = vertices[this.edges[i][1]][0];
            var eey = vertices[this.edges[i][1]][1];
            res.push([esx, esy, eex, eey]);
        }
        return res;
    }

    private extendAndRotate(points: Array<Array<number>>, z: number, rads: number):  Array<Array<number>>{
        return points;
        /*
        var res = Array<Array<number>>();
        for(var i = 0; i < points.length; i++){
            res.push([


            ])
        }
        return res;*/
    }
    /**
    * Returns the vertices for a particular face, scaled correctly.
    */
    public getPanelFaceVertices(faceNumber: number): Array<Array<number>>{
        var res = Array<Array<number>>();
        switch(faceNumber){
            case 0: //face 0, nearest to us
                let fv = this.getFaceVertices();
                //scale by width
                return this.extendAndRotate(this.scaleBy(fv, this.verticalHeight, this.bottomWidth, this.topWidth), this.bottomDepth / 2, 0);
                case 1: //face 1, left face
                    let fv1 = this.getFaceVertices();
                    //scale by width
                    return this.extendAndRotate(this.scaleBy(fv1, this.verticalHeight, this.bottomDepth, this.topDepth), this.bottomWidth / 2, Math.PI / 2);
                case 2: //face 2, back face
                    let fv2 = this.getFaceVertices();
                    //scale by width
                    return this.extendAndRotate(this.scaleBy(fv2, this.verticalHeight, this.bottomWidth, this.topWidth), this.bottomDepth / 2, Math.PI);

                case 3: //face 3, right face
                    let fv3 = this.getFaceVertices();
                    //scale by width
                    return this.extendAndRotate(this.scaleBy(fv3, this.verticalHeight, this.bottomDepth, this.topDepth), this.bottomWidth / 2, 2 * Math.PI);

            break;
        }

        return null;
    }
}
