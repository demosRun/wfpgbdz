function scrollIntoView () {
  window.scrollTo(0, 0)
}

// 阻止微信拖动
// document.body.addEventListener('touchmove', function (e) {
//   e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
// }, {passive: false})


_owo.ready(function() {
  console.log('sd')
  autoScale({
    deviseW: 750,
    deviseH: 1508,
    center: 'middle',
    scroll: false,
    type: 'scale',
    box: '.scale-box'
  })
})

// canvas 各种处理

var Erase = {
  canvasEle:null,
  canvasContext:null,
  canvasBox : null,
  canvasWidth: 750,
  canvasHeight: 1508,
  radius: 10,
  scale: 1,
  speed: 15,
  touchTime: 0 ,
  init: function(el, canvasWidth, canvasHeight, imgUrl, radius, scale) {

    this.radius = radius
    this.canvasBox = el
    this.scale = scale
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.touchTime = 0
    this.createCanvas(canvasWidth, canvasHeight, imgUrl);
  },
  createElement: function (w=300, h=150) {
    var ratio = window.devicePixelRatio || 1;
    var canvas = document.createElement('canvas');
    canvas.width = w * ratio; // 实际渲染像素
    canvas.height = h * ratio; // 实际渲染像素
    canvas.style.width = `${w}px`; // 控制显示大小
    canvas.style.height = `${h}px`; // 控制显示大小
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
    return canvas;
  },
  createCanvas: function (canvasWidth, canvasHeight, imgUrl) {
    var canvasObj = this.createElement(canvasWidth, canvasHeight);
    this.canvasEle = canvasObj;
    canvasObj.setAttribute('class','bg-canvas');
    this.canvasContext = canvasObj.getContext('2d');
  
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = this.afterImageLoad.bind(this,img);
  
    this.canvasEventInit();
  },
  afterImageLoad: function(img) {
    var context = this.canvasContext;
    context.drawImage(img,0,0,this.canvasWidth,this.canvasHeight);
    context.globalCompositeOperation = "destination-out";
    this.canvasBox.appendChild(this.canvasEle);
  },

  getDeviceType: function() {
    var userAgent = navigator.userAgent.toLowerCase();
    var isIpad = userAgent.match(/ipad/i) == "ipad";
    var isIphoneOs = userAgent.match(/iphone os/i) == "iphone os";
    var isMidp = userAgent.match(/midp/i) == "midp";
    var isUc7 = userAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var isUc = userAgent.match(/ucweb/i) == "ucweb";
    var isAndroid = userAgent.match(/android/i) == "android";
    var isCE = userAgent.match(/windows ce/i) == "windows ce";
    var isWM = userAgent.match(/windows mobile/i) == "windows mobile";
    if (isIpad || isIphoneOs || isMidp || isUc7 || isUc || isAndroid || isCE || isWM) {
      return "phone";
    } else {
      return "pc";
    }
  },
  clear: function(context,width = 0,height = 0) {
    var centerX = width/2;
    var centerY = height/2;
    var maxRadius = Math.sqrt( Math.pow(centerX,2) + Math.pow(centerY,2) ) + 1;
    var radius = this.radius;
    context.beginPath();
    var count = setInterval(() => {
      if (radius>maxRadius) {
        clearInterval(count);
      }
      radius+=this.speed;
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();
    }, 10);
  },
  canvasEventInit: function() {
    var canvasWidth = this.canvasWidth;
    var canvasHeight = this.canvasHeight;
    var deviceType = this.getDeviceType();
    var isStartClear = false; // 是否开始擦出，PC 上要按一下才算开始
    var isClearAll = false; // 是否全部以清除了
    var canvasEle = this.canvasEle;
    var canvasContext = this.canvasContext;
    var _this = this
    var startEventFun = function() {
      console.info('erase start');
      isStartClear = true;
    }

    var endEventFun = function() {
      console.info('erase end');
      if (isClearAll) return;
      console.info('像素百分比：', _this.touchTime);
      if (_this.touchTime > 10) {
        _this.clear(canvasContext, canvasWidth, canvasHeight);
        isClearAll = true;
        setTimeout(() => {
          _this.canvasEle.style.display = 'none'
        }, 1200);
      }
      isStartClear = false;
    }

    var clearFun = function(event) {
      if (!isStartClear || isClearAll) return;
      //清空像素,根据当前所在点
      // console.info('event',event);

      var clearPosX = deviceType === 'phone'&&event.touches?event.touches[0].clientX:event.clientX;
      var clearPosY = deviceType === 'phone'&&event.touches?event.touches[0].clientY:event.clientY;
      var centerX = (clearPosX - canvasEle.offsetLeft) / _this.scale;
      var centerY = (clearPosY - canvasEle.offsetTop) / _this.scale;
      canvasContext.beginPath();
      canvasContext.arc(centerX, centerY, _this.radius, 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.closePath();
    }


    if (deviceType === 'phone') {
      canvasEle.ontouchstart = startEventFun;
      canvasEle.ontouchend = endEventFun;
      canvasEle.ontouchmove = function(event) {
        clearFun(event);
        _this.touchTime++
      }
    }
    if (deviceType === 'pc') {
      canvasEle.onmousedown = startEventFun;
      canvasEle.onmouseup = endEventFun;
      canvasEle.onmousemove = function (event) {
        clearFun(event);
        _this.touchTime++
      }
    }
  }
}