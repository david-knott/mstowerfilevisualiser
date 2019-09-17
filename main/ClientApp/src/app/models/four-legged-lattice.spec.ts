import { FourLeggedLattice } from './four-legged-lattice';

describe('FourLeggedLattice', () => {
    it('should create an instance', () => {
      expect(new FourLeggedLattice(4, 2, 4, 2, 2)).toBeTruthy();
    });

    it('should calculate unscaled face vertices correctly', () => {
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

    it('should calculate 2,2,2 scaled face vertices correctly', () => {
            var fll = new FourLeggedLattice(2, 2, 2, 2, 2);
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            expect(face0.length).toEqual(4);
            let top = face0[0];
            expect(fll.distanceHelper(top[0], top[1], top[2], top[3])).toEqual(2);
    });

    it('should calculate 2,1,1 xscaled face vertices correctly', () => {
            var fll = new FourLeggedLattice(1, 2, 1, 2, 1);
            expect(fll).toBeTruthy();
            let face0 = fll.getPanelFaceVertices(0);
            expect(face0.length).toEqual(4);
            let top = face0[0];
            expect(fll.distanceHelper(top[0], top[1], top[2], top[3])).toEqual(1);
    });

});
