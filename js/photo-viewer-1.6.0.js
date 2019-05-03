/**
 * 图片缩放工具类
 * @author      alice
 * @date        2019.05.02
 * @version     1.6
 * @require
 * jQuery1.6+ 
 */

(function($) {
    var thumbObj; //缩略图
    var photoViewModal;
    var photoViewBg;
    var photoViewToolbar;
    var photoViewNext;
    var photoViewPrev;
    var photoViewClose;
    var animateTime = 250; //动画时间
    var minScanle = 1; //适应容器大小时最小缩放倍数
    var pw = 2; //横向边距
    var ph = 44; //坚向边距
    var startObj; //创建容器开始位置,最后绝对定位时位置，转换成固定定位的位置
    var absoluteObj;
    var fixedBoj;
    var options = { "imgNaturalSize": null };
    var photoBox;
    var photo;
    var outerBox = {};
    var mouse = {}; // 鼠标当前位置
    var scope = {}; //拖动范围
    var nowScanle; //当前缩放倍数
    var loadingGif = "data:image/gif;base64,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";
    var picsLength = 0; //图片数量
    var picsIndex = 0; //图片索引
    var timer;

    $.fn.extend({
        "photoViewer": function(_options) {

            var mousePosition = { isDrag: false, x: 0, y: 0 };
            var startMove = {};
            var startXY = [];
            var endXY = [];
            var startX;
            var varstartY;
            var endX;
            var endY;
            var moveStime = 0;
            var moveEtime;
            var isMove = false;
            var boxHtml = "<div id='photo-view-modal' class='photo-view' style='display:none;'>";
            boxHtml += "<div class='photo-view-bg'></div>";
            boxHtml += "<div id='photo-view-inner-img' style='position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;' ondragstart='return false;'><img id='photo-view-pic' src='" + loadingGif + "' /><div style='background:none;background-color: rgba(0, 0, 0, 0);opacity:0;width:100%;height:100%;position:absolute;top:0;left:0;'></div></div>";
            boxHtml += "<div class='photo-view-tip' style='display: none;'><span></span></div>";
            boxHtml += "<div class='photo-view-toolbar'>";
            boxHtml += "<div class='photo-view-counter'></div>";
            boxHtml += "<div class='msg' style='color:#fff;'></div>";
            boxHtml += "<div class='photo-view-rotateL rotateL' title='rotateL'><i class='icon-photo-view icon rotateL-icon'></i></div>";
            boxHtml += "<div class='photo-view-rotateR rotateR' title='rotateR'><i class='icon-photo-view icon rotateR-icon'></i></div>";
            boxHtml += "<div class='photo-view-enlarge enlarge' title='enlarge'><div class='enlarge-icon icon-photo-view'><i class='icon-photo-view icon'></i></div></div>";
            boxHtml += "<div class='photo-view-lessen lessen' title='lessen'><div class='lessen-icon icon-photo-view'><i class='icon-photo-view icon'></i></div></div>";
            boxHtml += "<div class='photo-view-download download' title='download'><img src='' width='20' height='20'><div class='download-icon icon-photo-view'><i class='icon-photo-view icon'></i></div></div>";
            boxHtml += "<i class='icon-photo-view icon-close photo-view-button photo-view-close' title='Close'></i>";
            boxHtml += "</div>";
            boxHtml += "<i class='icon-photo-view icon-prev photo-view-button photo-view-prev' title='prev'></i>";
            boxHtml += "<i class='icon-photo-view icon-next photo-view-button photo-view-next' title='next'></i>";
            boxHtml += "</div>";

            $("body").append(boxHtml);

            photoBox = $("#photo-view-inner-img");
            photo = $("#photo-view-inner-img img");
            photoViewModal = $("#photo-view-modal");
            photoViewBg = $(".photo-view-bg");
            photoViewToolbar = $(".photo-view-toolbar");
            photoViewNext = $(".photo-view-next");
            photoViewPrev = $(".photo-view-prev");
            photoViewRotateL = $(".photo-view-rotateL");
            photoViewRotateR = $(".photo-view-rotateR");
            photoViewEnlarge = $(".photo-view-enlarge");
            photoViewLessen = $(".photo-view-lessen");
            photoViewDownload = $(".photo-view-download img");
            photoViewClose = $(".photo-view-close");

            //图片绑定点击事件
            $(this).on("click", function() {
                thumbObj = $(this);
                pics = $(this).parent().children();
                picsLength = pics.length;
                var imgUrl = $(this).attr("img-url");
                picsIndex = $(pics).index($(this));
                // 初始化配置
                if (typeof(_options) === "undefined")
                    options = defaults;
                else
                    options = $.extend({}, defaults, _options);

                loadImage(imgUrl);


            })


            //上一张
            photoViewPrev.on("click", function() {

                if (picsIndex > 0) {
                    picsIndex--;
                    imgUrl = $(pics[picsIndex]).attr("img-url");
                    loadDefaultImg();
                    loadImage(imgUrl);

                } else {
                    showTip("no more pictures");
                }

            })

            //下一张
            photoViewNext.on("click", function() {

                if (picsIndex < picsLength - 1) {
                    picsIndex++;
                    imgUrl = $(pics[picsIndex]).attr("img-url");
                    loadDefaultImg();
                    loadImage(imgUrl);

                } else {
                    showTip("no more pictures");
                }

            })
            //逆时针旋转
            photoViewRotateL.on("click", function() {
                setMouseMiddel();
                var angle0 = getAngle("photo-view-pic");
                var newAngle = angle0 - options.angle;
                if (newAngle > 180) {
                    newAngle = -180 + (newAngle - 180);
                }
                if (newAngle < -180) {
                    newAngle = 180 - (-180 - newAngle);
                }

                rotate(outerBox.width, outerBox.height, options.imgNaturalSize.width, options.imgNaturalSize.height, newAngle, function() {});
            })

            //顺时针旋转
            photoViewRotateR.on("click", function() {
                setMouseMiddel();
                var angle0 = getAngle("photo-view-pic");

                var newAngle = angle0 + options.angle;
                if (newAngle > 180) {
                    newAngle = -180 + (newAngle - 180);
                }
                if (newAngle < -180) {
                    newAngle = 180 - (-180 - newAngle);
                }

                rotate(outerBox.width, outerBox.height, options.imgNaturalSize.width, options.imgNaturalSize.height, newAngle, function() {});
            })

            //放大
            photoViewEnlarge.on("click", function() {
                setMouseMiddel();
                $(this).photo_ZoomIn();
            })
            //缩小
            photoViewLessen.on("click", function() {
                setMouseMiddel();
                $(this).photo_ZoomOut();
            })

            //关闭
            photoViewClose.on("click", function() {

                rotate(outerBox.width, outerBox.height, options.imgNaturalSize.width, options.imgNaturalSize.height, 0, function() {});
                photoViewToolbar.hide();
                photoViewNext.hide();
                photoViewPrev.hide();
                photoViewBg.animate({ "opacity": 0 }, animateTime / 2);
                photoBox.animate({ "width": startObj.width, "height": startObj.height, "top": 0, "left": 0 }, animateTime);
                photo.animate({ "width": startObj.width, "height": startObj.height, "top": 0, "left": 0 }, animateTime);
                photoViewModal.css(absoluteObj).animate(startObj, animateTime, function() {
                    photoViewModal.hide();
                    outerBox = {};
                    scope = {};
                });


            })


            // 初始化鼠标滚动监听器
            $(photoViewModal, photoBox).on('mousewheel', function(event, delta) {
                event.preventDefault();
                if (delta > 0)
                    photoBox.photo_ZoomIn();
                else
                    photoBox.photo_ZoomOut();
                return false;
            });
            // 初始化拖动监听器
            photoBox.on("mousedown", function(e) {
                e.preventDefault();
                window.clearInterval(timer);
                var offset = $(this).offset();
                mousePosition.x = -offset.left + e.pageX;
                mousePosition.y = -offset.top + e.pageY;
                mousePosition.isDrag = true;
                e.stopPropagation();


            });

            photoBox.mouseup(function(e) {
                e.preventDefault();
                var offset = photoBox.offset();
                moveEtime = new Date().getTime();
                if (moveEtime - moveStime < 200) {
                    cMove(offset, startMove, e, moveStime, moveEtime);
                } else {
                    fMove(offset);
                }
                moveStime = 0;
                isMove = false;
                mousePosition.isDrag = false;
            });
            photoBox.mouseleave(function(e) {
                e.preventDefault();
                var offset = photoBox.offset();
                moveEtime = new Date().getTime();
                if (moveEtime - moveStime < 200) {
                    cMove(offset, startMove, e, moveStime, moveEtime);
                } else {
                    fMove(offset);
                }
                moveStime = 0;
                isMove = false;
                mousePosition.isDrag = false;
            });
            photoBox.mousemove(function(e) {
                e.preventDefault();
                var oft = getOffset(e.pageX - mousePosition.x, e.pageY - mousePosition.y, 0.3);
                if (mousePosition.isDrag) {
                    if (!moveStime) {
                        moveStime = new Date().getTime(); //开始移动的时间点
                        startMove.pageX = e.pageX;
                        startMove.pageY = e.pageY;
                    }
                    isMove = true;
                    $(this).photo_reOffset(oft.left, oft.top);
                }

                mouse.x = e.pageX;
                mouse.y = e.pageY;


            });

            //mobile
            photoBox.on("touchstart", function(e) {
                e.preventDefault();
                window.clearInterval(timer);
                var offset = $(this).offset();

                //初始两点
                startXY = e.originalEvent.targetTouches;
                fingers = e.originalEvent.touches.length; // 屏幕上手指数量

                mousePosition.x = -offset.left + startXY[0].pageX;
                mousePosition.y = -offset.top + startXY[0].pageY;
                mousePosition.isDrag = true;

            });
            photoBox.on("touchend", function(e) {
                e.preventDefault();
                var offset = photoBox.offset();
                moveEtime = new Date().getTime();
                fingers = e.originalEvent.touches.length;
                if (endXY[0]) {
                    if (moveStime > 0) {
                        if (moveEtime - moveStime < 300) {
                            cMove(offset, startXY[0], endXY[0], moveStime, moveEtime);
                        } else {
                            fMove(offset);
                        }
                    }
                }
                moveStime = 0;
                mousePosition.isDrag = false;
                photoBox.curWidth = photoBox.widthing;
                photoBox.curHeight = photoBox.heighting;
                photo.curWidth = photo.widthing;
                photo.curHeight = photo.heighting;
                //更改头部菜单状态,手指都离开时再判断    
                if (fingers == 0) {
                    if (isMove == false) {
                        if (photoViewToolbar.is(":visible")) {
                            photoViewToolbar.fadeOut(200);
                        } else {
                            photoViewToolbar.fadeIn(200);
                        }
                    }

                    isMove = false;
                }


            });

            photoBox.on("touchcancel", function(e) {
                e.preventDefault();

            });
            photoViewModal.on("touchmove", function(e) {
                e.preventDefault();
            })
            photoBox.on("touchmove", function(e) {
                e.preventDefault();
                endXY = e.originalEvent.targetTouches;
                fingers = e.originalEvent.touches.length; // 屏幕上手指数量       

                if (fingers == 2) {

                    //缩放比例
                    var scanle = ($(this).photo_getDistance(endXY[0], endXY[1])) / ($(this).photo_getDistance(startXY[0], startXY[1]));
                    //设光标位置为两手指之间
                    mouse.x = (startXY[0].pageX + startXY[1].pageX) / 2;
                    mouse.y = (startXY[0].pageY + startXY[1].pageY) / 2;

                    if (scanle > 1) {
                        //放大
                        $(this).photo_ZoomInMobile(scanle);

                    } else if (scanle == 1) {
                        //不变

                    } else {
                        //缩小
                        $(this).photo_ZoomOutMobile(scanle);
                    }

                    moveStime = 0;
                    isMove = true;
                }

                if (fingers == 1 && mousePosition.isDrag) {
                    if (!moveStime) {
                        moveStime = new Date().getTime(); //开始移动的时间点

                    }
                    var oft = getOffset(endXY[0].pageX - mousePosition.x, endXY[0].pageY - mousePosition.y, 0.3);
                    $(this).photo_reOffset(oft.left, oft.top);
                    isMove = true;

                }


            });


        },


        // 显示图片索引与图片数
        "photo_showCounter": function(index, length) {
            $(".photo-view-counter").html((index + 1) + " / " + length);
        },

        //移动端放大
        "photo_ZoomInMobile": function(scanle) {
            var offset0 = photoBox.offset();
            var h0 = photoBox.height();
            var w0 = photoBox.width();
            var photoBoxH0 = photoBox.curHeight;
            var photoBoxW0 = photoBox.curWidth;

            var picH0 = photo.curHeight;
            var picW0 = photo.curWidth;

            //父级容器
            var photoBoxH = photoBoxH0 * scanle;
            var photoBoxW = photoBoxW0 * scanle;
            //图片
            var picH = picH0 * scanle;
            var picW = picW0 * scanle;

            nowScanle = photoBoxW / photoBox.naturalWidth;
            nowScanle = nowScanle.toFixed(3);
            if (nowScanle > 10) {
                nowScanle = 10;
                photoBoxH = photoBox.naturalHeight * 10;
                photoBoxW = photoBox.naturalWidth * 10;

                picH = options.imgNaturalSize.height * 10;
                picW = options.imgNaturalSize.width * 10;
            }

            photoBoxH = photoBoxH.toFixed(2);
            photoBoxW = photoBoxW.toFixed(2);
            picH = picH.toFixed(2);
            picW = picW.toFixed(2);

            photoBox.css({ "height": photoBoxH, "width": photoBoxW });
            photo.css({ "height": picH, "width": picW, "left": (photoBoxW - picW) / 2, "top": (photoBoxH - picH) / 2 });
            photoBox.widthing = photoBoxW;
            photoBox.heighting = photoBoxH;
            photo.widthing = picW;
            photo.heighting = picH;

            initScope();
            showTip((nowScanle * 100).toFixed(0) + "%");

            var newXY = getZoomOffset(offset0, h0, w0);
            $(this).photo_reOffset(parseInt(newXY.left), parseInt(newXY.top));


        },

        //移动端缩小
        "photo_ZoomOutMobile": function(scanle) {
            var offset0 = photoBox.offset();
            var h0 = photoBox.height();
            var w0 = photoBox.width();
            var photoBoxH0 = photoBox.curHeight;
            var photoBoxW0 = photoBox.curWidth;
            var picH0 = photo.curHeight;
            var picW0 = photo.curWidth;
            //父级容器
            var photoBoxH = photoBoxH0 * scanle;
            var photoBoxW = photoBoxW0 * scanle;
            //图片
            var picH = picH0 * scanle;
            var picW = picW0 * scanle;

            nowScanle = photoBoxW / photoBox.naturalWidth;

            if (minScanle >= 1) {
                if (nowScanle <= 1) {
                    nowScanle = 1;
                    photoBoxH = photoBox.naturalHeight * 1;
                    photoBoxW = photoBox.naturalWidth * 1;
                    picH = options.imgNaturalSize.height * 1;
                    picW = options.imgNaturalSize.width * 1;

                }

            } else {
                if (nowScanle <= minScanle) {
                    nowScanle = minScanle;
                    photoBoxH = photoBox.naturalHeight * minScanle;
                    photoBoxW = photoBox.naturalWidth * minScanle;
                    picH = options.imgNaturalSize.height * minScanle;
                    picW = options.imgNaturalSize.width * minScanle;

                }

            }
            photoBoxH = photoBoxH.toFixed(2);
            photoBoxW = photoBoxW.toFixed(2);
            picH = picH.toFixed(2);
            picW = picW.toFixed(2);

            photoBox.css({ "height": photoBoxH, "width": photoBoxW });
            photo.css({ "height": picH, "width": picW, "left": (photoBoxW - picW) / 2, "top": (photoBoxH - picH) / 2 });
            photoBox.widthing = photoBoxW;
            photoBox.heighting = photoBoxH;
            photo.widthing = picW;
            photo.heighting = picH;

            initScope();
            showTip((nowScanle * 100).toFixed(0) + "%");
            var newXY = getZoomOffset(offset0, h0, w0);
            $(this).photo_reOffset(newXY.left, newXY.top);


        },


        //两点距离
        "photo_getDistance": function(p1, p2) {
            var x = p2.pageX - p1.pageX,
                y = p2.pageY - p1.pageY;
            return Math.sqrt((x * x) + (y * y));
        },

        // 图片放大,最大只能为原始图片的10倍
        "photo_ZoomIn": function() {

            var offset0 = photoBox.offset();
            var h0 = photoBox.height();
            var w0 = photoBox.width();
            var photoBoxH0 = photoBox.curHeight;
            var photoBoxW0 = photoBox.curWidth;

            var picH0 = photo.curHeight;
            var picW0 = photo.curWidth;
            //父级容器
            var photoBoxH = photoBoxH0 * (1 + options.rate);
            var photoBoxW = photoBoxW0 * (1 + options.rate);
            //图片
            var picH = picH0 * (1 + options.rate);
            var picW = picW0 * (1 + options.rate);

            nowScanle = photoBoxW / photoBox.naturalWidth;
            if (nowScanle > 10) {
                nowScanle = 10;
                photoBoxH = photoBox.naturalHeight * 10;
                photoBoxW = photoBox.naturalWidth * 10;

                picH = options.imgNaturalSize.height * 10;
                picW = options.imgNaturalSize.width * 10;
            }

            photoBoxH = photoBoxH.toFixed(2);
            photoBoxW = photoBoxW.toFixed(2);
            picH = picH.toFixed(2);
            picW = picW.toFixed(2);

            photoBox.css({ "height": photoBoxH, "width": photoBoxW });
            photo.css({ "height": picH, "width": picW, "left": (photoBoxW - picW) / 2, "top": (photoBoxH - picH) / 2 });
            photoBox.widthing = photoBoxW;
            photoBox.heighting = photoBoxH;
            photoBox.curWidth = photoBoxW;
            photoBox.curHeight = photoBoxH;
            photo.widthing = picW;
            photo.heighting = picH;
            photo.curWidth = picW;
            photo.curHeight = picH;
            initScope();
            showTip((nowScanle * 100).toFixed(0) + "%");

            var newXY = getZoomOffset(offset0, h0, w0);
            $(this).photo_reOffset(newXY.left, newXY.top);

        },



        // 图片缩小
        "photo_ZoomOut": function() {

            var offset0 = photoBox.offset();
            var h0 = photoBox.height();
            var w0 = photoBox.width();
            var photoBoxH0 = photoBox.curHeight;
            var photoBoxW0 = photoBox.curWidth;
            var picH0 = photo.curHeight;
            var picW0 = photo.curWidth;

            //父级容器
            var photoBoxH = photoBoxH0 * (1 - options.rate);
            var photoBoxW = photoBoxW0 * (1 - options.rate);
            //图片
            var picH = picH0 * (1 - options.rate);
            var picW = picW0 * (1 - options.rate);

            nowScanle = photoBoxW / photoBox.naturalWidth;

            if (minScanle > 0.1) {
                if (nowScanle <= 0.1) {
                    photoBoxH = photoBox.naturalHeight * 0.1;
                    photoBoxW = photoBox.naturalWidth * 0.1;
                    picH = options.imgNaturalSize.height * 0.1;
                    picW = options.imgNaturalSize.width * 0.1;
                    nowScanle = 0.1;

                }

            } else {
                if (nowScanle <= minScanle) {
                    photoBoxH = photoBox.naturalHeight * minScanle;
                    photoBoxW = photoBox.naturalWidth * minScanle;
                    picH = options.imgNaturalSize.height * 0.1;
                    picW = options.imgNaturalSize.width * 0.1;
                    nowScanle = minScanle;
                }

            }

            photoBoxH = photoBoxH.toFixed(2);
            photoBoxW = photoBoxW.toFixed(2);
            picH = picH.toFixed(2);
            picW = picW.toFixed(2);

            photoBox.css({ "height": photoBoxH, "width": photoBoxW });
            photo.css({ "height": picH, "width": picW, "left": (photoBoxW - picW) / 2, "top": (photoBoxH - picH) / 2 });
            photoBox.widthing = photoBoxW;
            photoBox.heighting = photoBoxH;
            photoBox.curWidth = photoBoxW;
            photoBox.curHeight = photoBoxH;

            photo.widthing = picW;
            photo.heighting = picH;
            photo.curWidth = picW;
            photo.curHeight = picH;
            initScope();

            showTip((nowScanle * 100).toFixed(0) + "%");
            var newXY = getZoomOffset(offset0, h0, w0);
            $(this).photo_reOffset(newXY.left, newXY.top);


        },
        // 图片拖动
        // x>0向右移动，y>0向下移动
        "photo_reOffset": function(x, y) {
            photoBox.offset({ "left": x, "top": y });

        },



    });

    /**
     * 匀减速运动
     * @param offset 物体原来位置
     * @param xy1 开始移动时的座标
     * @param xy2 鼠标或手指离开时的座标
     * @param time1 开始移动的时间
     * @param time2 鼠标或手指离开时的时间
     */
    var cMove = function(offset, xy1, xy2, time1, time2, T0) {
        var dx = xy2.pageX - xy1.pageX;
        var dy = xy2.pageY - xy1.pageY;
        //x轴和Y轴移动的距离,默认给一个小数,保证分母不为0
        dx = (dx != 0) ? dx : 0.1;
        dy = (dy != 0) ? dy : 0.1;
        var sbli = Math.abs(dx / dy).toFixed(2);

        //初始速度
        var v0 = $(this).photo_getDistance(xy1, xy2) / (time2 - time1);
        var a = 0.01; //加速度
        // S= v0*t-a*t*t/2;//位移公式
        var t = parseInt(v0 / a);
        var S = v0 * (v0 / a) - a * (v0 / a) * (v0 / a) / 2;

        var T0 = T0 ? T0 : 5;
        var t2 = T0;
        var s1;

        var countTime = function() {

            if (t2 > t) {
                t2 = t;
                s1 = v0 * t2 - a * t2 * t2 / 2;
                window.clearInterval(timer);

            } else {
                s1 = (v0 * t2 - a * t2 * t2 / 2).toFixed(1);

                //s1*s1=(sbli*y1)*(sbli*y1)+y1*y1;
                //s1*s1 = (y1*y1)*((sbli*sbli)+1)
                var y1 = Math.sqrt((s1 * s1) / ((sbli * sbli) + 1)).toFixed(1);
                var x1 = (sbli * y1).toFixed(1);

                var newX, newY;
                newX = (dx < 0) ? -x1 : x1
                newY = (dy < 0) ? -y1 : y1

                var currentX = Number(offset.left) + Number(newX);
                var currentY = Number(offset.top) + Number(newY);

                var oft = getOffset(currentX, currentY);

                $(this).photo_reOffset(oft.left, oft.top);

                t2 = t2 + T0;
            }
        };
        timer = window.setInterval(countTime, T0);
    }

    /**
     * 弹性返回
     * @param offset 物体原来位置
     */
    var fMove = function(offset) {
        var bTop, bLeft;
        var sc = getWinSize();
        if (scope.min_X != scope.max_X) {
            if (offset.left < scope.min_X) {
                bLeft = -(photoBox.width() - outerBox.width) - pw;

            } else if (offset.left > scope.max_X) {

                bLeft = pw;
            } else {
                bLeft = photoBox.css("left");
            }
        }

        if (scope.min_Y != scope.max_Y) {
            if (offset.top < scope.min_Y) {

                bTop = -(photoBox.height() - outerBox.height) - ph;
            } else if (offset.top > scope.max_Y) {

                bTop = ph;

            } else {
                bTop = photoBox.css("top");
            }
        }

        photoBox.animate({ "left": bLeft, "top": bTop }, 200);
    }


    var loadDefaultImg = function() {
        photo.attr("src", "");
        photo.removeAttr("style").css({ "position": "absolute", "top": "0", "left": "0", "right": "0", "bottom": "0", "margin": "auto" });
        photo.attr("src", loadingGif);
    }

    //显示提示信息
    var showTip = function(con) {
        photoViewModal.find(".photo-view-tip").remove();
        $("<div class='photo-view-tip'><span>" + con + "</span></div>").appendTo(photoViewModal).fadeOut(1200);
    }
    //显示提示信息
    var showMsg = function(con) {
        $(".msg").find(".msg-tip").remove();
        $("<div class='msg-tip'><span>" + con + "</span></div>").appendTo($(".msg")).fadeOut(1000);
    }


    /**
     * 获取原来旋转角度
     * @param select 图片
     * @return angle
     */
    var getAngle = function(select) {
        var el = document.getElementById(select);
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "FAIL";
        // With rotate(30deg)...
        // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
        //console.log('Matrix: ' + tr);
        // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix
        var values = tr.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];
        var scale = Math.sqrt(a * a + b * b);
        //console.log('Scale: ' + scale);
        // arc sin, convert from radians to degrees, round
        var sin = b / scale;
        // next line works for 30deg but not 130deg (returns 50);
        // var angle = Math.round(Math.asin(sin) * (180/Math.PI));
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        return parseInt(angle);

    }

    /**
     * 获取图片所占空间大小
     * @param objWidth 图片宽度
     * @param objHeight 图片高度
     * @param angle 旋转角度
     * @return obj
     */
    var getRotateHW = function(objWidth, objHeight, angle) {
        var rotateAngle = parseInt(angle);
        var r = Math.sqrt((objWidth * objWidth) + (objHeight * objHeight)) / 2;
        var h = objHeight / 2;
        var w = objWidth / 2;
        var wBh = (objWidth / objHeight).toFixed(4);

        var curHalfWidth; //旋转后半宽
        var curHalfHeight; //旋转后半高


        //顶点1
        var sin1 = h / r;
        var hudu1 = Math.asin(sin1); //初始弧度
        var jiaodu1 = hudu1 * 180 / Math.PI; //初始角度
        var newJiaodu1 = (jiaodu1 + rotateAngle) % 180; //旋转后的夹角 
        var newHudu1 = (newJiaodu1 * Math.PI / 180).toFixed(4);


        //顶点2
        var sin2 = w / r;
        var hudu2 = Math.asin(sin2); //初始弧度
        var jiaodu2 = hudu2 * 180 / Math.PI; //初始角度
        var newJiaodu2 = (jiaodu2 + rotateAngle) % 180; //旋转后的夹角
        var newHudu2 = (newJiaodu2 * Math.PI / 180).toFixed(4);


        if ((0 <= rotateAngle && rotateAngle <= 90) || (-180 <= rotateAngle && rotateAngle <= -90)) {

            var aH1 = (r * Math.sin(newHudu1)).toFixed(2);
            var bH1 = (r * Math.sin(newHudu2)).toFixed(2);
            curHalfHeight = Math.abs(aH1);
            curHalfWidth = Math.abs(bH1);

        } else {
            var aH2 = (r * Math.cos(newHudu1)).toFixed(2);
            var bH2 = (r * Math.cos(newHudu2)).toFixed(2);
            curHalfHeight = Math.abs(bH2);
            curHalfWidth = Math.abs(aH2);

        }


        return { "halfHeight": curHalfHeight, "halfWidth": curHalfWidth, "wBh": wBh, "newHudu1": newHudu1, "newHudu2": newHudu2 };


    }

    /**
     * 旋转
     * @param boxWidth 容器宽度
     * @param boxHeight 容器高度
     * @param objWidth 图片宽度
     * @param objHeight 图片高度
     * @param angle 旋转角度
     */
    var rotate = function(boxWidth, boxHeight, picWidth, picHeight, angle, callback) {
        var boxHalfHeight = boxHeight / 2;
        var boxHalfWidth = boxWidth / 2;

        var o = getRotateHW(picWidth, picHeight, angle);
        var photoW = picWidth; //旋转后图片宽度
        var photoH = picHeight; //旋转后图片高度

        if (o.halfHeight > boxHalfHeight || o.halfWidth > boxHalfWidth) {

            //顶点1
            var pointA_r1 = Math.abs(boxHalfHeight / Math.sin(o.newHudu1)); //保证高度时所需的半径
            var pointA_r2 = Math.abs(boxHalfWidth / Math.cos(o.newHudu1)); //保证宽度时所需的半径
            var newR1 = pointA_r1 < pointA_r2 ? pointA_r1 : pointA_r2;
            //顶点2
            var pointB_r1 = Math.abs(boxHalfWidth / Math.sin(o.newHudu2)); //保证宽度时所需的半径
            var pointB_r2 = Math.abs(boxHalfHeight / Math.cos(o.newHudu2)); //保证高度时所需的半径
            var newR2 = pointB_r1 < pointB_r2 ? pointB_r1 : pointB_r2;
            //取最小半径
            var newR = newR1 < newR2 ? newR1 : newR2;


            // h2*h2+w2*w2=newR*newR;
            //h2*h2+wBh*h2*wBh*h2 =newR*newR; 
            //h2*h2(1+wBh*wBh) = newR*newR;
            //h2*h2 = newR*newR/(1+wBh*wBh);
            photoH = parseInt(Math.sqrt(newR * newR / (1 + o.wBh * o.wBh)) * 2);
            photoW = parseInt(o.wBh * photoH);

        }


        var nleft = (boxWidth - photoW) / 2;
        var ntop = (boxHeight - photoH) / 2;

        photo.css({ "width": photoW, "height": photoH, "position": "absolute", "transform": "rotate(" + angle + "deg)" });

        //图片所占大小就是父容器大小
        var photoBoxW = (photo.width()).toFixed(2);
        var photoBoxH = (photo.height()).toFixed(2);

        photoBox.css({ "width": photoBoxW, "height": photoBoxH, "left": (boxWidth - photoBoxW) / 2, "top": (boxHeight - photoBoxH) / 2 });
        photo.css({ "left": (photoBoxW - photoW) / 2, "top": (photoBoxH - photoH) / 2 });
        photoBox.curWidth = photoBoxW;
        photoBox.curHeight = photoBoxH;
        photo.curWidth = photoW;
        photo.curHeight = photoH;

        //每次旋转后求出图片自然大小旋转到这个角度后所占的平面大小,缩放界限(10倍或1/10)以这个为参照
        photoBox.naturalWidth = o.halfWidth * 2;
        photoBox.naturalHeight = o.halfHeight * 2;
        var winSize = getWinSize();
        if (winSize.width > 720) {
            var bw = photoBox.naturalWidth / (winSize.width - pw * 2),
                bh = photoBox.naturalHeight / (winSize.height - ph * 2);
            if (bw > 1 || bh > 1) {
                minScanle = (bw >= bh) ? (1 / bw) : (1 / bh);
            } else {
                minScanle = 1;
            }


        } else {
            var bw = photoBox.naturalWidth / (winSize.width),
                bh = photoBox.naturalHeight / (winSize.height);

            if (bw > 1 || bh > 1) {
                minScanle = (bw >= bh) ? (1 / bw) : (1 / bh);
            } else {
                minScanle = 1;
            }

        }
        minScanle.toFixed(4);

        initScope();
        //callback({ "halfH": currentH, "halfH": currentH, "halfH": currentH, "halfH": currentH });
    }




    /**
     * 设置图片移动范围
     */
    var initScope = function() {

        var sc = getWinSize();
        if (typeof(outerBox.width) != "undefined") {
            var canmoveW = photoBox.width() - outerBox.width,
                canmoveH = photoBox.height() - (outerBox.height);

            if (canmoveW >= 0) {
                scope.min_X = -canmoveW - pw + outerBox.left + sc.scrollLeft;
                scope.max_X = outerBox.left + pw + sc.scrollLeft;
            } else if (canmoveW >= -pw * 2 && canmoveW < 0) {
                scope.min_X = -canmoveW - pw + outerBox.left + sc.scrollLeft;
                scope.max_X = pw + outerBox.left + sc.scrollLeft;
            } else {
                scope.min_X = -canmoveW / 2 + outerBox.left + sc.scrollLeft;
                scope.max_X = scope.min_X;
            }
            if (canmoveH >= 0) {
                scope.min_Y = -canmoveH - ph + outerBox.top + sc.scrollTop;
                scope.max_Y = outerBox.top + ph + sc.scrollTop;
            } else if (canmoveH >= -ph * 2 && canmoveH < 0) {
                scope.min_Y = -canmoveH - ph + outerBox.top + sc.scrollTop;
                scope.max_Y = ph + outerBox.top + sc.scrollTop;
            } else {
                scope.min_Y = -canmoveH / 2 + outerBox.top + sc.scrollTop;
                scope.max_Y = scope.min_Y;
            }

        }

    }

    /*
     * 缩小时设置图片的座标
     * @param offset 缩放前图片偏移量
     * @param h 缩放前图片高度
     * @param w 缩放前图片宽度
     */
    var getZoomOffset = function(offset, h, w) {
        var sc = getWinSize();
        var left, top;
        if (photoBox.width() > outerBox.width - pw * 2) {
            left = parseInt((mouse.x - photoBox.width() * (mouse.x - offset.left) / w));

            if (left < scope.min_X) {
                left = scope.min_X;
            }
            if (left > scope.max_X) {
                left = scope.max_X;
            }

        } else {
            left = -(photoBox.width() - outerBox.width) / 2 + outerBox.left + sc.scrollLeft;
        }

        if (photoBox.height() > outerBox.height - ph * 2) {
            top = (mouse.y - photoBox.height() * (mouse.y - offset.top) / h);

            if (top < scope.min_Y) {
                top = scope.min_Y;
            }
            if (top > scope.max_Y) {
                top = scope.max_Y;
            }

        } else {
            top = -(photoBox.height() - outerBox.height) / 2 + outerBox.top + sc.scrollTop;
        }

        return { "left": parseInt(left), "top": parseInt(top) };

    }

    /**
     * 拖动时设置图片的座标
     * @param currentX 当前图片X轴
     * @param currentY 当前图片Y轴
     * @param extMax 超出拖动范围的倍数
     */
    var getOffset = function(currentX, currentY, extMax) {
        var extMax = extMax || 0;
        var rx = currentX;
        var ry = currentY;
        var oftX, oftY;

        oftX = rx;
        if (scope.min_X < scope.max_X) {
            if (rx < scope.min_X) {
                oftX = scope.min_X - (scope.min_X - rx) * extMax;
            }
            if (rx > scope.max_X) {
                oftX = scope.max_X + (rx - scope.max_X) * extMax;
            }
        } else {

            oftX = photoBox.offset().left;
        }

        oftY = ry;
        if (scope.min_Y < scope.max_Y) {
            if (ry < scope.min_Y) {
                oftY = scope.min_Y - (scope.min_Y - ry) * extMax;
            }
            if (ry > scope.max_Y) {
                oftY = scope.max_Y + (ry - scope.max_Y) * extMax;
            }
        } else {

            oftY = photoBox.offset().top;
        }
        oftX = oftX.toFixed(1);
        oftY = oftY.toFixed(1);

        return ({ left: oftX, top: oftY });
    }

    /**
     * 异步获取图片大小，需要等待图片加载完后才能判断图片实际大小
     * @param img
     * @param fn        {width:rw, height:rh}
     */
    var getImageSize = function(url, fn) {
        var img = new Image();
        img.src = url;
        img.onload = function() {
            fn(_getImageSize(img));
        }

    };

    /**
     * 获取图片大小的子方法
     * @param img
     * @private
     */
    var _getImageSize = function(img) {
        if (typeof img.naturalWidth === "undefined") {
            var rw = img.width;
            var rh = img.height;
        } else {
            var rw = img.naturalWidth;
            var rh = img.naturalHeight;
        }

        return { width: rw, height: rh };
    }

    /**
     * 加载图片
     * @param src
     */
    var loadImage = function(src) {
        var winSize = getWinSize();
        photoViewDownload.attr("src", src);
        getImageSize(src, function(size) {
            options.imgNaturalSize = size;
            //图片大小即父容器大小
            photoBox.naturalWidth = size.width;
            photoBox.naturalHeight = size.height;
            var visible = photoViewModal.is(":visible");

            if (visible == false) {

                photoBox.removeAttr("style");
                photo.removeAttr("style");

                if ((thumbObj[0].tagName).toLowerCase() != 'img') {
                    thumbObj = thumbObj.children();

                }
                var start = {
                    width: parseInt(thumbObj.attr("width")) || parseInt(thumbObj.css("width")),
                    height: parseInt(thumbObj.attr("height")) || parseInt(thumbObj.css("height")),
                    display: "block",
                    position: "absolute",
                    top: thumbObj.offset().top,
                    left: thumbObj.offset().left,
                }

                startObj = start;
                photoBox.css({ "width": start.width, "height": start.height });
                photo.css({ "width": start.width, "height": start.height });
                photo.attr("src", src);

                photoViewModal.css(start);

                var el = initBoxView(photoViewModal, options.imgNaturalSize, winSize);

                photoViewModal.animate(el.modalBox.absolute, animateTime, function() {
                    photoViewModal.css(el.modalBox.fixed);
                    photoViewToolbar.show();
                    if (picsIndex < picsLength - 1) {
                        photoViewNext.show();
                    } else {
                        photoViewNext.hide();
                    }
                    if (picsIndex > 0) {
                        photoViewPrev.show();
                    } else {
                        photoViewPrev.hide();
                    }

                    $(this).photo_showCounter(picsIndex, picsLength);
                })

                $(".photo-view-bg").animate({ "opacity": 1 }, animateTime);
                photo.animate(el.img, animateTime, function() {});
                photoBox.animate(el.imgBox, animateTime, function() {

                    photoBox.curWidth = el.imgBox.width;
                    photoBox.curHeight = el.imgBox.height;
                });


            } else {

                photoBox.removeAttr("style");
                photo.removeAttr("style");
                var el = initBoxView(photoViewModal, options.imgNaturalSize, winSize);

                photoViewModal.css(el.modalBox.fixed);

                if (picsIndex < picsLength - 1) {
                    photoViewNext.show();
                } else {
                    photoViewNext.hide();
                }
                if (picsIndex > 0) {
                    photoViewPrev.show();
                } else {
                    photoViewPrev.hide();
                }

                photoBox.css(el.imgBox);

                photoBox.curWidth = el.imgBox.width;
                photoBox.curHeight = el.imgBox.height;
                photo.css(el.img);
                photo.attr("src", src);
                $(this).photo_showCounter(picsIndex, picsLength);


            }


        });
    };

    /**
     * 获取最终图片和容器大小
     * @paran selector 容器
     * @paran imgSize 图片大小
     * @paran winSize 可视区域大小
     * @paran angle 图片旋转角度
     * @paran isResize 是否是窗口变化
     * @return obj
     */
    function initBoxView(selector, imgSize, winSize, angle, isResize) {
        var angle = angle || 0;
        var isResize = isResize || 0;

        var picWidth = imgSize.width;
        var picHeight = imgSize.height;
        var picBoxWidth = imgSize.width;
        var picBoxHeight = imgSize.height;
        if (angle != 0) {
            var o = getRotateHW(picWidth, picHeight, angle);
            picBoxWidth = o.halfWidth * 2;
            picBoxHeight = o.halfHeight * 2;
        }


        if (winSize.width > 720) {
            var bw = picBoxWidth / (winSize.width - pw * 2),
                bh = picBoxHeight / (winSize.height - ph * 2);

            if (bw > 1 || bh > 1) {
                minScanle = (bw >= bh) ? (1 / bw) : (1 / bh);
            } else {
                minScanle = 1;
            }
            minScanle.toFixed(4);
            var imgWidth = parseInt(picWidth * minScanle);
            var imgHeight = parseInt(picHeight * minScanle);
            var imgBoxWidth = parseInt(picBoxWidth * minScanle);
            var imgBoxHeight = parseInt(picBoxHeight * minScanle);
            var modalBoxWidth = imgBoxWidth + pw * 2;
            var modalBoxHeight = imgBoxHeight + ph * 2;

        } else {
            var bw = picBoxWidth / (winSize.width),
                bh = picBoxHeight / (winSize.height);

            if (bw > 1 || bh > 1) {
                minScanle = (bw >= bh) ? (1 / bw) : (1 / bh);
            } else {
                minScanle = 1;
            }
            minScanle.toFixed(4);

            var imgWidth = parseInt(picWidth * minScanle);
            var imgHeight = parseInt(picHeight * minScanle);
            var imgBoxWidth = parseInt(picBoxWidth * minScanle);
            var imgBoxHeight = parseInt(picBoxHeight * minScanle);
            var modalBoxWidth = winSize.width;
            var modalBoxHeight = winSize.height;

        }


        if (!isResize) {
            //容器只能由小到大
            if (outerBox.width > modalBoxWidth) {
                modalBoxWidth = outerBox.width;
            }
            if (outerBox.height > modalBoxHeight) {
                modalBoxHeight = outerBox.height;
            }
        }

        var imgBoxTop = (modalBoxHeight - imgBoxHeight) / 2;
        var imgBoxLeft = (modalBoxWidth - imgBoxWidth) / 2;

        var img = {};
        var imgBox = {};
        var modalBox = {};

        modalBox.width = modalBoxWidth;
        modalBox.height = modalBoxHeight;

        imgBox.width = imgBoxWidth;
        imgBox.height = imgBoxHeight;
        imgBox.top = imgBoxTop;
        imgBox.left = imgBoxLeft;

        img.width = imgWidth;
        img.height = imgHeight;
        img.top = (imgBoxHeight - imgHeight) / 2;
        img.left = (imgBoxWidth - imgWidth) / 2;

        var y = (winSize.height - modalBoxHeight) / 2,
            x = (winSize.width - modalBoxWidth) / 2;

        var nTop = y + parseInt(winSize.scrollTop),
            nLeft = x + winSize.scrollLeft;
        //box ->absolute
        modalBox.absolute = {
            "width": modalBoxWidth,
            "height": modalBoxHeight,
            "position": "absolute",
            "left": nLeft,
            "top": nTop < winSize.scrollTop ? winSize.scrollTop : nTop,
            "z-index": 10000,

        }
        //box ->fixed
        modalBox.fixed = {
            "width": modalBoxWidth,
            "height": modalBoxHeight,
            "position": "fixed",
            "left": x,
            "top": y,
            "z-index": 10000,

        }

        photo.curWidth = img.width;
        photo.curHeight = img.height;
        outerBox.width = modalBox.width;
        outerBox.height = modalBox.height;
        outerBox.top = modalBox.fixed.top;
        outerBox.left = modalBox.fixed.left;
        //初始光标为容器中间点
        mouse.x = modalBox.width / 2 + modalBox.fixed.left + winSize.scrollLeft;
        mouse.y = modalBox.height / 2 + modalBox.fixed.top + winSize.scrollTop;
        initScope();
        absoluteObj = modalBox.absolute;
        fixedObj = modalBox.fixed;
        return { "img": img, "imgBox": imgBox, "modalBox": modalBox };

    }


    /**
     * 获取屏幕大小
     * @return obj
     */
    var getWinSize = function() {
        var w = document.documentElement.clientWidth || document.body.clientWidth,
            h = document.documentElement.clientHeight || document.body.clientHeight;
        var size = {
            width: w,
            height: h,
            scrollTop: $(window).scrollTop(),
            scrollLeft: $(window).scrollLeft()
        }
        return size;
    }

    var getElementSize = function(selector) {
        return {
            width: $(selector).width(),
            height: $(selector).height()
        }
    }
    /**
     * 设置光标为中间点
     */
    var setMouseMiddel = function() {
        var winSize = getWinSize();
        //光标为容器中间点
        mouse.x = outerBox.width / 2 + outerBox.left + winSize.scrollLeft;
        mouse.y = outerBox.height / 2 + outerBox.top + winSize.scrollTop;

    }

    /**
     * 默认缩放倍数
     */
    var defaults = {
        rate: 0.2,
        angle: 30,
    }

    /**
     * 监听滚动条
     */
    window.onscroll = function() {
        //var st = document.documentElement.scrollTop||document.body.scrollTop;
        //showMsg(st);
        initScope();

    }

    /**
     * 监听窗口变化
     */
    window.onresize = function() {
        var winSize = getWinSize();
        if (options.imgNaturalSize) {
            var angle = getAngle("photo-view-pic");
            var el = initBoxView(photoViewModal, options.imgNaturalSize, winSize, angle, 1);
            photoViewModal.css(el.modalBox.fixed);
            photoBox.css(el.imgBox);
            photo.css(el.img);

        }

    }

})(window.jQuery);