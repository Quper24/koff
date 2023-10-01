import { addContainer } from "../addContainer";
import logoImg from "/img/logo.svg";

export class Header {
  static instance = null;

  constructor() {
    if (!Header.instance) {
      Header.instance = this;
      this.element = document.createElement("header");
      this.element.classList.add("header");
      this.containerElement = addContainer(this.element, "header__container");
      this.isMounted = false;
    }

    return Header.instance;
  }

  mount() {
    if (this.isMounted) {
      return;
    }

    const logo = this.getLogo();
    const searchForm = this.getSearchForm();
    const navigation = this.getNavigation();

    this.containerElement.append(logo, searchForm, navigation);

    document.body.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  getLogo() {
    const logo = document.createElement("a");
    logo.classList.add("header__link-logo");
    logo.href = "/";

    const imgLogo = new Image();
    imgLogo.classList.add("header__logo");
    imgLogo.src = logoImg;
    imgLogo.alt = "Логотип мебельного маркета Koff";

    logo.append(imgLogo);
    return logo;
  }

  getSearchForm() {
    const searchForm = document.createElement("form");
    searchForm.classList.add("header__search");
    searchForm.method = "get";

    const input = document.createElement("input");
    input.classList.add("header__input");
    input.type = "search";
    input.name = "search";
    input.placeholder = "Введите запрос";

    const button = document.createElement("button");
    button.classList.add("header__btn");
    button.type = "submit";
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 16 16" fill="none">
        <path
          d="M7.66671 13.9999C11.1645 13.9999 14 11.1644 14 7.66659C14 4.16878 11.1645 1.33325 7.66671 1.33325C4.1689 1.33325 1.33337 4.16878 1.33337 7.66659C1.33337 11.1644 4.1689 13.9999 7.66671 13.9999Z"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
          stroke-linejoin="round" />
        <path d="M14.6667 14.6666L13.3334 13.3333" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    `;

    searchForm.append(input, button);
    return searchForm;
  }
  getNavigation() {
    const navigation = document.createElement("nav");
    navigation.classList.add("header__control");

    const favoriteLink = document.createElement("a");
    favoriteLink.classList.add("header__link");
    favoriteLink.href = "/favorite";
    favoriteLink.innerHTML = `
      <span class="header__link-text">Избранное</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 16 16" fill="none">
        <path
          d="M8.41334 13.8733C8.18668 13.9533 7.81334 13.9533 7.58668 13.8733C5.65334 13.2133 1.33334 10.46 1.33334 5.79332C1.33334 3.73332 2.99334 2.06665 5.04001 2.06665C6.25334 2.06665 7.32668 2.65332 8.00001 3.55998C8.67334 2.65332 9.75334 2.06665 10.96 2.06665C13.0067 2.06665 14.6667 3.73332 14.6667 5.79332C14.6667 10.46 10.3467 13.2133 8.41334 13.8733Z"
          stroke="#1C1C1C" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;

    const cartLink = document.createElement("a");
    cartLink.classList.add("header__link");
    cartLink.href = "/cart";

    const linkText = document.createElement("span");
    linkText.classList.add("header__link-text");
    linkText.textContent = "Корзина";

    const countElement = document.createElement("span");
    countElement.classList.add("header__count");
    countElement.textContent = "(0)";

    cartLink.append(linkText, countElement);
    cartLink.insertAdjacentHTML(
      "beforeend",
      `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 16 16" fill="none">
        <path d="M5.87336 1.33325L3.46002 3.75325" stroke="#1C1C1C"
          stroke-miterlimit="10" stroke-linecap="round"
          stroke-linejoin="round" />
        <path d="M10.1266 1.33325L12.54 3.75325" stroke="#1C1C1C"
          stroke-miterlimit="10" stroke-linecap="round"
          stroke-linejoin="round" />
        <path
          d="M1.33331 5.23324C1.33331 3.9999 1.99331 3.8999 2.81331 3.8999H13.1866C14.0066 3.8999 14.6666 3.9999 14.6666 5.23324C14.6666 6.66657 14.0066 6.56657 13.1866 6.56657H2.81331C1.99331 6.56657 1.33331 6.66657 1.33331 5.23324Z"
          stroke="#1C1C1C" />
        <path d="M6.50665 9.33325V11.6999" stroke="#1C1C1C"
          stroke-linecap="round" />
        <path d="M9.5733 9.33325V11.6999" stroke="#1C1C1C"
          stroke-linecap="round" />
        <path
          d="M2.33331 6.66675L3.27331 12.4267C3.48665 13.7201 3.99998 14.6667 5.90665 14.6667H9.92665C12 14.6667 12.3066 13.7601 12.5466 12.5067L13.6666 6.66675"
          stroke="#1C1C1C" stroke-linecap="round" />
      </svg>
    `,
    );

    navigation.append(favoriteLink, cartLink);

    this.countElement = countElement;
    return navigation;
  }

  changeCount(n) {
    // todo n - получить
    this.countElement.textContent = `(${n})`;
  }
}
