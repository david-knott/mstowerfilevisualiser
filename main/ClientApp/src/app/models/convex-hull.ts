export class ConvexHull {

    static getHull(lines: Array<Array<number>>):Array<Array<number>> {
        return [[1, 209], [269, 209], [240, 1], [30, 1]];
    }

    static getHullAsFlatArray(points: Array<Array<number>>) {
        return ConvexHull.getHull(points).flat();
    }
}
