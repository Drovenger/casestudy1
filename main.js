let canvas = document.getElementById("mycanvas");
let score = document.getElementById("score");
let life = document.getElementById("life");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");
let score_get = 0;
let life_get = 3;
let bullets = [];
let targets = [];
let g;

setInterval(function () {
    targets.push(new Target());
}, 200); //tạo thêm bóng theo thời gian được gán (milisecond)

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

function distance(x1, y1, x2, y2) {
    let x_d = x2 - x1;
    let y_d = y2 - y1;
    return (Math.sqrt(Math.pow(x_d, 2) + Math.pow(y_d, 2)));
}

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

let bull_start = { //biến vị trí và góc bắn viên đạn
    x: undefined,
    y: undefined,
    angle: undefined
};

canvas.addEventListener("click", function () {//mỗi khi lick chuột thì bắn một viên đạn
    bullets.push(new Bullet());
});

canvas.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;//lấy vị trí chuột theo tọa độ
    mouse.y = event.clientY;
});//khi di chuyển chuột thì vị trí chuột sẽ được cập nhật lại

function getRandomHex() {
    return Math.floor(Math.random() * 255);
}

function getRandomColor() {
    let red = getRandomHex();
    let green = getRandomHex();
    let blue = getRandomHex();
    return "rgb(" + red + "," + green + "," + blue + ")";
}

function Target() { //lớp mục tiêu
    this.x = canvas.width;
    this.y = canvas.height;
    this.radius = Math.random() * 100 + 10;
    this.ang = (canvas.height / 2) / canvas.width;
    this.dx = -Math.random() * 10 - 3;
    this.color = getRandomColor();
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, 0, false);
        c.fillStyle = this.color;
        c.fill();
        c.strokeStyle = "red";
        c.lineWidth = 1;
        c.stroke();
        c.closePath();
    }
    this.update = function (bullets, targets) {
        let target_index = 0;
        for (let i = 0; i < targets.length; i++) {
            if (this === targets[i]) {
                target_index = i;
                break;
            }
        }
        for (let i = 0; i < bullets.length; i++) {
            if (distance(this.x, this.y, bullets[i].x, bullets[i].y) < (this.radius + bullets[i].radius)) {
                bullets.splice(i, 1);
                targets.splice(target_index, 1);
                score_get += parseInt(100 - this.radius);
                if (score_get > 1000) {
                    life_get++;
                    score_get = score_get - 1000;
                }
            }
        }
        this.x += this.dx;
        this.y = this.ang * this.x + canvas.height / 4;
        if (this.x < 0) {
            targets.splice(target_index, 1);
            score_get -= parseInt(this.radius);
            life_get--;
        }
        this.draw();
    }
}

function Bullet() {//lớp đạn
    const velocity = 25;
    this.x = bull_start.x;//khởi tạo vị trí ban đầu của viên đạn, đầu vòi súng
    this.y = bull_start.y;
    this.dx = Math.cos(bull_start.angle) * velocity;//tạo góc bắn
    this.dy = Math.sin(bull_start.angle) * velocity;
    this.color = "black";
    this.radius = 10;
    this.gravity = 0.3;
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
    this.update = function (bullets) {
        let bullet_index = 0;
        for (let i = 0; i < bullets.length; i++) {
            if (this === bullets[i]) {
                bullet_index = i;
                break;
            }
        }
        this.x += this.dx;
        this.y += this.dy;
        this.dy += this.gravity;
        if (this.x > canvas.width || this.y > canvas.height) {//khi đạn bay ra khỏi khung thì xóa nó khỏi mảng
            score_get -= 5;
            bullets.splice(bullet_index, 1);
        }
        this.draw();
    }
}

function Gun() {//lớp súng
    this.x = 20;
    this.y = canvas.height - 20;
    this.length = 200;
    this.color = "black";
    this.draw = function () { //vẽ nòng súng
        c.beginPath();
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
        c.moveTo(10, canvas.height - 10);
        c.lineTo(this.x, this.y);
        c.lineWidth = 30;
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

function set_life() {
    life.innerHTML = life_get;
}

function confirm() {
    alert("Bạn đã thua!\n" + "Bạn có muốn chơi lại không?");
    document.location.reload();
}

function animate() { //tổng hợp hoạt cảnh
    if (life_get > 0) {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        g.update();
        set_score();
        set_life();
        c.beginPath();
        c.arc(0, canvas.height, 150, 0, 2 * Math.PI, false);
        c.fillStyle = "black";
        c.fill();
        c.closePath();
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].update(bullets);
        }
        for (let i = 0; i < targets.length; i++) {
            targets[i].update(bullets, targets);
        }
    } else {
        confirm();
    }
}

function start() {
    alert("Chào mừng bạn đến với game bắn bóng!");
    alert("Bắt đàu bạn sẽ có 3 mạng,\n" +
        "Mỗi lần bóng bay mất sẽ mất 1 mạng,\n" +
        "Mỗi khi đạt 1000 điểm sẽ được thưởng 1 mạng");
    alert("Chúc các bạn vui vẻ!");
    init();
    animate();
}

start();
