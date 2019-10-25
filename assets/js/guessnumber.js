(function () {
    var min = 1;
    var max = 999;
    var gap = 20;
    var number;
    var min_input = document.getElementById('min-num');
    var max_input = document.getElementById('max-num');
    var randomBtn = document.getElementById('random');
    var startBtn = document.getElementById('start');
    var num_div = document.getElementById('number');
    var pn = num_div.parentElement || num_div.parentNode;
    var confirmBtn = document.getElementById('confirm');
    var gn = document.getElementById('gn');
    var begin = false;
    var titles = ['难道是程序猿?', '你可能是个女生', '普通人', '瞎猜的吧'];
    randomRange();
    randomBtn.onclick = randomRange;
    startBtn.onclick = function () {
        var n1 = min_input.value;
        var n2 = max_input.value;
        var pat = /\D/;
        if (!pat.test(n1) && !pat.test(n2) && n1 !== '' && n2 !== '') {
            var num1 = parseInt(n1);
            var num2 = parseInt(n2);
            if (num1 + gap < num2) {
                if (!begin) {
                    begin = true;
                    this.innerHTML = '已开始';
                    disable(min_input, 'readonly');
                    disable(max_input, 'readonly');
                    disable(randomBtn, 'disabled');
                    disable(startBtn, 'disabled');
                    removeClass(pn, 'flip');
                    setTimeout(() => {
                        start(num1, num2);
                    }, 1000);
                }
            } else {
                alert('范围应相差' + gap + ',且左小右大');
            }
        } else {
            alert('数值范围需为正整数');
        }
    };
    confirmBtn.onclick = function () {
        var gnum = gn.value;
        var pat = /\D/;
        if (!pat.test(gnum) && gnum !== '') {
            if (begin) {
                begin = false;
                addClass(pn, 'flip');
                var n = Math.abs(parseInt(gnum) - number);
                var msg = '';
                setTimeout(() => {
                    switch (n) {
                        case 0:
                            msg = 'Amazing!竟然猜对了!'; break;
                        case 1: msg = '差一点就对了'; break;
                        case 2:
                        case 3:
                        case 4:
                            msg = '已经很接近了'; break;
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                            msg = '直觉不够敏锐啊'; break;
                        default:
                            msg = '差好多啊!'; break;
                    }
                    alert(msg);
                    startBtn.innerHTML = '开始';
                    enable(min_input, 'readonly');
                    enable(max_input, 'readonly');
                    enable(randomBtn, 'disabled');
                    enable(startBtn, 'disabled');
                }, 1000);
            } else {
                alert('请先点击开始');
            }
        } else {
            alert('请输入正整数');
        }
    };
    function randomRange() {
        var min_num = randomNumber(min, max - gap);
        var temp = randomNumber(min_num, max);
        var max_num = temp < (min_num + gap) ? (min_num + gap) : temp;
        max_num = max_num > max ? max : max_num;
        min_input.value = min_num;
        max_input.value = max_num;
    }
    function randomNumber(minNum, maxNum) {
        return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    }
    function start(n1, n2) {
        number = randomNumber(n1, n2);
        num_div.innerHTML = number;
    }
    function addClass(ele, className) {
        var classNames = ele.className;
        if (classNames.indexOf(className) === -1) {
            ele.className = classNames + ' ' + className;
        }
    }
    function removeClass(ele, className) {
        var classNames = ele.className;
        if (classNames.indexOf(className) !== -1) {
            var csp = classNames.split(className);
            ele.className = csp.join(' ').trim();
        }
    }
    function disable(ele, attr) {
        ele.setAttribute(attr, true);
    }
    function enable(ele, attr) {
        ele.removeAttribute(attr);
    }
})();