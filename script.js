$.getJSON("styles.json", function (styles) {
    var poster = new Poster(document.body, styles["red"], "Jouw werk verdient een poster.");
    for (style in styles) {
        $(".colors").append(`<div class="color" style="background: ${styles[style].background}; color: ${styles[style].color}" data-color="${style}">${style}</div>`);
    }
    $(".color").click(function() {
        poster.setStyle(styles[$(this).data("color")]);
        $("input[type=file]").toggle(typeof styles[$(this).data("color")].photo !== "undefined");
    });
    $("input[type=file]").change(function () {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            poster.setPhoto(this.result);
        };
        fileReader.readAsDataURL(this.files[0]);
    });
    $("input[name=text]").keyup(function () {
        poster.setText($(this).val());
    });
    $("button").click(function() {
        poster.exportImage();
    });
    $(".poster").click(function () {
        poster.rotateCanvas();
    });
    $("div.poster").hide();
});