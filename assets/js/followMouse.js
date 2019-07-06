var cns = document.getElementById('avatarGraph');
var ctx;
if (cns.getContext) {
    ctx = cns.getContext('2d');
}
var w, h, r, xl, yl, xr, yr;
function init() {
    cns.width = cns.parentElement.offsetWidth;
    cns.height = cns.parentElement.offsetHeight;
    w = cns.parentElement.offsetWidth;
    h = cns.parentElement.offsetHeight;
    r = w > h ? Math.floor(h * 0.9) : Math.floor(w * 0.9); // 圆的最大直径
    xl = (5 * w - 2 * r) / 10; // 初始左眼坐标x
    yl = (3 * h - r) / 6; // 初始左眼坐标y
    xr = (5 * w + 2 * r) / 10; // 初始右眼坐标x
    yr = (3 * h - r) / 6; // 初始右眼坐标y
}
function draw() {
    draw2(xl, yl, xr, yr)
}
function draw2(x1, y1, x2, y2) {
    ctx.clearRect(0, 0, w, h);
    drawFace();
    drawLeftEye(x1, y1);
    drawRighttEye(x2, y2);
}
function drawFace() {
    ctx.beginPath();
    // ctx.strokeStyle = 'black';
    ctx.arc(w / 2, h / 2, r / 2, 0, Math.PI * 2, false);
    // ctx.stroke();
    // ctx.fillStyle = '#f1bf72';
    ctx.fillStyle = '#fffe9a';
    ctx.fill();
}
function drawLeftEye(x, y) {
    ctx.beginPath();
    ctx.arc((5 * w - 2 * r) / 10, (3 * h - r) / 6, r / 8, 0, Math.PI * 2, false); // 左眼外部
    // ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r / 16, 0, Math.PI * 2, false); // 左眼内部
    ctx.fillStyle = 'black';
    ctx.fill();
}
function drawRighttEye(x, y) {
    ctx.beginPath();
    ctx.arc((5 * w + 2 * r) / 10, (3 * h - r) / 6, r / 8, 0, Math.PI * 2, false); // 右眼外部
    // ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r / 16, 0, Math.PI * 2, false); // 右眼内部
    ctx.fillStyle = 'black';
    ctx.fill();
}
function locationInCanvas(canvas, x0, y0) {
    var bbox = cns.getBoundingClientRect();
    return {
        x: x0 - bbox.left * (cns.width / bbox.width),
        y: y0 - bbox.top * (cns.height / bbox.height)
    };
}
window.onload = function () {
    init();
    draw();
}
window.onmousemove = function (e) {
    var e = e || window.event;
    var loc = locationInCanvas(cns, e.clientX, e.clientY);
    var angle1 = Math.atan2(loc.y - yl, loc.x - xl);
    var angle2 = Math.atan2(loc.y - yr, loc.x - xr);
    xl = (5 * w - 2 * r) / 10 + r / 16 * Math.cos(angle1);
    yl = (3 * h - r) / 6 + r / 16 * Math.sin(angle1);
    xr = (5 * w + 2 * r) / 10 + r / 16 * Math.cos(angle2);
    yr = (3 * h - r) / 6 + r / 16 * Math.sin(angle2);
    draw2(xl, yl, xr, yr);
}
window.onresize = function () {
    init();
    draw();
}