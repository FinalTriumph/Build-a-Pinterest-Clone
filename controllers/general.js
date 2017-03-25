function replace(objBtn) {
    $(objBtn).attr("src", "https://i.imgsafe.org/9b757effea.png");
    $grid.masonry();
}

var $grid = $(".grid").masonry({
        columnWidth: 30,
        fitWidth: true
    });

$.get(window.location.origin + "/allimages", function(data) {
    for (var i = 0; i < data.length; i++){
        var elem = "<div class='grid-item'><img src="+data[i].image.url+" onerror='replace(this)' alt='Image'/><br><p2>"+data[i].image.title+"</p2><br><a href='/user/"+data[i].image.user+"'><div class='username'><p2>"+data[i].image.name+"</p2></div></a></div>";
        var $content = $( elem );
        $grid.append( $content ).masonry("appended", $content);
    }
});


$('.grid').imagesLoaded( function() {
    setTimeout(function() {
        $grid.masonry('layout');
    }, 500);
});