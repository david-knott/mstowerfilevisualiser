import { FourLeggedLattice } from './four-legged-lattice';

describe('FourLeggedLattice', () => {
    it('should create an instance', () => {
      expect(new FourLeggedLattice(4, 2, 4, 2, 2)).toBeTruthy();
    });

    it('should calculate unscaled face t,b,l,r vertices distances correctly', () => {
        var fll = new FourLeggedLattice(1, 1, 1, 1, 1);
        expect(fll).toBeTruthy();
        var result = fll.getFaceVertices();
        //there should be 4 vertices
        expect(result.length).toEqual(4);
        //the bottom edge should be length 1
        let top = result[0];
        expect(fll.distanceHelper(top[0], top[1], top[2], top[3])).toEqual(1);
        //the top edge should be length 1
        let bottom = result[1];
        expect(fll.distanceHelper(bottom[0], bottom[1], bottom[2], bottom[3])).toEqual(1);
        //the right edge should be length 1
        let right = result[2];
        expect(fll.distanceHelper(right[0], right[1], right[2], right[3])).toEqual(1);
        //the left edge should be length 1
        let left = result[3];
        expect(fll.distanceHelper(left[0], left[1], left[2], left[3])).toEqual(1);
    });

    it('should calculate integer scaled face top edge length', () => {
            var fll = new FourLeggedLattice(3, 3, 3, 3, 3);
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            //top is top edge
            let top = face0[0];
            expect(fll.distanceHelper(top[0], top[1], top[2], top[3])).toEqual(3);
    });

    it('should calculate float scaled face top edge length', () => {
            var fll = new FourLeggedLattice(1.5, 1.5, 1.5, 1.5, 1.5);
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            //top is top edge
            let top = face0[0];
            expect(fll.distanceHelper(top[0], top[1], top[2], top[3])).toEqual(1.5);
    });

    it('should calculate 2,1,1 xscaled face top edge length', () => {
            var fll = new FourLeggedLattice(2, 1, 1);
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            //top is top edge
            let top = face0[0];
            expect(fll.distanceHelper(top[0], top[1], top[2], top[3])).toEqual(1);
    });

    it('should calculate 4,2,1 xscaled face top edge and bottom edge length', () => {
            var fll = new FourLeggedLattice(4, 2, 1); //b,t,h
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            let bottomEdge = face0[1];
            expect(fll.distanceHelper(bottomEdge[0], bottomEdge[1], bottomEdge[2], bottomEdge[3])).toEqual(4);
            let topEdge = face0[0];
            expect(fll.distanceHelper(topEdge[0], topEdge[1], topEdge[2], topEdge[3])).toEqual(2);
    });


    it('should calculate 4,2,2 xscaled face top edge and bottom edge length', () => {
            var fll = new FourLeggedLattice(4, 2, 2); //b,t,h
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            let bottomEdge = face0[1];
            expect(fll.distanceHelper(bottomEdge[0], bottomEdge[1], bottomEdge[2], bottomEdge[3])).toEqual(4);
            let topEdge = face0[0];
            expect(fll.distanceHelper(topEdge[0], topEdge[1], topEdge[2], topEdge[3])).toEqual(2);
    });

    it('should calculate 9,3,3 xscaled face top edge and bottom edge length', () => {
            var fll = new FourLeggedLattice(9, 3, 3, 0); //b,t,h
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            let bottomEdge = face0[1];
            expect(fll.distanceHelper(bottomEdge[0], bottomEdge[1], bottomEdge[2], bottomEdge[3])).toEqual(9);
            let topEdge = face0[0];
            expect(fll.distanceHelper(topEdge[0], topEdge[1], topEdge[2], topEdge[3])).toEqual(3);
    });


    it('should calculate 9,3,3 with thickness 0.01 xscaled face top edge and bottom edge length', () => {
            var fll = new FourLeggedLattice(9, 3, 3, 3, 3, 0.01); //b,t,h
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            let bottomEdge = face0[1];
            expect(fll.distanceHelper(bottomEdge[0], bottomEdge[1], bottomEdge[2], bottomEdge[3])).toBeCloseTo(8.98);
            let topEdge = face0[0];
            expect(fll.distanceHelper(topEdge[0], topEdge[1], topEdge[2], topEdge[3])).toBeCloseTo(2.98);
    });
});
