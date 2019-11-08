import { PanelBuilder } from './panel-builder';

export class TowerBuilder {
  public buildSection(topHeight: number, bottomHeight: number) {
    let thickness = 0;
    let bw = 3;
    let bd = 3;
    let tw = 2;
    let td = 2;
    let vh = 5;
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

