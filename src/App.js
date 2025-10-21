import logo from './logo.svg';
import './App.css';
import { useEffect, useMemo, useState } from 'react';
const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;


function App() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showGiftMsg, setShowGiftMsg] = useState(false);

  const getSubtotal = useMemo(() => {
    return cart.filter((item) => item.id !== FREE_GIFT.id).reduce((acc, item) => acc + item.price * item.quantity, 0)
  })

  const progress = Math.min((getSubtotal / THRESHOLD) * 100, 100);
  const remaining = Math.max(THRESHOLD - getSubtotal, 0)

  useEffect(() => {
    const hasGift = cart.some((item) => item.id === FREE_GIFT.id);

    if (getSubtotal >= THRESHOLD && !hasGift) {
      setCart((prev) => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMsg(true);
      setTimeout(() => setShowGiftMsg(false), 2000);
    }

    if (getSubtotal < THRESHOLD && hasGift) {
      setCart((prev) => prev.filter((item) => item.id !== FREE_GIFT.id));
    }
  }, [getSubtotal, cart])

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max((prev[id] || 1) + delta, 1);
      return { ...prev, [id]: newQty };
    })
  }

  const addToCart = (product) => {
    const qty = quantities[product.id] || 1;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ?
            { ...item, quantity: item.quantity + qty } : item
        )
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }))
  }

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ?
          { ...item, quantity: Math.max(item.quantity + delta, 1) } :
          item
      ).filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart])


  return (
    <div className="container mx-auto">
      <h3 className='text-center text-3xl font-bold'>Shopping Cart</h3>

      <div className='mt-8'>
        <h4 className='text-2xl font-bold'>Products</h4>
        <div className='grid grid-cols-4 gap-8'>
          {PRODUCTS.map((product) => {
            return <div className='col-auto shadow-md p-4' key={product.id}>
              <h3 className='font-bold'>{product.name}</h3>
              <span>{product.price}</span>
              <button onClick={() => addToCart(product)} className='block w-full bg-blue-700 text-white p-2 rounded-sm mt-2'>Add to Cart</button>
            </div>
          })}
        </div>
      </div>

      <div className="mt-8">
        <h4 className='text-2xl font-bold mt-4'>Cart Summary</h4>
        <div className='col-auto shadow-md p-4 border-b-2 flex justify-between font-bold'>
          <div>
            Subtotal:
          </div>
          <div>
            0
          </div>
        </div>

        <div className='progress-container'>
          <div className='progress-bar'>
            <div className='progress' style={{ width: `${progress}%` }}></div>
          </div>
          <p>
            {getSubtotal >= THRESHOLD ?
              "You've unlocked the free gift!" :
              `Add ${remaining} more to unclock free gift`
            }
          </p>
        </div>
      </div>

      {showGiftMsg && <div className='mt-4 text-green-400'>Free gift added</div>}


      {cart.length == 0 ? <p>Your cart is empty</p> : <div className="mt-8">
        <h4 className='text-2xl font-bold mt-4'>Cart Items</h4>
        {cart.map((item) => (
          <div className='col-auto shadow-md p-4 border-b-2 flex justify-between font-bold items-center gap-2' key={item.id}>
            <div>
              <p>{item.name}</p>
              <p>{item.price}</p>
            </div>
            {item.id !== FREE_GIFT.id ? <div className='flex gap-2'>
              <button className='p-1 bg-red-500 text-white w-9 h-9' onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateCartQty(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button className='p-1 bg-green-500 text-white w-9 h-9' onClick={() => updateCartQty(item.id, 1)}>+</button>
            </div> : "Free"}
          </div>
        ))}
      </div>}

      <h3 className='text-right mt-4 font-bold'>Total: {total}</h3>
    </div>
  );
}

export default App;
