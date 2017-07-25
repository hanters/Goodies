$(document).ready(function($) {

$('.slider1').slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  adaptiveHeight: true,
  mobileFirst:true,
  //arrows:false
});

$('.slider2').slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 5,
  adaptiveHeight: true,
  mobileFirst:true,
  prevArrow: '<i class="seta-esquerda fa fa-caret-left" style="font-size:36px"></i>',
  nextArrow:'<i class="seta-direita fa fa-caret-right" style="font-size:36px"></i>'
});

$('.slider3').html(getImagesInstagran()).slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 5,
  adaptiveHeight: true,
  mobileFirst:true,
  prevArrow: '<i class="seta-esquerda fa fa-caret-left" style="font-size:36px"></i>',
  nextArrow:'<i class="seta-direita fa fa-caret-right" style="font-size:36px"></i>'
});

$("nav.nav-menu li").click(function() {
  $(this).find("ul.sub-link-menu").toggle();
})


})

function getImagesInstagran(elem) {
  return '<a href=""><img src="img/fundo-instagram.png"></a><a href=""><img src="img/fundo-instagram.png"></a><a href=""><img src="img/fundo-instagram.png"></a><a href=""><img src="img/fundo-instagram.png"></a><a href=""><img src="img/fundo-instagram.png"></a><a href=""><img src="img/fundo-instagram.png"></a><a href=""><img src="img/fundo-instagram.png"></a>';


var html_imgs = "";
 
$.ajax({
  url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fwww.instagram.com%2Ffrootybrasil%2Fmedia%2F%22&format=json&diagnostics=true&callback=?', // or /users/self/media/recent for Sandbox
  dataType: 'jsonp',
  type: 'GET',
  success: function(result){
    console.log(result);

    var data = result.query.results.json.items      


    for( x in data ){
      //$('ul').append('<li><img src="'+data[x].images.low_resolution.url+'"></li>'); // data[x].images.low_resolution.url - URL of image, 306х306
      // data[x].images.thumbnail.url - URL of image 150х150
      html_imgs += '<a target="_blank" href="'+data[x].link+'"><img src="'+data[x].images.low_resolution.url+'"></a>';
      // data[x].images.standard_resolution.url - URL of image 612х612
      // data[x].link - Instagram post URL 
    }

  //return html_imgs;
  elem.html(html_imgs);
  },
  error: function(data){
    console.log(data); // send the error notifications to console
    alert('error' + data)
  }
})

return 'teste'+ html_imgs;


}

function abrirMenuMobile() {
  $("nav.nav-menu").toggle();
}
