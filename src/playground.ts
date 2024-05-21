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
    epsilon: 0.1,
    numSimultaenous: 3,
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
    iter += 1;
    algorithmInstance.step();
    updateUI();
}

let trueMeansRow = d3.select("#true-means-row").selectChildren("td");
let estMeansRow = d3.select("#est-means-row").selectChildren("td");
let countRow = d3.select("#count-row").selectChildren("td");
let iterationText = d3.select("#iterations");
let totalRegretText = d3.select("#total-regret");
let avgRegretText = d3.select("#avg-regret");

let f = d3.format(".3f");

function updateUI() {
    // This is not the correct way to update UI.
    trueMeansRow.text((_,i) => f(bandits.means[i]));
    estMeansRow.text((_,i) => {
        let strList = [];
        for (let j = 0; j < algorithmInstance.numSimultaenous; ++j) {
            strList.push(f(algorithmInstance.estMeans[j][i]));
        }
        return strList.join(", ");
    });
    countRow.text((_,i) => {
        let strList = [];
        for (let j = 0; j < algorithmInstance.numSimultaenous; ++j) {
            strList.push(algorithmInstance.counts[j][i]);
        }
        return strList.join(", ");
    });
    iterationText.text(iter);
    totalRegretText.text(() => {let strList = [];
        for (let j = 0; j < algorithmInstance.numSimultaenous; ++j) {
            strList.push(f(algorithmInstance.totalRegrets[j]));
        }
        return strList.join(", ")});
    if (iter == 0) {
        avgRegretText.text(0);
    } else {
        avgRegretText.text(f(algorithmInstance.totalRegrets[0] / iter));
    }
}

reset();

let resetButton = d3.select("#reset-button");
resetButton.on("click", () => {
    player.reset();
    reset();
})
