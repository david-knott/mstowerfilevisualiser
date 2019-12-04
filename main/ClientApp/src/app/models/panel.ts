import { BracingPattern } from './bracing-pattern';
import { FacePanel } from './face-panel';

/**
 * A panel
 */
export abstract class Panel {
    bracingPattern: BracingPattern;
    constructor(bracingPattern: BracingPattern) {
        this.bracingPattern = bracingPattern;
    }
}
