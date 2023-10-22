import "normalize.css";
import "./style.scss";
import Navigo from "navigo";
import { Header } from "./modules/Header/Header";
import { Footer } from "./modules/Footer/Footer";
import { Main } from "./modules/Main/Main";
import { ProductList } from "./modules/ProductList/ProductList";
import { ApiService } from "./services/ApiService";
import { Catalog } from "./modules/Catalog/Catalog";
import { FavoriteService } from "./services/StorageService";
import { Pagination } from "./features/Pagination/Pagination";
import { BreadCrumbs } from "./features/BreadCrumbs/BreadCrumbs";
import { ProductCard } from "./modules/ProductCard/ProductCard";
import { productSlider } from "./features/productSlider/productSlider";
import { Cart } from "./modules/Cart/Cart";
import { Order } from "./modules/Order/Order";

export const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

const init = () => {
  const api = new ApiService();

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  router.hooks({
    after() {
      new Catalog().setActiveLink();
    },
  });

  router
    .on(
      "/",
      async () => {
        new Catalog().mount(new Main().element);
        const products = await api.getProducts();
        new ProductList().mount(new Main().element, products);
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        },
        already(match) {
          match.route.handler(match);
        },
      },
    )
    .on(
      "/category",
      async ({ params: { slug, page = 1 } }) => {
        (await new Catalog().mount(new Main().element)).setActiveLink(slug);
        const { data: products, pagination } = await api.getProducts({
          category: slug,
          page: page,
        });

        new BreadCrumbs().mount(new Main().element, [{ text: slug }]);
        new ProductList().mount(new Main().element, products, slug);
        if (pagination.totalProducts > pagination.limit) {
          new Pagination()
            .mount(new ProductList().containerElement)
            .update(pagination);
        }
        router.updatePageLinks();
      },
      {
        leave(done) {
          new BreadCrumbs().unmount();
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        },
        already(match) {
          match.route.handler(match);
        },
      },
    )
    .on(
      "/favorite",
      async ({ params }) => {
        new Catalog().mount(new Main().element);
        const favorite = new FavoriteService().get();
        const { data: product, pagination } = await api.getProducts({
          list: favorite.join(","),
          page: params?.page || 1,
        });
        new BreadCrumbs().mount(new Main().element, [{ text: "Избранное" }]);
        new ProductList().mount(
          new Main().element,
          product,
          "Избранное",
          "Вы ничего не добавили в избранное, пожалуйста, добавьте что-нибудь...",
        );

        if (pagination?.totalProducts > pagination?.limit) {
          new Pagination()
            .mount(new ProductList().containerElement)
            .update(pagination);
        }
        router.updatePageLinks();
      },
      {
        leave(done) {
          new BreadCrumbs().unmount();
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        },
        already(match) {
          match.route.handler(match);
        },
      },
    )
    .on(
      "/search",
      async ({ params: { q } }) => {
        new Catalog().mount(new Main().element);
        const { data: product, pagination } = await api.getProducts({
          q,
        });
        new BreadCrumbs().mount(new Main().element, [{ text: "Поиск" }]);
        new ProductList().mount(
          new Main().element,
          product,
          `Поиск: ${q}`,
          `Ничего не найдено по вашему запросу "${q}"`,
        );
        if (pagination?.totalProducts > pagination?.limit) {
          new Pagination()
            .mount(new ProductList().containerElement)
            .update(pagination);
        }
        router.updatePageLinks();
      },
      {
        leave(done) {
          new BreadCrumbs().unmount();
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        },
        already(match) {
          match.route.handler(match);
        },
      },
    )
    .on(
      "/product/:id",
      async (obj) => {
        new Catalog().mount(new Main().element);
        const data = await api.getProductById(obj.data.id);
        new BreadCrumbs().mount(new Main().element, [
          {
            text: data.category,
            href: `/category?slug=${data.category}`,
          },
          {
            text: data.name,
          },
        ]);
        new ProductCard().mount(new Main().element, data);
        productSlider();
      },
      {
        leave(done) {
          new Catalog().unmount();
          new BreadCrumbs().unmount();
          new ProductCard().unmount();
          done();
        },
      },
    )
    .on(
      "/cart",
      async () => {
        const cartItems = await api.getCart();
        new Cart().mount(
          new Main().element,
          cartItems,
          "Корзина пуста, добавьте товары",
        );
      },
      {
        leave(done) {
          new Cart().unmount();
          done();
        },
      },
    )
    .on(
      "/order/:id",
      async ({ data: { id } }) => {
        const [order] = await api.getOrder(id);
        new Order().mount(new Main().element, order);
      },
      {
        leave(done) {
          new Order().unmount();
          done();
        },
      },
    )
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

  api.getCart().then((data) => {
    new Header().changeCount(data.totalCount);
  });
};
init();
