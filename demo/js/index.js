$(document).ready(function(){
	console.log("index loaded");
	
	$("#sub").bind("click",function(){
		content.load("sub");
	});
	
	content.attach("header");
});