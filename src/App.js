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
      <h3 className='text-center text-3xl font-bold mt-8'>Shopping Cart</h3>

      <div className='mt-10'>
        <h4 className='text-2xl font-bold'>Products</h4>
        <div className='grid grid-cols-4 gap-8 mt-4'>
          {PRODUCTS.map((product) => {
            return <div className='col-span-4 sm:col-span-1  shadow-md p-4 rounded-md' key={product.id}>
              <h3 className='font-bold'>{product.name}</h3>
              <span className='text-sm font-bold'>₹{product.price}</span>
              <button onClick={() => addToCart(product)} className='block w-full bg-[#155dfc] text-white p-2 rounded-md mt-2'>Add to Cart</button>
            </div>
          })}
        </div>
      </div>

      <div className="mt-8">
        <h4 className='text-2xl font-bold'>Cart Summary</h4>
        <div className='shadow-md p-4 mt-4 rounded-md pb-8'>
          <div className='col-auto border-b-2 pb-4 border-gray-400 flex justify-between font-bold'>
            <div>
              Subtotal:
            </div>
            <div>
              ₹{total}
            </div>
          </div>


          <div className='progress-container mt-8 p-2'>
            <p className='font-bold'>
              {getSubtotal >= THRESHOLD ?
                "You got a free Wireless Mouse" :
                `Add ${remaining} more to get a FREE Wireless Mouse!`
              }
            </p>
            {getSubtotal < THRESHOLD && <div className='progress-bar mt-2'>
              <div className='progress' style={{ width: `${progress}%` }}></div>
            </div>}
            
          </div>
        </div>
      </div>

      {showGiftMsg && <div className='mt-4 text-green-400'>Free gift added</div>}


      {cart.length == 0 ? <div className='shadow-md p-4 rounded-md mt-8 text-center text-gray-400'>
        <p>Your cart is empty</p>
        <p className='mt-2 text-sm'>Add some products to see here!</p>
      </div> : <div className="mt-8">
        <h4 className='text-2xl font-bold my-4'>Cart Items</h4>
        {cart.map((item) => (
          <div className='col-auto shadow-md p-4 border-b-2 flex justify-between items-center gap-2 rounded-md' key={item.id}>
            <div>
              <p className='font-bold'>{item.name}</p>
              <p className='text-gray-500 text-sm'>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
            </div>
            {item.id !== FREE_GIFT.id ? <div className='flex gap-2 items-center'>
              <button className='p-1 rounded-md bg-red-500 text-white w-8 h-8' onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateCartQty(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button className='p-1 rounded-md bg-green-500 text-white w-8 h-8' onClick={() => updateCartQty(item.id, 1)}>+</button>
            </div> : <div className='bg-[#dcfce6] text-green-700 text-xs py-1 px-2 font-bold'>FREE GIFT</div>}
          </div>
        ))}
      </div>}

    </div>
  );
}

export default App;
