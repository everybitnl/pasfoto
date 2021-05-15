var poster = new Poster("poster", "Jouw idee verdient een poster.");
$.getJSON("styles.json", function (styles) {
    for (style in styles) {
        $(".colors").append(`<div class="color" style="background: ${styles[style].background}; color: ${styles[style].color}" data-color="${style}">${style}</div>`);
    }
    $(".color").click(function() {
        poster.setStyle(styles[$(this).data("color")]);
        poster.drawCanvas();
    });
    $("input").keyup(function () {
        poster.setText($(this).val());
        poster.drawCanvas();
    });
    $("button").click(function() {
        poster.exportImage();
    });
    $(".color[data-color=red]").click();
});