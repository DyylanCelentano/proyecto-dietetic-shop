import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = window.localStorage.getItem('cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    console.log('useCart: Producto recibido:', product); // Debug
    
    setCartItems(prevItems => {
      // Crear un ID único basado en el producto y sus especificaciones
      const itemId = `${product._id}_${product.cantidadSeleccionada || 1}_${product.unidadSeleccionada || 'unidades'}`;
      
      const itemInCart = prevItems.find(item => item.itemId === itemId);
      
      if (itemInCart) {
        // Si el item ya existe con las mismas especificaciones, incrementar quantity
        return prevItems.map(item =>
          item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // Si es un nuevo item, agregarlo con todas las propiedades necesarias
      const newItem = {
        ...product,
        itemId,
        quantity: 1,
        // Mantener las especificaciones de cantidad/unidad seleccionadas
        cantidadEspecificada: product.cantidadSeleccionada || 1,
        unidadEspecificada: product.unidadSeleccionada || 'unidades',
        // Calcular precio unitario de manera más robusta
        precioUnitario: (() => {
          if (product.precioCalculado !== undefined && product.precioCalculado !== null) {
            return product.precioCalculado;
          }
          if (product.precioUnidad !== undefined && product.precioUnidad !== null) {
            return product.precioUnidad;
          }
          if (product.precioGramo !== undefined && product.precioGramo !== null) {
            return product.precioGramo * (product.cantidadSeleccionada || 100);
          }
          if (product.precio !== undefined && product.precio !== null) {
            return product.precio;
          }
          return 0; // Fallback seguro
        })()
      };
      
      console.log('useCart: Nuevo item creado:', newItem); // Debug
      
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
  };

  const increaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.itemId === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular totales considerando los nuevos tipos de productos
  const cartCount = cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  
  const cartTotal = cartItems.reduce((total, item) => {
    // Calcular precio de manera segura con fallbacks
    const itemPrice = item.precioUnitario || item.precioCalculado || item.precio || item.precioUnidad || 0;
    const quantity = item.quantity || 0;
    return total + (itemPrice * quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
