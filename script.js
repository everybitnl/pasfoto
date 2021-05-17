var poster = new Poster(document.body, "red/p");
$.getJSON("styles.json", function (styles) {
    for (style in styles) {
        $(".colors").append(`<div class="color" style="background: ${styles[style].background}; color: ${styles[style].color}" data-color="${style}">${style}</div>`);
    }
    $(".color").click(function() {
        $("div.poster").hide();
        $("canvas.poster").show();
        poster.setStyle(styles[$(this).data("color")]);
    });
    $("input[type=file]").change(function () {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            poster.setPhoto(this.result);
            $("div.poster").hide();
            $("canvas.poster").show();
        };
        fileReader.readAsDataURL(this.files[0]);
    });
    $("button").click(function() {
        poster.exportImage();
    });
});