(function () {
    let closeBtn = document.getElementById('close-btn');
    let mask = document.getElementById('mask');
    const col = 6;//列数
    const row = 4;//行数
    const len = 24;//col*row
    let imgs = document.getElementsByTagName('img'); // 获取所有图片
    let imgList = Array.prototype.slice.call(imgs);
    //添加点击事件
    imgList.forEach(img => {
        img.addEventListener('click', () => {
            let posArr = shuffle(initPositionArr(len));//打乱的数值
            toggleClass(mask, 'hidden');
            addPanel();
            let kids = mask.getElementsByClassName('wall-kid'); //获取所有子块div
            let kidsList = Array.prototype.slice.call(kids);
            kidsList.forEach((kid, i) => {
                setTimeout(function () {
                    setBackground(kid, img, i);
                    setStyle(kid, {
                        'transform': 'rotate(0)'
                    });
                }, posArr.shift() * 35);
            });
        }, false);
    });
    function init() {
        let kids = mask.getElementsByClassName('wall-kid'); //获取所有子块div
        if (kids.length !== 0) {
            let kidsList = Array.prototype.slice.call(kids);
            kidsList.forEach(kid => {
                mask.removeChild(kid);
            })
        }
    }
    //切换类名
    function toggleClass(ele, className) {
        let classNames = ele.className;
        if (classNames.indexOf(className) !== -1) {
            let csp = classNames.split(className);
            ele.className = csp.join(' ').trim();
        } else {
            ele.className = classNames + ' ' + className;
        }
    }
    // 添加小面板
    function addPanel() {
        // let kidWidth = Math.round(mask.offsetWidth / col);
        // let kidHeight = Math.round(mask.offsetHeight / row);
        let kidWidth = mask.offsetWidth / col;
        let kidHeight = mask.offsetHeight / row;
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                let kid = document.createElement('div');
                kid.setAttribute('class', 'wall-kid');
                setStyle(kid, {
                    'width': kidWidth + 'px',
                    'height': kidHeight + 'px',
                    'background-repeat': 'no-repeat',
                    'transition': 'transform .4s',
                    'transform': 'rotate(180deg)',
                    'position': 'absolute',
                    'top': i * kidHeight + 'px',
                    'left': j * kidWidth + 'px'
                });
                mask.appendChild(kid);
            }
        }
    }
    //设置样式
    function setStyle(ele, styles) {
        for (var s in styles) {
            ele.style[s] = styles[s];
        }
    }
    //设置背景
    function setBackground(ele, img, index) {
        let imgsrc = img.src;
        let w = img.naturalWidth; //HTML5新属性,获取图片真实宽度
        let h = img.naturalHeight;//HTML5新属性,获取图片真实高度
        let middlePos = calcMiddlePos(ele, w, h); //背景居中的偏移量
        let backgroundPos = calcBackgroundPos(ele, index, middlePos);
        setStyle(ele, {
            'background-image': 'url(' + imgsrc + ')',
            'background-position': backgroundPos.horizontalPos + 'px ' + backgroundPos.verticalPos + 'px'
        });
    }
    //计算背景位置
    function calcBackgroundPos(ele, index, middlePos) {
        return {
            horizontalPos: -1 * ele.offsetWidth * (index % col) + middlePos.middlePosx,
            verticalPos: -1 * ele.offsetHeight * Math.floor(index / col) + middlePos.middlePosy
        };
    }
    //计算背景居中偏移量
    function calcMiddlePos(ele, imgWidth, imgHeight) {
        posx = (mask.offsetWidth - imgWidth) / 2;
        posy = (mask.offsetHeight - imgHeight) / 2;
        // posx = (ele.offsetWidth * col - imgWidth) / 2;
        // posy = (ele.offsetHeight * row - imgHeight) / 2;
        return {
            middlePosx: posx,
            middlePosy: posy
        }
    }
    function initPositionArr(len) {
        var positionsArray = [];
        for (var i = 0; i < len; i++) {
            positionsArray[i] = i;
        }
        return positionsArray;
    }
    //随机打乱数组
    function shuffle(array) {
        // return array.sort(function() {
        // 	return 0.5 - Math.random()
        // });
        for (var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
        return array;
    };
    closeBtn.onclick = function () {
        toggleClass(mask, 'hidden');
        init();
    }
})();
