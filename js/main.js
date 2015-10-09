requirejs(["lite"], function(l) {
    var target = document.querySelectorAll(".target");
    var message = document.querySelectorAll("#message");
    l.addSwipe(target,"swipe",function(){
        console.log("swipe");
        message[0].innerHTML = "swipe!!!";
    })
});