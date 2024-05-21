import { Bandits } from "./bandits";
import * as d3 from "d3/dist/d3";

interface AlgorithmConfig {
    numSimultaenous: number;
}

export abstract class Algorithm {
    bandits: Bandits;
    numSimultaenous: number;

    constructor(bandits: Bandits) {
        this.bandits = bandits;
    }

    abstract reset(): void;

    abstract step(): void;

    abstract updateWithConfig(config: AlgorithmConfig): void;
    abstract extractConfig(): AlgorithmConfig;

    protected abstract updateWithBandit(): void;
}

export abstract class AlgorithmWithBasicStats extends Algorithm {
    counts: Int32Array[];
    estMeans: Float32Array[];
    totalRegrets: number[];

    constructor(bandits: Bandits, config: AlgorithmConfig) {
        super(bandits);
        this.updateWithConfig(config); // This is not the best way to init, let's figure something else out.
        this.counts = new Array(this.numSimultaenous);
        this.estMeans = new Array(this.numSimultaenous);
        this.totalRegrets = new Array(this.numSimultaenous);
        this.updateWithBandit();
    }

    reset(): void {
        for (let i = 0; i < this.numSimultaenous; i++) {
            this.counts[i] = new Int32Array(this.bandits.numArms);
            this.estMeans[i] = new Float32Array(this.bandits.numArms);
            this.totalRegrets[i] = 0;
        }
    }

    protected updateStats(arm: number, reward: number, i: number): void {
        this.counts[i][arm] += 1;
        const prevMean = this.estMeans[i][arm];
        this.estMeans[i][arm] = prevMean + (reward - prevMean) / this.counts[i][arm];
        this.totalRegrets[i] += this.bandits.means[this.bandits.bestArm] - this.bandits.means[arm];
    }

    protected updateWithBandit(): void {
        let oldCounts = this.counts;
        let oldEstMeans = this.estMeans;
        const prevArms = oldCounts[0]?.length ?? 0;
        const armLimit = Math.min(prevArms, this.bandits.numArms);

        // Maybe a better way to copy
        for (let i = 0; i < this.numSimultaenous; i++) {
            this.counts[i] = new Int32Array(this.bandits.numArms);
            this.estMeans[i] = new Float32Array(this.bandits.numArms);
            for (let j = 0; j < armLimit; ++j) {
                this.counts[i][j] = oldCounts[i][j];
                this.estMeans[i][j] = oldEstMeans[i][j];
            }
        }
    }
}


export interface EpsilonGreedyConfig extends AlgorithmConfig {
    epsilon: number;
}
export class EpsilonGreedy extends AlgorithmWithBasicStats {
    epsilon: number;

    readonly defaultConfig: EpsilonGreedyConfig = {
        numSimultaenous: 3,
        epsilon: 0.1,
    }

    step(): void {
        for (let i = 0; i < this.numSimultaenous; i++) {
            const useRandArm = Math.random() < this.epsilon;
            let arm: number = -1; // Is this the best way to initialize and set?
            if (useRandArm) {
                arm = Math.floor(Math.random() * this.bandits.numArms);
            } else {
                arm = d3.maxIndex(this.estMeans[i]);
            }
            const reward = this.bandits.pullArm(arm);
            this.updateStats(arm, reward, i);
        }
    }

    updateWithConfig(config: AlgorithmConfig): void {
        const epsilonConfig = config as EpsilonGreedyConfig; // Write a better type checker
        this.epsilon = epsilonConfig.epsilon;
        const prevSimultaneous = this.numSimultaenous;
        this.numSimultaenous = epsilonConfig.numSimultaenous;

        // TODO: FINISH THIS!!!
        if (this.numSimultaenous > prevSimultaneous) {
            this.counts = new Array(this.numSimultaenous);
            this.estMeans = new Array(this.numSimultaenous);
            this.totalRegrets = new Array(this.numSimultaenous);
        }
    }

    extractConfig(): EpsilonGreedyConfig {
        return {
            numSimultaenous: this.numSimultaenous,
            epsilon: this.epsilon,
        } as EpsilonGreedyConfig;
    }
}

export class Random extends AlgorithmWithBasicStats {

    readonly defaultConfig: AlgorithmConfig = {
        numSimultaenous: 3,
    }

    constructor(bandits: Bandits, config: AlgorithmConfig) {
        super(bandits, config);
    }

    step(): void {
        for (let i = 0; i < this.numSimultaenous; i++) {
            const arm = Math.floor(Math.random() * this.bandits.numArms);
            const reward = this.bandits.pullArm(arm);
            this.updateStats(arm, reward, i);
        }
    }

    updateWithConfig(config: AlgorithmConfig): void {
        const epsilonConfig = config as AlgorithmConfig; // Write a better type checker
        const prevSimultaneous = this.numSimultaenous;
        this.numSimultaenous = epsilonConfig.numSimultaenous;

        // TODO: FINISH THIS!!!
        if (this.numSimultaenous > prevSimultaneous) {
            this.counts = new Array(this.numSimultaenous);
            this.estMeans = new Array(this.numSimultaenous);
            this.totalRegrets = new Array(this.numSimultaenous);
        }
    }

    extractConfig(): AlgorithmConfig {
        return {
            numSimultaenous: this.numSimultaenous,
        } as AlgorithmConfig;
    }
}
