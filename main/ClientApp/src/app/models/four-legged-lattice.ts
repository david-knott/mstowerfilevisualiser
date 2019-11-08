import { Path } from "three";

interface BracingPattern {}
class FaceBracingPattern implements BracingPattern {

  private vertices = [
    [0.5, 0.5], //top right
    [0.5, -0.5], //bottom right
    [-0.5, -0.5], //bottom left
    [-0.5, 0.5] //top left
  ];

  private edges = [
    [3, 0], //t
    [1, 2], //b
    [0, 1], //r
    [2, 3], //l
    [3, 1],
    [2, 0]
  ];

  private members = ["LEG", "M1", "M3"];
}

class PanelFace {}

export class TowerBuilder {
  public buildSection(topHeight: number, bottomHeight: number) {
    let thickness = 0;
    let bw = 4;
    let bd = 6;
    let tw = 2;
    let td = 4;
    let vh = 2;
    var fll = new PanelBuilder(bw, tw, vh, bd, td, thickness); //b,t,h
    //construct each panel face
    let vertice0 = fll.getPanelFaceVertices(0);
    let vertice1 = fll.getPanelFaceVertices(1);
    let vertice2 = fll.getPanelFaceVertices(2);
    let vertice3 = fll.getPanelFaceVertices(3);
    //concatenate the vertices into a array
    let vertices = vertice0
      .concat(vertice1)
      .concat(vertice2)
      .concat(vertice3);
    return vertices;
  }

  public buildTower(height: number) {
    let section1 = this.buildSection(10, 0);
    // let section2 = this.buildSection(20, 10);
    // let section3 = this.buildSection(30, 20);
    return section1;
  }
}

export class PanelBuilder {
  private verticalHeight: number;
  private bottomWidth: number;
  private topWidth: number;
  private bottomDepth: number;
  private topDepth: number;
  private thickness: number = 0.0;

  private vertices = [
    [0.5, 0.5], //top right
    [0.5, -0.5], //bottom right
    [-0.5, -0.5], //bottom left
    [-0.5, 0.5] //top left
  ];

  private edges = [
    [3, 0], //t
    [1, 2], //b
    [0, 1], //r
    [2, 3], //l
    [3, 1],
    [2, 0]
  ];

