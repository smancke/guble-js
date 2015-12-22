
console.log("demo");

var g = new Guble("http://127.0.0.1:8080");
g.onMessage(function(meta, header, body) {
    $( "body" ).append("<div>"+body+"</div>");
});
g.onOpen(function() {
    g.sendRaw("+ /foo");
    g.sendRaw("> /foo\n\nHallo, das ist eine Demo");
});
g.connect("marvin");

