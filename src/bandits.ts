import * as d3 from "d3/dist/d3";

// Declare the chart dimensions and margins.
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Declare the x (horizontal position) scale.
const x = d3.scaleUtc()
    .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

// Add the x-axis.
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

// Add the y-axis.
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

// Append the SVG element.
const container = d3.select("#container");
console.log(container);
console.log(svg);
console.log("wahoo!!!");
container.append(() => svg.node());
console.log("wahoo 2!!!");


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
let numArms = 5;
let trueMeans: Float32Array = new Float32Array(numArms);
let estMeans: Float32Array = new Float32Array(numArms);
let counts: Int32Array = new Int32Array(numArms);
let maxMean = 0;
let totalRegret = 0;

function reset() {
    iter = 0;
    trueMeans = new Float32Array(numArms);
    maxMean = 0;
    totalRegret = 0;
    for (let i = 0; i < trueMeans.length; i++) {
        let newMean = Math.random();
        trueMeans[i] = newMean
        maxMean = Math.max(maxMean, newMean);
    }
    estMeans = new Float32Array(numArms);
    counts = new Int32Array(numArms);
    updateUI();
}

function step() {
    if (new_instance) {
        reset();
        new_instance = false;
    }
    iter += 1;
    epsilonGreedyStep();
    updateUI();
}

function pullArm(arm: number): number {
    return bernoulliReward(arm);
}

function bernoulliReward(arm: number): number {
    const mean = trueMeans[arm];
    if (Math.random() < mean) {
        return 1;
    } else {
        return 0;
    }
}

function updateArmStats(arm: number, reward: number) {
    counts[arm] += 1;
    const prevMean = estMeans[arm];
    estMeans[arm] = prevMean + (reward - prevMean) / counts[arm];
    totalRegret += maxMean - trueMeans[arm];
}

function randomStep() {
    const arm = Math.floor(Math.random() * numArms);
    const reward = pullArm(arm);
    updateArmStats(arm, reward);
}

function epsilonGreedyStep() {
    const e = 0.05;
    const randArm = Math.random() < e;
    const arm = randArm ? Math.floor(Math.random() * numArms) : d3.maxIndex(estMeans);
    const reward = pullArm(arm);
    updateArmStats(arm, reward);
}

let trueMeansRow = d3.select("#true-means-row").selectChildren("td");
let estMeansRow = d3.select("#est-means-row").selectChildren("td");
let countRow = d3.select("#count-row").selectChildren("td");
let iterationText = d3.select("#iterations");
let totalRegretText = d3.select("#total-regret");
let avgRegretText = d3.select("#avg-regret");

let f = d3.format(".3f");

function updateUI() {
    trueMeansRow.text((_,i) => f(trueMeans[i]));
    estMeansRow.text((_,i) => f(estMeans[i]));
    countRow.text((_,i) => counts[i]);
    iterationText.text(iter);
    totalRegretText.text(f(totalRegret));
    if (iter == 0) {
        avgRegretText.text(0);
    } else {
        avgRegretText.text(f(totalRegret / iter));
    }
}

reset();

let resetButton = d3.select("#reset-button");
resetButton.on("click", () => {
    player.reset();
    reset();
})