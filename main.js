let canvas = document.getElementById("mycanvas");
let score = document.getElementById("score");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");
let score_get = 0;
let bullets = [];
let targets = [];
let g;
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};
let bull_start = {
    x: undefined,
    y: undefined,
    angle: undefined
};
canvas.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;//lấy vị trí chuột theo tọa độ
    mouse.y = event.clientY;
})//khi di chuyển chuột thì vị trí chuột sẽ được cập nhật lại

function Gun() {
    this.x = 20;
    this.y = canvas.height - 20;
    this.length = 200;
    this.color = "black";
    this.draw = function () {
        c.beginPath();
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
        c.moveTo(10, canvas.height - 10);
        c.lineTo(this.x, this.y);
        c.lineWidth = 20;
        c.fill();
        c.stroke();
        c.closePath();
    }
    this.update = function () {
        const angle = -Math.atan2(canvas.height - mouse.y, mouse.x);
        this.x = 35 + Math.cos(angle) * this.length;
        this.y = canvas.height - 35 + Math.sin(angle) * this.length;
        bull_start.x = this.x;
        bull_start.y = this.y;
        bull_start.angle = angle;
        this.draw();
    }
}

function init() {
    bullets = [];
    g = new Gun();
}

function set_score() {
    score.innerHTML = score_get;
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    g.update();
    set_score();
    c.beginPath();
    c.arc(0, canvas.height, 150, 0, 2 * Math.PI, false);
    c.fillStyle = "black";
    c.fill();
    c.closePath();
}

function start() {
    init();
    animate();
}

start();
