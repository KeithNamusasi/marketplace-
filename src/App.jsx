import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './Header';
import ProductCard from './ProductCard';
import SellForm from './SellForm';
import Auth from './Auth';
import Cart from './Cart';
import Footer from './Footer';
import LandingPage from './LandingPage';
import Profile from './Profile';
import ProductDetails from './ProductDetails';
import CategoryFilter from './CategoryFilter';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Fetch Products
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));

    // 2. Restore Session
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const addProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    setShowCart(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowAuth(false);
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      setShowAuth(true); // Trigger login modal
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    alert("Logged out successfully");
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <Header
          onLoginClick={() => setShowAuth(true)}
          isLoggedIn={isLoggedIn}
          cartCount={cartItems.length}
          onCartClick={() => setShowCart(true)}
          onLogout={handleLogout}
        />

        {showAuth && (
          <div className="modal-overlay">
            <button className="close-modal" onClick={() => setShowAuth(false)}>✕</button>
            <Auth onLoginSuccess={handleLoginSuccess} />
          </div>
        )}

        {showCart && (
          <Cart
            items={cartItems}
            onClose={() => setShowCart(false)}
            onRemove={removeFromCart}
          />
        )}

        <Routes>
          {/* Public Home Route */}
          <Route path="/" element={
            <>
              {!isLoggedIn && <LandingPage onLoginClick={() => setShowAuth(true)} />}
              <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', flex: 1, width: '100%' }}>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />

                <h2 className="section-title" style={{ marginBottom: '30px', fontSize: '2rem' }}>
                  {selectedCategory === "All" ? "Latest Drops" : `${selectedCategory} Collection`}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                  {filteredProducts.map(item => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </main>
            </>
          } />

          {/* Product Details Route */}
          <Route path="/product/:id" element={
            <ProductDetails products={products} onAddToCart={addToCart} />
          } />

          {/* Protected Sell Route */}
          <Route path="/sell" element={
            <ProtectedRoute>
              <div className="main-content" style={{ flex: 1 }}>
                <SellForm onAddProduct={addProduct} />
              </div>
            </ProtectedRoute>
          } />

          {/* Protected Profile Route */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile products={products} />
            </ProtectedRoute>
          } />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;