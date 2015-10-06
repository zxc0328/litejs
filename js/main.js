requirejs(["lite"], function(l) {
    var child = document.querySelector("#target"),
        parent = document.querySelectorAll(".test1");
    console.log(l.indexOf(parent,child));
});