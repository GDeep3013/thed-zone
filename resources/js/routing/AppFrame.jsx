import React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react';
import { Page, Grid, LegacyCard, List, Tabs, Icon } from '@shopify/polaris';
import { useLocation, useParams } from "react-router-dom";
import Orders from '../pages/Orders'
import OrderDetail from '../pages/OrderDetail'
import Products from '../pages/Products'
import MenuRoutes from './MenuRoutes';

const AppFrame = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex),[],);
  const tabs = [
    {
      id: 'products-fetch-1',
      content: "Products",
      element: <Products />,
      accessibilityLabel: 'Products',
      panelID: 'products-fetch-1',

    },
    {
      id: 'cr-orders-1',
      content: "Orders",
      element: <Orders />,
      panelID: 'Cr-orders-1',
    }
    // {
    //   id: 'shipClass-1',
    //   content: "Shipping Classes",
    //   element: <ShippingClass/>,
    //   panelID: 'Templates-content-1',
    // }
  ];
 
  
  if (location.pathname.includes('/page/orderDetail/') || location.pathname.includes('/page/add-tag')) {
    return (<MenuRoutes />);
  } else {
    return (
      // <Page fullWidth>
        <LegacyCard>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <LegacyCard.Section>
              {tabs[selected].element}
            </LegacyCard.Section>
          </Tabs>
        </LegacyCard>
      // </Page>
    );
  }
}

export default AppFrame
