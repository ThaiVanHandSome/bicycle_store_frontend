import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyle from "./styles/GlobalStyle";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ToastProvider } from "./context/ToastContext";
import { OverlayProvider } from "./context/OverlayContext";
import { AuthProvider } from "./context/RefreshTokenContext";
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
      <AuthProvider>
        <ToastProvider>
          <OverlayProvider>
            <NextUIProvider>
              <GlobalStyle>
                <App />
              </GlobalStyle>
            </NextUIProvider>
          </OverlayProvider>
        </ToastProvider>
      </AuthProvider>
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
