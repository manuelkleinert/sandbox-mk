import 'slick-carousel/slick/slick';

(function Slider() {
  $(document).ready(() => {
    $('.slick').slick({
      dots: false,
      speed: 500,
      fade: true,
      prevArrow: '.uk-slideshow-controls .prev',
      nextArrow: '.uk-slideshow-controls .next',
    });
  });
}(jQuery));
