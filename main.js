import "normalize.css";
import "./style.scss";
import Navigo from "navigo";
import { Header } from "./modules/Header/Header";
import { Footer } from "./modules/Footer/Footer";
import { Main } from "./modules/Main/Main";
import { ProductList } from "./modules/ProductList/productList";
import { ApiService } from "./services/ApiService";
import { Catalog } from "./modules/Catalog/Catalog";

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
  const api = new ApiService();
  const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  api.getProductCategories().then((data) => {
    new Catalog().mount(new Main().element, data);
    router.updatePageLinks();
  });

  productSlider();

  router
    .on(
      "/",
      async () => {
        const product = await api.getProducts();
        new ProductList().mount(new Main().element, product);
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          done();
        },
        already() {
          console.log("already");
        },
      },
    )
    .on(
      "/category",
      async ({ params: { slug } }) => {
        const product = await api.getProducts();
        new ProductList().mount(new Main().element, product, slug);
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          done();
        },
      },
    )
    .on(
      "/favorite",
      async () => {
        const product = await api.getProducts();
        new ProductList().mount(new Main().element, product, "Избранное");
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          done();
        },
      },
    )
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
      new Main().element.innerHTML = `
      <h2>Страница не найдена</h2>
      <p>Через 5 секунд вы будете перенаправлены
        <a href="/">на главнную страницу</a>
      </p>`;

      setTimeout(() => {
        router.navigate("/");
      }, 5000);
    });

  router.resolve();
};
init();
