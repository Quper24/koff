import { ApiService } from "../../services/ApiService";

export class CartButton {
  constructor(className, text) {
    this.text = text;
    this.className = className;
  }

  create(id) {
    const button = document.createElement("button");
    button.classList.add(this.className);
    button.dataset.id = id;
    button.textContent = this.text;

    button.addEventListener("click", () => {
      new ApiService().postProductToCart(id);
    });

    return button;
  }
}
