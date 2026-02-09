import { useActionState, useContext } from 'react';
import useHttp from '../hooks/useHttp.js';
import CartContext from '../store/CartContext.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';
import { currencyFormatter } from '../util/formatting.js';
import Error from './Error.jsx';
import Button from './UI/Button.jsx';
import Input from './UI/Input.jsx';
import Modal from './UI/Modal.jsx';

const requestConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function Checkout() {
  const { items, clearCart } = useContext(CartContext);
  const { progress, hideCheckout } = useContext(UserProgressContext);

  const { data, error, sendRequest, clearData } = useHttp(
    'http://localhost:3000/orders',
    requestConfig,
    [],
  );

  const totalCart = items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

  function handleClose() {
    hideCheckout();
  }

  function handleFinish() {
    hideCheckout();
    clearCart();
    clearData();
  }

  async function checkoutActions(prevState, fd) {
    const customerData = Object.fromEntries(fd.entries()); // {email: test@email.com}

    await sendRequest(
      JSON.stringify({
        order: {
          items,
          customer: customerData,
        },
      }),
    );
  }

  const [formState, formAction, pending] = useActionState(checkoutActions, null);

  let actions = (
    <>
      <Button type="button" onClick={handleClose} textOnly>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (pending) {
    actions = <span>Sending oreder data...</span>;
  }

  if (data.message && !error) {
    return (
      <Modal open={progress === 'checkout'} onClose={handleFinish}>
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>We will get back to you with more details via email within the next few minutes.</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={progress === 'checkout'} onClose={handleClose}>
      <form action={formAction}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(totalCart)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Field to submit order." message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
