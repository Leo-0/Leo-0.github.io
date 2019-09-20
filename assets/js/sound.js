(function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!window.AudioContext) {
        var noSupport = document.getElementById('no-support');
        noSupport.innerHTML = '当前浏览器不支持Web Audio API';
        return;
    } else {
        var upport = document.getElementById('support');
        support.innerHTML = '试试按下1-9,或者按a,s,d,f,g,h,j,k,l,有声音哦';
    }
    // 创建新的音频上下文接口
    var audioCtx = new AudioContext();
    // 声音频率
    // var arrFrequency = [523, 586, 658, 697, 783, 879, 987, 1045, 1171];
    var arrFrequency = [523, 587, 659, 698, 784, 880, 988, 1047, 1175];
    // [262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319, 1397, 1568, 1760, 1967];
    var frequency = arrFrequency[0];
    document.onkeydown = function (e) {
        var e = e || event;
        var kc = e.keyCode;
        showKey(kc);
        if (kc === 65 || kc === 49) { //A 1
            frequency = arrFrequency[0];
            createSound(frequency);
        } else if (kc === 83 || kc === 50) { //S 2
            frequency = arrFrequency[1];
            createSound(frequency);
        } else if (kc === 68 || kc === 51) { //D 3
            frequency = arrFrequency[2];
            createSound(frequency);
        } else if (kc === 70 || kc === 52) { //F 4
            frequency = arrFrequency[3];
            createSound(frequency);
        } else if (kc === 71 || kc === 53) { //G 5
            frequency = arrFrequency[4];
            createSound(frequency);
        } else if (kc === 72 || kc === 54) { //H 6
            frequency = arrFrequency[5];
            createSound(frequency);
        } else if (kc === 74 || kc === 55) { //J 7
            frequency = arrFrequency[6];
            createSound(frequency);
        } else if (kc === 75 || kc === 56) { //K 8
            frequency = arrFrequency[7];
            createSound(frequency);
        } else if (kc === 76 || kc === 57) { //L 9
            frequency = arrFrequency[8];
            createSound(frequency);
        }
    };

    function createSound(frequency) {
        // 创建一个OscillatorNode,表示一个周期性波形
        var oscillator = audioCtx.createOscillator();
        // 创建一个GainNode,控制音频的总音量
        var gainNode = audioCtx.createGain();
        //延迟,单位秒
        var duration = 2;
        //音量
        var volume = 3;
        // 把音量，音调和终节点进行关联
        oscillator.connect(gainNode);
        // audioCtx.destination返回AudioDestinationNode对象,音量和设备关联
        gainNode.connect(audioCtx.destination);
        // 指定音调的类型为triangle(还有square|sine|sawtooth)
        oscillator.type = 'triangle';
        // 设置当前播放声音的频率
        oscillator.frequency.value = frequency;
        // 设置当前时间音量为0
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        // 0.01秒后音量为1
        gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.01);
        // 从当前时间开始播放
        oscillator.start(audioCtx.currentTime);
        // 延迟时间内声音慢慢降低
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        // 延迟时间后完全停止声音
        oscillator.stop(audioCtx.currentTime + duration);
    }
    function showKey(keyCode) {
        var k = document.getElementById('key');
        var t = document.getElementById('tip');
        t.innerHTML = '您按下了:';
        k.innerHTML = String.fromCharCode(keyCode);
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        k.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    }
})();