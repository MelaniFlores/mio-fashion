import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ProductsProvider } from "./context/ProductsContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

// OrdersProvider va dentro de ProductsProvider porque cancelar un pedido devuelve existencias
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <OrdersProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </OrdersProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
