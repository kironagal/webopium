$("button").html("<em>Click Here</em>");

console.log($("img").attr("src"));

$("a").attr("href", "https://www.bing.com");

$("h1").click(function(){
    $("h1").css("color", "blue");
});

$("button").click(function(){
    $("h1").css("color", "red");
});

$("input").keydown(function(event){
    console.log(event.key);
});

$(document).keydown(function(event){
    $("h1").text(event.key);
});

$("h1").on("mouseover", function(event){
    $("h1").css("color", "red");
});

$("button").on("click",function(){
    $("h1").animate({opacity: 0.5});
});