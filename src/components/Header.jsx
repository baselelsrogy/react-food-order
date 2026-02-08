import Button from './UI/Button.jsx';
import logo from '../assets/logo.jpg';
import { useContext } from 'react';
import CartContext from '../store/CartContext.jsx';

export default function Header() {
  const { items } = useContext(CartContext);

  const totalCartItems = items.reduce((totalNumberOfItem, item) => {
    return totalNumberOfItem + item.quantity;
  }, 0);

  return (
    <header id="main-header">
      <div id="title">
        <img src={logo} alt="A restaurant" />
        <h1>ReactFood</h1>
      </div>
      <nav>
        <Button textOnly={true}>Cart ({totalCartItems})</Button>
      </nav>
    </header>
  );
}
