function Poster(elementId, text) {
    var c = document.getElementById(elementId);

    var ctx = c.getContext("2d");

    var originalFontSize = parseFloat($(".text").css('font-size'));

    var canvasHeight = 420;
    var canvasWidth = Math.round(canvasHeight / Math.SQRT2); // A0 verhoudingen
    
    var resolution = 2;

    c.width = canvasWidth * resolution;
    c.height = canvasHeight * resolution;
    
    var marginTop = canvasHeight / 4 * resolution;
    var marginBottom = canvasHeight / 6 * resolution;
    var marginLeft = canvasHeight / 20 * resolution;
    
    var logoSize = canvasHeight / 10 * resolution;

    function setText(aText) {
        text = aText;
    }

    function setStyle(aStyle) {
        style = aStyle;
    }

    function drawWords() {
        var words = text.split(" ");
        var fontSize = originalFontSize * resolution;
        var lineHeight = 60 * resolution;
    
        if (words.length > 5) {
            fontSize = fontSize * 5 / words.length;
            lineHeight = (c.height - marginTop - marginBottom) / (words.length - 1);
        }
    
        ctx.font = `${fontSize}px HelveticaNeueLTPro-Bd`;
        ctx.fillStyle = style.color;
    
        for (var i = 0; i < words.length; ++i) {
            ctx.fillText(words[i], marginLeft, marginTop + i * lineHeight);
        }
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
    
        //ctx.fillStyle = "#AAAAAA";
        //ctx.fillRect(0, 0, c.width, marginTop);
        //ctx.fillRect(0, c.height-marginBottom, c.width, c.height);
    }
    
    function drawImage() {
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
            img.onerror = reject;
            img.src = style.photo;
        });
    }
    
    async function drawCanvas() {
        if (style.photo) {
            await drawImage();
        }
        drawBackground();
        drawWords();
        drawLogo();
    
        $("div.poster").hide();
        $("canvas.poster").show();
    }

    function exportImage() {
        var dataURL = c.toDataURL("image/png");
        var newTab = window.open('about:blank','Tiltshift poster');
        newTab.document.write(`<img src='${dataURL}' alt='${text}'/>`);
    }

    return {
        setText,
        setStyle,
        drawCanvas,
        exportImage
    };
}