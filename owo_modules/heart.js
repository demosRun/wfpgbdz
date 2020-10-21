owo.tool.heart = function (dom, callBack) {
  function showHeart (e) {
    var x = e.touches ? e.touches[0].pageX : e.pageX;
    var y = e.touches ? e.touches[0].pageY: e.pageY;
    var star = document.createElement("div");
    star.innerHTML = '<svg t="1603254004309" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3063" width="36" height="36"><path d="M898.06336 422.898688H651.752448c95.439872-341.453824-65.762304-358.897664-65.762304-358.897664-68.348928 0-59.322368 51.233792-59.322368 61.068288 0 166.969344-183.118848 297.8304-183.118848 297.8304v473.546752c0 46.726144 65.767424 63.55456 91.558912 63.55456h370.107392c34.819072 0 63.192064-88.485888 63.192064-88.485888 91.565056-301.576192 91.565056-391.293952 91.565056-391.293952 0-62.301184-61.908992-57.322496-61.908992-57.322496z m-655.592448 0.151552h-147.488768c-30.473216 0-30.954496 28.975104-30.954496 28.975104l30.467072 477.595648c0 30.380032 31.435776 30.380032 31.435776 30.380032h127.671296c26.59328 0 26.35264-20.098048 26.35264-20.098048V459.283456c0-36.692992-37.48352-36.233216-37.48352-36.233216z" fill="#e9311d" p-id="3064"></path></svg>';
    var RandomSize = parseInt(Math.random() * 20 + 20);
    star.style.height = star.style.width = RandomSize + "px";
    star.style.color = "red";
    star.style.pointerEvents = 'none'
    star.style.width = RandomSize + "px";
    star.style.position = "absolute";
    x = x - (RandomSize / 2)
    y = y - (RandomSize / 2)
    star.style.left = x + "px";
    star.style.top = y + "px";
    document.body.appendChild(star);
    var op = 100;
    var deg = 0;
    var RandomX = Math.round(Math.random() * 2 + 2);
    var t = setInterval(function(){
      op--;
      deg +=5;
      star.style.top = (star.offsetTop-=RandomX) + "px";
      star.style.left = 20 * Math.sin(deg * Math.PI / 180) + x + "px";
      star.style.opacity = op / 100;
      if (star.style.opacity == 0) {
        clearInterval(t);
        star.remove();
      }
    }, 20)
    if (callBack) callBack()
  }
  if (_owo.isMobi) {
    dom.ontouchstart = showHeart
  } else {
    dom.onclick = showHeart
  }
}