(function () {
    let closeBtn = document.getElementById('close-btn');
    let mask = document.getElementById('mask');
    let prevBtn = document.getElementById('prev-btn');
    let nextBtn = document.getElementById('next-btn');
    const col = 6;//列数
    const row = 4;//行数
    const len = 24;//col*row
    let imgs = document.getElementsByTagName('img'); // 获取所有图片
    let imgList = Array.prototype.slice.call(imgs);
    let curImg;
    let down = false;
    let mDownx = 0, mDowny = 0;
    let curPos = new function () {
        this.x = [];
        this.y = [];
    }
    let all = 0;
    //添加点击事件
    imgList.forEach(img => {
        img.addEventListener('click', () => {
            curImg = img;
            toggleClass(mask, 'hidden');
            init();
            start(img);
        }, false);
    });
    // 初始化面板
    function init() {
        let kids = mask.getElementsByClassName('wall-kid'); //获取所有子块div
        if (kids.length !== 0) {
            let kidsList = Array.prototype.slice.call(kids);
            kidsList.forEach(kid => {
                mask.removeChild(kid);
            })
        }
        for (var i = 0; i < row * col; i++) {
            curPos.x[i] = 0;
            curPos.y[i] = 0;
        }
        setStyle(mask, {
            'perspective': '1000px',
            'perspective-origin': '10% 10%'
        });// 设置视距才有3D旋转的效果
        addPanel();
    }
    // 开始一块一块显示背景
    function start(img) {
        all = 0;
        let posArr = shuffle(initPositionArr(len));//打乱的数值
        let kids = mask.getElementsByClassName('wall-kid'); //获取所有子块div
        let kidsList = Array.prototype.slice.call(kids);
        kidsList.forEach((kid, i) => {
            let d = Math.random() > 0.5 ? true : false;
            if (d) {
                setStyle(kid, {
                    'transform': 'rotateY(180deg)'
                });
            } else {
                setStyle(kid, {
                    'transform': 'rotateX(180deg)'
                });
            }
            setStyle(kid)
            setTimeout(function () {
                setBackground(kid, img, i);
                if (d) {
                    setStyle(kid, {
                        'transform': 'rotateY(0)'
                    });
                } else {
                    setStyle(kid, {
                        'transform': 'rotateX(0)'
                    });
                }
                all++;
            }, posArr.shift() * 35);//把数组的第一个元素从其中删除，并返回第一个元素的值。
        });
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
        let kidWidth = Math.round(mask.offsetWidth / col);
        let kidHeight = Math.round(mask.offsetHeight / row);
        // let kidWidth = mask.offsetWidth / col; 
        // let kidHeight = mask.offsetHeight / row;// 直接这样的话,窗口改变大小时会出现中间有一条间隙的情况
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
        recordCurPos(ele, index);
    }
    // 记录元素当前的背景位置
    function recordCurPos(ele, i) {
        let bPos = ele.style['background-position'].split(/px[\s]?/);
        curPos.x[i] = parseInt(bPos[0]);
        curPos.y[i] = parseInt(bPos[1]);
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
    function prev() {
        if (all === col * row) {
            let i = findImgIndex(curImg);
            curImg = i > 0 ? imgList[i - 1] : imgList[imgList.length - 1];
            start(curImg);
        }
    }
    function next() {
        if (all === col * row) {
            let i = findImgIndex(curImg);
            curImg = i === imgList.length - 1 ? imgList[0] : imgList[i + 1];
            start(curImg);
        }
    }
    function findImgIndex(img) {
        for (var i in imgList) {
            if (imgList[i] === img) {
                return parseInt(i);
            }
        }
        return -1;
    }
    //获取鼠标在屏幕中的坐标
    function getMousePos(event) {
        var e = event || window.event;
        return {
            x: e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
            y: e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop))
        };
    }
    //获取鼠标相对于对象的坐标
    function getPosInObj(ele, screenX, screenY) {
        return {
            x: screenX - ele.offsetLeft,
            y: screenY - ele.offsetTop
        };
    }
    function calcMoveDistance() {

    }
    window.onresize = function () {
        init();
        start(curImg);
    }
    mask.addEventListener('mousedown', (event) => {
        down = true;
        let mousePosInScreen = getMousePos(event);
        let mousePosInObj = getPosInObj(mask, mousePosInScreen.x, mousePosInScreen.y);
        mDownx = mousePosInObj.x;
        mDowny = mousePosInObj.y;
    }, false);
    mask.addEventListener('mousemove', (event) => {
        if (down) {
            let mousePosInScreen = getMousePos(event);
            let mousePosInObj = getPosInObj(mask, mousePosInScreen.x, mousePosInScreen.y);
            let dx = mousePosInObj.x - mDownx;// 鼠标移动的距离x
            let dy = mousePosInObj.y - mDowny;//鼠标移动的距离y
            let kids = mask.getElementsByClassName('wall-kid'); //获取所有子块div
            let kidsList = Array.prototype.slice.call(kids);
            kidsList.forEach((kid, i) => {
                let bPosx = curPos.x[i] + dx;//移动后的背景位置x
                let bPosy = curPos.y[i] + dy;//移动后的背景位置y
                setStyle(kid, {
                    'background-position': bPosx + 'px ' + bPosy + 'px'
                });
            });
        }
    }, false);
    window.onmouseup = function () {
        down = false;
        let kids = mask.getElementsByClassName('wall-kid'); //获取所有子块div
        let kidsList = Array.prototype.slice.call(kids);
        kidsList.forEach((kid, i) => {
            recordCurPos(kid, i);//记录最终的背景位置,以防重新移动时出现背景自动偏移一段距离的情况
        });
    }
    closeBtn.onclick = function () {
        toggleClass(mask, 'hidden');
    }
    prevBtn.onclick = prev;
    nextBtn.onclick = next;
})();
