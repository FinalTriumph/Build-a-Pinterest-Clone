function replace(objBtn) {
    $(objBtn).attr("src", "https://i.imgsafe.org/9b757effea.png");
    $grid.masonry();
}

var $grid = $(".grid").masonry({
        columnWidth: 30,
        fitWidth: true
    });
    
var username = window.location.pathname.split("").splice(6).join("");

$.get(window.location.origin + "/userimages/" + username, function(data) {
    for (var i = 0; i < data.length; i++){
        var elem = "<div class='grid-item'><img src="+data[i].image.url+" onerror='replace(this)' alt='Image'/><br><p2>"+data[i].image.title+"</p2><br><div class='username active'><p2>"+data[i].image.name+"</p2></div></div>";
        var $content = $( elem );
        $grid.append( $content ).masonry("appended", $content);
    }
    document.title = data[0].image.name;
});

$('.grid').imagesLoaded( function() {
    setTimeout(function() {
        $grid.masonry('layout');
    }, 500);
});