import { API_URL } from "../../const";
import { addContainer } from "../addContainer";

export class ProductList {
  static instance = null;

  constructor() {
    if (!ProductList.instance) {
      ProductList.instance = this;
      this.element = document.createElement("section");
      this.element.classList.add("goods");
      this.containerElement = addContainer(this.element, "goods__container");
      this.isMounted = false;
      this.addEvents();
    }

    return ProductList.instance;
  }

  mount(parent, data, title) {
    this.containerElement.textContent = "";

    const titleElem = document.createElement("h2");
    titleElem.textContent = title ? title : "Список товаров";

    titleElem.className = title
      ? "goods__title"
      : "goods__title visually-hidden";

    this.containerElement.append(titleElem);
    this.updateListElem(data);

    if (this.isMounted) {
      return;
    }

    parent.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  addEvents() {}
  updateListElem(data = []) {
    const listElem = document.createElement("ul");
    listElem.classList.add("goods__list");

    const listItems = data.map((item) => {
      const listItemElem = document.createElement("li");
      listItemElem.innerHTML = this.getHTMLTemplateListItem(item);

      return listItemElem;
    });

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  }

  getHTMLTemplateListItem({ id, images: [image], name: title, price }) {
    return `
      <article class="goods__card card">
        <a class="card__link card__link_img" href="/product/${id}">
          <img class="card__img" src="${API_URL}${image}"
            alt="${title}">
        </a>

        <div class="card__info">
          <h3 class="card__title">
            <a class="card__link" href="/product/${id}">
              ${title}
            </a>
          </h3>

          <p class="card__price">${price.toLocaleString()}&nbsp;₽</p>
        </div>

        <button class="card__btn" data-id="${id}">В корзину</button>

        <button class="card__favorite" data-id="${id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 16 16" fill="none">
            <path
              d="M8.41331 13.8733C8.18665 13.9533 7.81331 13.9533 7.58665 13.8733C5.65331 13.2133 1.33331 10.46 1.33331 5.79332C1.33331 3.73332 2.99331 2.06665 5.03998 2.06665C6.25331 2.06665 7.32665 2.65332 7.99998 3.55998C8.67331 2.65332 9.75331 2.06665 10.96 2.06665C13.0066 2.06665 14.6666 3.73332 14.6666 5.79332C14.6666 10.46 10.3466 13.2133 8.41331 13.8733Z"
              fill="white" stroke="#1C1C1C" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </article>
    `;
  }
}
