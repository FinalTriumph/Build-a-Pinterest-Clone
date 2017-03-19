$.get(window.location.origin + "/getdisplayname", function(data) {
    var user = data.user;
    $("#displayName").html(user);
})