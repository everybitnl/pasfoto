function Poster(parentElement, style) {
    var c = document.createElement("canvas");
    c.className = "poster";
    $(c).hide();
    parentElement.prepend(c);

    var ctx = c.getContext("2d");

    var originalFontSize = 52;
    var canvasHeight = 420;
    var canvasWidth = canvasHeight; // vierkant
    var resolution = 2;

    c.width = canvasWidth * resolution;
    c.height = canvasHeight * resolution;
    
    var marginTop = canvasHeight / 4 * resolution;
    var marginBottom = canvasHeight / 6 * resolution;
    var marginLeft = canvasHeight / 20 * resolution;
    
    var logoSize = canvasHeight / 10 * resolution;
    
    var photo;

    async function setPhoto(aPhoto) {
        photo = aPhoto;
        await drawPhoto();
        photo = c.toDataURL("image/png");
        drawCanvas();
    }

    function setStyle(aStyle) {
        style = aStyle;
        if (!photo && style.photo) { // TODO placeholder?
            photo = style.photo;
        }
        drawCanvas();
    }
    
    function drawLogo() {
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img,
                c.width - (logoSize * 1.25),
                c.height - (logoSize * 1.25),
                logoSize, logoSize
            );
        }
        img.src = style.img;
    }
    
    function drawBackground() {
        ctx.fillStyle = style.background;
        ctx.fillRect(0, 0, c.width, c.height);
    }
    
    function drawPhoto() {
        if (!photo) return;
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                var scale = img.width / img.height < c.width / c.height ?
                    img.width / c.width:
                    img.height / c.height;
                if (style.filter) {
                    ctx.filter = style.filter;
                }
                ctx.drawImage(img,
                    Math.max((img.width - c.width * scale) / 2, 0), Math.max((img.height - c.height * scale) / 2, 0), c.width * scale, c.height * scale,
                    0, 0, c.width, c.height
                );
                ctx.filter = "none";
    
                return resolve(img);
            }
            img.src = photo; // TODO cache
        });
    }

    function drawSquare() {
        var ctx = c.getContext("2d");
        ctx.rotate(6 * Math.PI / 180);
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.strokeStyle = "#E54545";
        ctx.rect(160, 60, 640, 640);
        ctx.stroke();
        ctx.rotate(-6 * Math.PI / 180);
    }
    
    async function drawCanvas(backgroundDataURL) {
        await drawPhoto();
        drawBackground();
        drawLogo();
        drawSquare();
    }

    function exportImage() {
        var dataURL = c.toDataURL("image/png");
        var newTab = window.open('about:blank','Tiltshift poster');
        newTab.document.write(`<img src='${dataURL}' alt='${text}'/>`);
    }

    return {
        setStyle,
        setPhoto,
        drawCanvas,
        exportImage
    };
}