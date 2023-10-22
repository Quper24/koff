import { addContainer } from "../addContainer";

export class Order {
  static instance = null;

  constructor() {
    if (!Order.instance) {
      Order.instance = this;
      this.element = document.createElement("section");
      this.element.classList.add("order");
      this.containerElement = addContainer(this.element, "order__container");
      this.isMounted = false;

      this.deliveryTypeList = {
        delivery: "Доставка",
        pickup: "Самовывоз",
      };
      this.PaymentTypeList = {
        card: "Картой при получении",
        cash: "Наличными при получении",
      };
    }

    return Order.instance;
  }

  mount(parent, data) {
    this.render(data);

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

  render(data) {
    const totalPrice =
      parseInt(data.totalPrice) + (data.deliveryType === "delivery" ? 500 : 0);
    this.containerElement.innerHTML = `
      <div class="order__content">
        <div class="order__header">
          <h2 class="order__title">Заказ успешно размещен</h2>
          <p class="order__price">${totalPrice.toLocaleString()} ₽</p>
        </div>

        <p class="order__number">№${data.id}</p>

        <div class="order__table-wrapper">
          <h3 class="order__table-title">Данные доставки</h3>
          <table class="order__table table">
            <tr class="table__row">
              <td class="table__field">Получатель</td>
              <td class="table__value">${data.name}</td>
            </tr>
            <tr class="table__row">
              <td class="table__field">Телефон</td>
              <td class="table__value">${data.phone}</td>
            </tr>
            <tr class="table__row">
              <td class="table__field">E-mail</td>
              <td class="table__value">${data.email}</td>
            </tr>
            ${
              data.address
                ? `<tr class="table__row">
                    <td class="table__field">Адрес доставки</td>
                    <td class="table__value">${data.address}</td>
                  </tr>`
                : ""
            }
            <tr class="table__row">
              <td class="table__field">Способ оплаты</td>
              <td class="table__value">${
                this.PaymentTypeList[data.paymentType]
              }</td>
            </tr>
            <tr class="table__row">
              <td class="table__field">Способ получения</td>
              <td class="table__value">${
                this.deliveryTypeList[data.deliveryType]
              }</td>
            </tr>
          </table>
        </div>

        <a class="order__back" href="/">На главную</a>
      </div>
    `;
  }
}
