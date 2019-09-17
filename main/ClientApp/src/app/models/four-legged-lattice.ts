export class FourLeggedLattice {

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


    vertices = [
        [0.5, 0.5], //top right
        [0.5, -0.5], //bottom right
        [-0.5, -0.5], //bottom left
        [-0.5, 0.5], //top left
    ];

    //counter clockwise
    edges = [
        [3, 0], //t
        [1, 2], //b
	    [0, 1],  //r
	    [2, 3], //l
    //    [3, 1],
    //    [2, 0]
    ];

    thickness = 0.03;

    constructor(
        private verticalHeight: number,
        private bottomWidth: number,
        private topWidth: number,
        private bottomDepth: number,
        private topDepth: number) {}

    private scaleBy(vertices: Array<Array<number>>, h: number, bw: number, tw: number): Array<Array<number>> {
        let  yscaledVertices = vertices.map((m) => {
            return [m[0], m[1] * h, m[2], m[3] * h]
        });
        if(tw - bw == 0) {
            return yscaledVertices.map((v) => {
                return [v[0] * bw, v[1], v[2] * bw, v[3]];
            });
        }
        let m = h / (tw/2 - bw/2) ;
        let xscaledVertices = yscaledVertices.map((v) => {
            return [v[0] * (v[1] - bw), v[1], v[2] * (v[1] - bw), v[3]]
        });
        return xscaledVertices
    }

    private angle(tw: number, bw: number, h: number){
        let m = h / (tw/2 - bw/2);
        return (90 * Math.PI / 180) + Math.atan(m);
    }

    /**
    * Returns the unscaled vertices for a typical face using (x, y)
    */
    public getFaceVertices(): Array<Array<number>> {
        var res = Array<Array<number>>();
        for(var i = 0; i < this.edges.length; i++){
            var esx = this.vertices[this.edges[i][0]][0] - this.thickness / 2;
            var esy = this.vertices[this.edges[i][0]][1] - this.thickness / 2;
            var eex = this.vertices[this.edges[i][1]][0] - this.thickness / 2;
            var eey = this.vertices[this.edges[i][1]][1] - this.thickness / 2;
            res.push([esx, esy, eex, eey]);
        }
        return res;
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
                return this.scaleBy(fv, this.verticalHeight, this.bottomWidth, this.topWidth);

            break;
        }

        return null;
    }
}