  constructor(
    bottomWidth: number,
    topWidth: number,
    verticalHeight: number,
    bottomDepth?: number,
    topDepth?: number,
    thickness?: number
  ) {
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

  public distanceHelper(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  private getSlope(h: number, bw: number, tw: number): number {
    //take into account the thickness of the members
    var newTw = tw - this.thickness * 2;
    var newBw = bw - this.thickness * 2;
    //infinite slope, just scale up x without factoring in slope
    if (newTw - newBw == 0) {
      return null;
    }
    let m = h / (newTw / 2 - newBw / 2);
    return m;
  }

  private getFaceHeight(h: number, bw: number, tw: number): number {
    var slopeAngle = this.getSlopeAngle(h, bw, tw);
    return slopeAngle ? h / Math.cos(slopeAngle + Math.PI / 2) : h;
  }

  private getSlopeAngle(h: number, bw: number, tw: number): number {
    var s = this.getSlope(h, bw, tw);
    return s != null ? Math.atan(s) : null;
  }

  private scaleBy(
    vertices: Array<Array<number>>,
    h: number,
    bw: number,
    tw: number
  ): Array<Array<number>> {
    //take into account the thickness of the members
    var newTw = tw - this.thickness * 2;
    var newBw = bw - this.thickness * 2;
    //infinite slope, just scale up x without factoring in slope
    if (newTw - newBw == 0) {
      return vertices.map(v => {
        return [v[0] * newBw, v[1] * h, v[2] * newBw, v[3] * h];
      });
    }
    let faceHeight = this.getFaceHeight(h, bw, tw);
    let yscaledVertices = vertices.map(v => {
      //calculate the new scale based on the vertical height and angle
      return [v[0], v[1] * faceHeight, v[2], v[3] * faceHeight];
    });
    let xscaledVertices = yscaledVertices.map(v => {
      function factor(y: number) {
        var ratio = y / faceHeight;
        return newBw - ratio * (newBw - newTw);
      }
      let factor1 = factor(v[1] + faceHeight / 2); //move the thing up by twice its height to calculate scaling factor
      let factor2 = factor(v[3] + faceHeight / 2);
      return [v[0] * factor1, v[1], v[2] * factor2, v[3]];
    });
    
    return xscaledVertices;
  }

  /**
   * Returns the unscaled vertices for a typical face using (x, y)
   */
  public getFaceVertices(): Array<Array<number>> {
    var res = Array<Array<number>>();
    let vertices = this.getVertices();
    for (var i = 0; i < this.edges.length; i++) {
      var esx = vertices[this.edges[i][0]][0];
      var esy = vertices[this.edges[i][0]][1];
      var eex = vertices[this.edges[i][1]][0];
      var eey = vertices[this.edges[i][1]][1];
      res.push([esx, esy, eex, eey]);
    }
    return res;
  }

  private translateAndRotate(
    points: Array<Array<number>>,
    z: number,
    rads: number,
    faceSlope: number
  ): Array<Array<number>> {
    var res = Array<Array<number>>();
    //extend the points to 3 dimensions by adding a z coordinate
    for (let i = 0; i < points.length; i++) {
      res.push([
        points[i][0], //x
        points[i][1], //y
        z,
        points[i][2], //x
        points[i][3], //y
        z
      ]);
    }
    //if structure is not square, we need to rotate the structure
    //around the x axis by the slope atan(faceSlope), the rotation
    //is pivotted at the end of a face, so we translate the coordinates
    //as follows
    //y => y + to half the height
    if (faceSlope !== null) {
      let fs = Math.atan(faceSlope);
      var h1 = this.verticalHeight / Math.cos(fs + Math.PI / 2);
      for (let i = 0; i < res.length; i++) {
        //z needs to be translated back by -z
        //y translated by height of shape -h
        res[i][1] = res[i][1] + h1 / 2; //y
        res[i][2] = res[i][2] - z;
        res[i][4] = res[i][4] + h1 / 2; //y
        res[i][5] = res[i][5] - z;
        //rotate the faces
        let zs = res[i][1];
        let ys = res[i][2];
        let ze = res[i][4];
        let ye = res[i][5];
        res[i][1] = ys * Math.cos(fs) - zs * Math.sin(fs);
        res[i][2] = zs * Math.cos(fs) + ys * Math.sin(fs);
        res[i][4] = ye * Math.cos(fs) - ze * Math.sin(fs);
        res[i][5] = ze * Math.cos(fs) + ye * Math.sin(fs);
        //fixes incorrect slope of face
        res[i][2] *= -1;
        res[i][5] *= -1;

        //translate back to original position
        res[i][1] = res[i][1] - h1 / 2; //y
        res[i][2] = res[i][2] + z;
        res[i][4] = res[i][4] - h1 / 2; //y
        res[i][5] = res[i][5] + z;
      }
    }
    //finally rotate by rads around the y axis,
    //y coordinate will not change, x and z will
    for (let i = 0; i < res.length; i++) {
      let xs = res[i][0];
      let zs = res[i][2];
      let xe = res[i][3];
      let ze = res[i][5];

      res[i][0] = xs * Math.cos(rads) - zs * Math.sin(rads);
      res[i][2] = zs * Math.cos(rads) + xs * Math.sin(rads);
      res[i][3] = xe * Math.cos(rads) - ze * Math.sin(rads);
      res[i][5] = ze * Math.cos(rads) + xe * Math.sin(rads);
    }
    return res;
  }
  /**
   * Returns the vertices for a particular face, scaled correctly.
   */
  public getPanelFaceVertices(faceNumber: number): Array<Array<number>> {
    let fv = this.getFaceVertices();
    let m = this.getSlope(this.verticalHeight, this.bottomWidth, this.topWidth);
    switch (faceNumber) {
      case 0: //face 0, nearest to us
        let fv = this.getFaceVertices();
        //scale by width
        return this.translateAndRotate(
          this.scaleBy(
            fv,
            this.verticalHeight,
            this.bottomWidth,
            this.topWidth
          ),
          this.bottomDepth / 2,
          0,
          m
        );
      case 1: //face 1, left face
        let fv1 = this.getFaceVertices();
        //scale by width
        return this.translateAndRotate(
          this.scaleBy(
            fv1,
            this.verticalHeight,
            this.bottomDepth,
            this.topDepth
          ),
          this.bottomWidth / 2,
          (90 * Math.PI) / 180,
          m
        );
      case 2: //face 2, back face
        let fv2 = this.getFaceVertices();
        //scale by width
        return this.translateAndRotate(
          this.scaleBy(
            fv2,
            this.verticalHeight,
            this.bottomWidth,
            this.topWidth
          ),
          this.bottomDepth / 2,
          Math.PI,
          m
        );
      case 3: //face 3, right face
        let fv3 = this.getFaceVertices();
        //scale by width
        return this.translateAndRotate(
          this.scaleBy(
            fv3,
            this.verticalHeight,
            this.bottomDepth,
            this.topDepth
          ),
          this.bottomWidth / 2,
          (3 * Math.PI) / 2,
          m
        );
        break;
    }
    return null;
  }
}
