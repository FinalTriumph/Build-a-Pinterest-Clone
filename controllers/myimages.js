function replace(objBtn) {
    $(objBtn).attr("src", "https://i.imgsafe.org/9b757effea.png");
    $grid.masonry();
}

var $grid = $(".grid").masonry({
        columnWidth: 30,
        fitWidth: true
    });

$.get(window.location.origin + "/getmyimages", function(data) {
    for (var i = 0; i < data.length; i++){
        var elem = "<div class='grid-item' id="+data[i]._id+"><img src="+data[i].image.url+" onerror='replace(this)' alt='Image'/><br><p2>"+data[i].image.title+"</p2><br><div class='username active'><p2>"+data[i].image.name+"</p2></div><button value="+data[i]._id+" onclick=remove(this) class='removeBtn'>Remove</button></div>";
        var $content = $( elem );
        $grid.append( $content ).masonry("appended", $content);
    }
})

function remove(objBtn) {
    var id = objBtn.value;
    $.get(window.location.origin + "/removeimage/" + id, function(data) {
        if (data.status === "deleted") {
            $("#"+id).remove();
            $grid.masonry();
        }
    })
}

$("#addImageBtn").click(function() {
    $("#popup").show();
});

$(".xbtn").click(function() {
    $("#popup").hide();
    $("#urlError, #titleError").html("");
    $("input[name=imageURL], input[name=title]").val("");
});

//Regex from https://gist.github.com/dperini/729294
var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i; /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
//////////

$("#submitImage").click(function() {
    var url = $("input[name=imageURL]").val();
    var title = $("input[name=title]").val();
    
    $("#urlError, #titleError").html("");
    
    if (regex.test(url) === false || !title.replace(/\s/g, '').length) {
        if (!url.replace(/\s/g, '').length) {
            $("#urlError").html("Type in image URL");
        } else {
            if (regex.test(url) === false) {
                $("#urlError").html("Wrong URL format");
            }
        }
        if (!title.replace(/\s/g, '').length) {
            $("#titleError").html("Type in image title");
        }
    } else {
        $.post(window.location.origin + "/saveimage", { "ImageTitle": title, "ImageUrl": url }, function(data)  {
            if (data.status === "saved") {
                $("#popup").hide();
                $("#urlError, #titleError").html("");
                $("input[name=imageURL], input[name=title]").val("");
                var image = data.newImage;
                var elem = "<div class='grid-item' id="+image._id+"><img src="+image.image.url+" onerror='replace(this)' alt='Image'/><br><p2>"+image.image.title+"</p2><br><div class='username active'><p2>"+image.image.name+"</p2></div><button value="+image._id+" onclick=remove(this) class='removeBtn'>Remove</button></div>";
                var $content = $( elem );
                $grid.append( $content ).masonry("appended", $content);
            }
        });
    }
});

$("input[name=imageURL], input[name=title]").keypress(function(e) {
    if(e.which==13) {
        $("#submitImage").click();
    }
});

$('.grid').imagesLoaded( function() {
    setTimeout(function() {
        $grid.masonry('layout');
    }, 500);
});