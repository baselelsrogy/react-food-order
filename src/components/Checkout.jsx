import { useContext } from 'react';
import Modal from './UI/Modal.jsx';
import CartContext from '../store/CartContext.jsx';
import { currencyFormatter } from '../util/formatting.js';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';

export default function Checkout() {
  const { items } = useContext(CartContext);
  const { progress, hideCheckout } = useContext(UserProgressContext);

  const totalCart = items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

  function handleClose() {
    hideCheckout();
  }

  return (
    <Modal open={progress === 'checkout'} onClose={handleClose}>
      <form>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(totalCart)}</p>

        <Input label="Full Name" type="text" id="full-name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        <p className="modal-actions">
          <Button type="button" onClick={handleClose} textOnly={true}>
            Close
          </Button>
          <Button>Submit Order</Button>
        </p>
      </form>
    </Modal>
  );
}
