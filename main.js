import "normalize.css";
import "./style.scss";
import Navigo from "navigo";

const productSlider = () => {
  Promise.all([
    import("swiper/modules"),
    import("swiper"),
    import("swiper/css"),
  ]).then(([{ Navigation, Thumbs }, Swiper]) => {
    const swiperThumbnails = new Swiper.default(".product__slider-thumbnails", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    new Swiper.default(".product__slider-main", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".product__arrow_next",
        prevEl: ".product__arrow_prev",
      },
      modules: [Navigation, Thumbs],
      thumbs: {
        swiper: swiperThumbnails,
      },
    });
  });
};

const init = () => {
  productSlider();

  const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

  router
    .on("/", () => {
      console.log("на главной");
    })
    .on("/category", (obj) => {
      console.log("obj: ", obj);
      console.log("category");
    })
    .on("/favorite", () => {
      console.log("favorite");
    })
    .on("/search", () => {
      console.log("search");
    })
    .on("/product/:id", (obj) => {
      console.log("obj: ", obj);
    })
    .on("/cart", () => {
      console.log("cart");
    })
    .on("/order", () => {
      console.log("order");
    })
    .notFound(() => {
      document.body.innerHTML = "<h2>Страница не найдена</h2>";
    });

  router.resolve();
};
init();
