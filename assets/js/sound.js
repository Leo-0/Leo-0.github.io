window.AudioContext = window.AudioContext || window.webkitAudioContext;
(function() {
    if (!window.AudioContext) {
        alert('当前浏览器不支持Web Audio API');
        return;
    }
    var piano = document.querySelector('.piano-container');
    piano.style.display = 'block';
    // 创建新的音频上下文接口
    var audioCtx = new AudioContext();
    // 声音频率
    var arrFrequency = [523, 586, 658, 697, 783, 879, 987, 1045, 1171];
    var frequency = arrFrequency[0];
    document.onkeydown = function(e) {
        var e = e || event;
        if (e.keyCode === 65 || e.keyCode === 49) { //A 1
            frequency = arrFrequency[0];
            sound(frequency);
        } else if (e.keyCode === 83 || e.keyCode === 50) { //S 2
            frequency = arrFrequency[1];
            sound(frequency);
        } else if (e.keyCode === 68 || e.keyCode === 51) { //D 3
            frequency = arrFrequency[2];
            sound(frequency);
        } else if (e.keyCode === 70 || e.keyCode === 52) { //F 4
            frequency = arrFrequency[3];
            sound(frequency);
        } else if (e.keyCode === 71 || e.keyCode === 53) { //G 5
            frequency = arrFrequency[4];
            sound(frequency);
        } else if (e.keyCode === 72 || e.keyCode === 54) { //H 6
            frequency = arrFrequency[5];
            sound(frequency);
        } else if (e.keyCode === 74 || e.keyCode === 55) { //J 7
            frequency = arrFrequency[6];
            sound(frequency);
        } else if (e.keyCode === 75 || e.keyCode === 56) { //K 8
            frequency = arrFrequency[7];
            sound(frequency);
        } else if (e.keyCode === 76 || e.keyCode === 57) { //L 9
            frequency = arrFrequency[8];
            sound(frequency);
        }
    };
    var keys = document.querySelectorAll('.key');
    keys.forEach(function(elem, index) {
        elem.onclick = function(e) {
            frequency = arrFrequency[index];
            sound(frequency);
        };
    });

    function sound(frequency) {
        // 创建一个OscillatorNode,表示一个周期性波形
        var oscillator = audioCtx.createOscillator();

        // 创建一个GainNode,控制音频的总音量
        var gainNode = audioCtx.createGain();

        // 把音量，音调和终节点进行关联
        oscillator.connect(gainNode);

        // audioCtx.destination返回AudioDestinationNode对象
        gainNode.connect(audioCtx.destination);

        // 指定音调的类型为triangle(还有square|sine|sawtooth)
        oscillator.type = 'triangle';

        // 设置当前播放声音的频率
        oscillator.frequency.value = frequency;

        // 设置当前时间音量为0
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

        // 0.01秒后音量为1
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);

        // 从当前时间开始播放
        oscillator.start(audioCtx.currentTime);

        // 1秒内声音慢慢降低
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

        // 1秒后完全停止声音
        oscillator.stop(audioCtx.currentTime + 1);
    }
})();