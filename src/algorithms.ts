import { Bandits } from "./bandits";
import * as d3 from "d3/dist/d3";

interface AlgorithmConfig {
    numSimultaenous: number;
}

export abstract class Algorithm {
    bandits: Bandits;
    numSimultaenous: number;

    constructor(bandits: Bandits, config: AlgorithmConfig) {
        this.bandits = bandits;
        this.numSimultaenous = config.numSimultaenous;
    }

    abstract reset(): void;

    abstract step(iter: number): void;

    abstract updateWithConfig(config: AlgorithmConfig): void; // Not the best method, let's think about this
    abstract extractConfig(): AlgorithmConfig;

    protected abstract updateWithBandit(): void;
}

export abstract class AlgorithmWithBasicStats extends Algorithm {
    counts: Int32Array[];
    estMeans: Float32Array[];
    totalRegrets: Float32Array;

    constructor(bandits: Bandits, config: AlgorithmConfig) {
        super(bandits, config);
        this.counts = Array.from({length: bandits.numArms}, _ => new Int32Array(this.numSimultaenous));
        this.estMeans = Array.from({length: bandits.numArms}, _ => new Float32Array(this.numSimultaenous));
        this.totalRegrets = new Float32Array(this.numSimultaenous);
        this.updateWithBandit();
    }

    reset(): void {
        this.counts.forEach((armArray) => armArray.fill(0));
        this.estMeans.forEach((armArray) => armArray.fill(0));
        this.totalRegrets.fill(0);
    }

    protected updateStats(arm: number, reward: number, i: number): void {
        this.counts[arm][i] += 1;
        const prevMean = this.estMeans[arm][i];
        this.estMeans[arm][i] = prevMean + (reward - prevMean) / this.counts[arm][i];
        this.totalRegrets[i] += this.bandits.means[this.bandits.bestArm] - this.bandits.means[arm];
    }

    protected updateWithBandit(): void {
        // TODO: REWRITE
        // let oldCounts = this.counts;
        // let oldEstMeans = this.estMeans;
        // const prevArms = oldCounts[0]?.length ?? 0;
        // const armLimit = Math.min(prevArms, this.bandits.numArms);

        // // Maybe a better way to copy
        // for (let i = 0; i < this.numSimultaenous; i++) {
        //     this.counts[i] = new Int32Array(this.bandits.numArms);
        //     this.estMeans[i] = new Float32Array(this.bandits.numArms);
        //     for (let j = 0; j < armLimit; ++j) {
        //         this.counts[i][j] = oldCounts[i][j];
        //         this.estMeans[i][j] = oldEstMeans[i][j];
        //     }
        // }
    }
}


export interface EpsilonGreedyConfig extends AlgorithmConfig {
    epsilon: number;
}
export class EpsilonGreedy extends AlgorithmWithBasicStats {
    epsilon: number;

    constructor(bandits: Bandits, config: EpsilonGreedyConfig) {
        super(bandits, config);
        this.epsilon = config.epsilon;
    }

    step(iter: number): void {
        if (iter < this.bandits.numArms) {
            for (let i = 0; i < this.numSimultaenous; i++) {
                let arm = iter;
                const reward = this.bandits.pullArm(arm);
                this.updateStats(arm, reward, i);
            }
            return;
        }

        Array.from({length: this.numSimultaenous}, Math.random).map((v, i) => {
            if (v < this.epsilon) {
                return Math.floor(Math.random() * this.bandits.numArms);
            } else {
                let temp = d3.maxIndex(this.estMeans, (arm) => {
                    return arm[i]
                });
                return temp;
            }
        }).forEach((arm, i) => {
            const reward = this.bandits.pullArm(arm);
            this.updateStats(arm, reward, i);
        });
    }

    updateWithConfig(config: AlgorithmConfig): void {
        // const epsilonConfig = config as EpsilonGreedyConfig; // Write a better type checker
        // this.epsilon = epsilonConfig.epsilon;
        // const prevSimultaneous = this.numSimultaenous;
        // this.numSimultaenous = epsilonConfig.numSimultaenous;

        // // TODO: FINISH THIS!!!
        // if (this.numSimultaenous > prevSimultaneous) {
        //     this.counts = new Array(this.numSimultaenous);
        //     this.estMeans = new Array(this.numSimultaenous);
        //     this.totalRegrets = new Array(this.numSimultaenous);
        // }
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
        // const epsilonConfig = config as AlgorithmConfig; // Write a better type checker
        // const prevSimultaneous = this.numSimultaenous;
        // this.numSimultaenous = epsilonConfig.numSimultaenous;

        // // TODO: FINISH THIS!!!
        // if (this.numSimultaenous > prevSimultaneous) {
        //     this.counts = new Array(this.numSimultaenous);
        //     this.estMeans = new Array(this.numSimultaenous);
        //     this.totalRegrets = new Array(this.numSimultaenous);
        // }
    }

    extractConfig(): AlgorithmConfig {
        return {
            numSimultaenous: this.numSimultaenous,
        } as AlgorithmConfig;
    }
}
