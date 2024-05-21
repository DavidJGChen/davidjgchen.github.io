import * as d3 from "d3/dist/d3";
import { Bandits, BernoulliBandits } from "./bandits";
import { AlgorithmWithBasicStats, EpsilonGreedy, EpsilonGreedyConfig } from "./algorithms";

class Player {
    private isPlaying = false;
    private t = null;
    private callback: (isPlaying: boolean) => void = null;

    reset(): void {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.pause();
        }
        if (this.callback != null) {
            this.callback(this.isPlaying);
        }
    }

    playOrPause(): void {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.pause();
        } else { // is paused
            this.isPlaying = true;
            this.play();
        }
        if (this.callback != null) {
            this.callback(this.isPlaying);
        }
    }

    setOnPlayPause(callback: (isPlaying: boolean) => void ): void {
        this.callback = callback;
    }

    private play(): void {
        console.log("Now playing");
        this.t = d3.interval((elapsed) => {
            step();
        }, 100);
    }

    private pause(): void {
        console.log("Now pausing");
        this.t.stop();
    }
}

let player = new Player();
let playButton = d3.select("#play-pause-button");

playButton.on("click", () => {
    player.playOrPause();
});

player.setOnPlayPause(isPlaying => {
    playButton.classed("playing", isPlaying);
});

let iter = 0;
let new_instance = true;

let bandits: Bandits = new BernoulliBandits();

let tempConfig : EpsilonGreedyConfig = { // THIS IS TEMPORARY
    epsilon: 0.01,
    numSimultaenous: 1000,
}

// Make this into an array
let algorithmInstance: AlgorithmWithBasicStats = new EpsilonGreedy(bandits, tempConfig);

function reset() {
    iter = 0;
    bandits.randomize();
    algorithmInstance.reset();
    console.log(algorithmInstance);
    updateUI();
}

function step() {
    if (new_instance) {
        reset();
        new_instance = false;
    }
    algorithmInstance.step(iter);
    iter += 1;
    updateUI();
}

let trueMeansRow = d3.select("#true-means-row").selectChildren("td");
let estMeansRow = d3.select("#est-means-row").selectChildren("td");
let countRow = d3.select("#count-row").selectChildren("td");
let iterationText = d3.select("#iterations");
let totalRegretText = d3.select("#total-regret");
let avgRegretText = d3.select("#avg-regret");
let estMeansMeanStdRow = d3.select("#est-means-mean-std-row").selectChildren("td");
let countMeanStdRow = d3.select("#count-mean-std-row").selectChildren("td");


let f = d3.format(".3f");

// Refactor this and get rid of it
function updateUI() {
    let maxDisplay = Math.min(algorithmInstance.numSimultaenous, 8);
    // This is not the correct way to update UI.
    trueMeansRow.text((_,i) => f(bandits.means[i]));
    estMeansRow.text((_,i) => {
        let strList = [];
        for (let j = 0; j < maxDisplay; ++j) {
            strList.push(f(algorithmInstance.estMeans[i][j]));
        }
        return strList.join(", ");
    });
    countRow.text((_,i) => {
        let strList = [];
        for (let j = 0; j < maxDisplay; ++j) {
            strList.push(algorithmInstance.counts[i][j]);
        }
        return strList.join(", ");
    });
    iterationText.text(iter);
    totalRegretText.text(() => {
        return f(d3.mean(algorithmInstance.totalRegrets)) + ", " + f(d3.deviation(algorithmInstance.totalRegrets));
    });

    let strList = [];
    for (let j = 0; j < maxDisplay; ++j) {
        if (iter == 0) {
            strList.push(0);
        } else {
            strList.push(f(algorithmInstance.totalRegrets[j] / iter));
        }
    }
    avgRegretText.text(() => {
        if (iter == 0) {
            return "0, 0";
        } else {
            return f(d3.mean(algorithmInstance.totalRegrets) / iter) + ", " + f(d3.deviation(algorithmInstance.totalRegrets.map(r => r / iter)))
        }
    });

    estMeansMeanStdRow.text((_,i) => {
        return f(d3.mean(algorithmInstance.estMeans[i])) + ", " + f(d3.deviation(algorithmInstance.estMeans[i]));
    });

    countMeanStdRow.text((_,i) => {
        return f(d3.mean(algorithmInstance.counts[i])) + ", " + f(d3.deviation(algorithmInstance.counts[i]));
    });
}

reset();

let resetButton = d3.select("#reset-button");
resetButton.on("click", () => {
    player.reset();
    reset();
})
