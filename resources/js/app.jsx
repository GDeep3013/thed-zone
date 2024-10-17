// import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client'
import '@shopify/polaris/build/esm/styles.css';
import '../css/app.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
// import { Provider } from '@shopify/app-bridge-react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderRequest from "./pages/OrderRequest";
import OrderDetail from "./pages/OrderDetail";
import AppFrame from './routing/AppFrame';
import { Page, Layout, Card, Frame } from '@shopify/polaris';

createRoot(document.getElementById('root')).render(
      <AppProvider i18n={enTranslations}>
            {/* <Provider config={Config}> */}
            <Router>
                  <Frame>
                        {/* <Page fullWidth> */}
                              <AppFrame />
                        {/* </Page> */}
                  </Frame>
                  {/* <Routes>
                              <Route exact path="/" element={<OrderRequest />} />
                              <Route exact path="/page/orderDetail/:OrderID" element={<OrderDetail />} />
                        </Routes> */}
            </Router>
            {/* </Provider> */}
      </AppProvider>
);
