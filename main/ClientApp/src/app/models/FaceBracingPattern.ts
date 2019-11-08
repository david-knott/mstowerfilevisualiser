import { BracingPattern } from "./BracingPattern";
class FaceBracingPattern2D implements BracingPattern {
  private vertices: Array<Vertice2D> = [
      new Vertice2D(0.5, 0.5),
      new Vertice2D(0.5, -0.5),
      new Vertice2D(-0.5, -0.5),
      new Vertice2D(-0.5, 0.5),
  ];
  private members: Array<Member> = [
    new Member("LEG", new Edge(3, 0), "#ffffff"),
    new Member("H1", new Edge(1, 2), "#ffffff"),
    new Member("H1", new Edge(0, 1), "#ffffff"),
    new Member("B1", new Edge(2, 3), "#ffffff"),
    new Member("R1", new Edge(3, 1), "#ffffff"),
    new Member("B1", new Edge(2, 0), "#ffffff")
  ];
}

/**
 * Plan bracing pattern
 */
class PlanBracingPattern2D implements BracingPattern{

}

/**
 * Hip bracing pattern
 */
class HipBracingPattern2D implements BracingPattern{

}


class Member {
  constructor(referenceCode: String, edge: Edge, colorCode: String) {}
}

class Edge {
  constructor(start: number, end: number) {}
}

class Vertice2D{
  constructor(x: number, y: number) {}
}

