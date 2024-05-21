interface BanditsConfig {}
export abstract class Bandits {
    means: Float32Array;
    numArms: number;
    bestArm: number;

    abstract pullArm(arm: number): number;
    abstract randomize(): void;

    abstract updateWithConfig(config: BanditsConfig): void;
    abstract extractConfig(): BanditsConfig;
}

interface BernoulliBanditsConfig extends BanditsConfig {
    numArms: number;
    means?: Array<number>;
}
export class BernoulliBandits extends Bandits {

    readonly defaultConfig: BernoulliBanditsConfig = {
        numArms: 5,
    }

    constructor() {
        super();
        this.updateWithConfig(this.defaultConfig); // This is not the best way to init. Let's figure something else out.
        this.randomize();
    }

    pullArm(arm: number): number {
        if (arm < 0 || arm >= this.numArms) {
            throw new Error("Invalid arm index");
        } else {
            if (Math.random() < this.means[arm]) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    randomize(): void {
        let currMax = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < this.numArms; ++i) {
            const mean = Math.random();
            this.means[i] = mean;
            if (mean > currMax) {
                this.bestArm = i;
                currMax = mean;
            }
        }
    }

    updateWithConfig(config: BanditsConfig): void {
        if (this.isCorrectConfig(config)) {
            const correctConfig = (config as BernoulliBanditsConfig);
            this.numArms = correctConfig.numArms;
            this.means = new Float32Array(this.numArms);
            let currMax = Number.NEGATIVE_INFINITY;
            correctConfig.means?.forEach((mean, i) => {
                // clamp to [0, 1]
                const clampedMean = Math.max(0, Math.min(1, mean));
                this.means[i] = clampedMean;
                if (clampedMean > currMax) {
                    this.bestArm = i;
                    currMax = clampedMean;
                }
            });
        }
    }

    extractConfig(): BernoulliBanditsConfig {
        return {
            numArms: this.numArms,
            means: Array.from(this.means),
        } as BernoulliBanditsConfig;
    }

    private isCorrectConfig(config: BanditsConfig): config is BernoulliBanditsConfig {
        return (config as BernoulliBanditsConfig).numArms !== undefined;
    }
}
