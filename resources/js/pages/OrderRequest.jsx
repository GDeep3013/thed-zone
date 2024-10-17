import React, { useState, useEffect, useCallback } from 'react'

import {
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
  IndexFiltersMode,
  useBreakpoints,
  Page,
  Thumbnail,
  Button
} from '@shopify/polaris';
// import type {IndexFiltersProps, TabProps} from '@shopify/polaris';
import GiftCardModel from "../components/GiftCardModel"
import { useNavigate } from "react-router-dom";
import { ViewIcon } from '@shopify/polaris-icons';
const OrderRequest = () => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState(0);
  
  const openModel = () => {setOpen(true);}
  const closeModal = () => { setOpen(false); }
  
  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    'All'
  ]);
 
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    onAction: () => { },
  }));
  
  const sortOptions = [
    { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
    { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
    { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
    { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
    { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
    { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
    { label: 'Total', value: 'total asc', directionLabel: 'Ascending' },
    { label: 'Total', value: 'total desc', directionLabel: 'Descending' },
  ];
  const [sortSelected, setSortSelected] = useState(['order asc']);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const onHandleCancel = () => { };

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const [accountStatus, setAccountStatus] = useState([]);
  const [moneySpent, setMoneySpent] = useState(
    undefined,
  );
  const [taggedWith, setTaggedWith] = useState('');
  const [queryValue, setQueryValue] = useState(undefined);

  // const handleAccountStatusChange = useCallback((value) => setAccountStatus(value), []);
  // const handleMoneySpentChange = useCallback((value) => setMoneySpent(value), []);
  // const handleTaggedWithChange = useCallback((value) => setTaggedWith(value), []);
  const handleQueryValueChange = useCallback((value) => { setQueryValue(value) }, []);
  const handleAccountStatusRemove = useCallback(() => setAccountStatus([]), []);
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleQueryValueRemove,
    handleTaggedWithRemove,
    handleMoneySpentRemove,
    handleAccountStatusRemove,
  ]);

  const filters = [];

  // const appliedFilters =
  //   taggedWith && !isEmpty(taggedWith)
  //     ? [
  //       {
  //         key: 'taggedWith',
  //         label: disambiguateLabel('taggedWith', taggedWith),
  //         onRemove: handleTaggedWithRemove,
  //       },
  //     ]
  //     : [];
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(true);
  /* start pagination  */
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const nextPage = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  /* end  pagination  */

  useEffect(() => {
    getOrderRequestData(page, queryValue);
  }, [page, queryValue]);

  const getOrderRequestData = (page, queryValue) => {
    setLoader(false);
    fetch("/request?shop=" + Config.shop + "&page=" + page + "&search=" + queryValue)
      .then((res) => res.json())
      .then(
        (result) => {
          setLoader(true);
          if (result.status) {
            setOrders(result.data.data)
            setPage(result.data.current_page);
            setLastPage(result.data.last_page);
          }
        },
        (error) => {
          setLoader(false);
        }
      );
  }
  const formatDate = (inputDate) => {
    const options = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(inputDate));
    return formattedDate;
  };

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(orders);
  const getRefund = (resolution, value) => {
    if (!resolution) return 'No refund specified';
    const resolutionObj = JSON.parse(resolution);
    return resolutionObj[value];

  };
  const getFirstImageUrl = (imageUrls) => {
    if (!imageUrls) return null;
    const imageUrlObj = JSON.parse(imageUrls);
    const variantIds = Object.keys(imageUrlObj);
    if (variantIds.length === 0) return null;
    const firstVariantId = variantIds[0];
    return imageUrlObj[firstVariantId];
  };
  const rowMarkup = Array.isArray(orders) && orders.map((request, index) => (
    <IndexTable.Row
      id={request.id}
      key={request.id}
      selected={selectedResources.includes(request.id)}
      position={index}
      onClick={() => { navigate("/page/orderDetail/" + request.id) }}
    >
      <IndexTable.Cell>
        {/* <Text variant="bodyMd" fontWeight="bold" as="span"> */}
        <Thumbnail source={getFirstImageUrl(request.image_urls)} alt="product-image" />
        {/* </Text> */}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <b>#RMA-{request.id}</b>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <p>
          {/* <img src="../assets/images/Shopify-Logo.png" alt="shopify" height="22" /> */}
          <span>
            <b>
              #{request.order_no}
            </b>
          </span>
        </p>
      </IndexTable.Cell>
      <IndexTable.Cell>{formatDate(request.created_at)}</IndexTable.Cell>
      <IndexTable.Cell>{request.status}</IndexTable.Cell>
      <IndexTable.Cell>{getRefund(request.resolution, 'refund')}{request.status === "GiftCard" ? <Button className="gift-card-btn" variant="plain" onClick={(e) => {
        e.stopPropagation(); 
        setCustomerId(request.id);
        openModel()
      }}>View Gift Card </Button> : null}</IndexTable.Cell>
      {/* <IndexTable.Cell>{getRefund(request.shipping, 'ship')}</IndexTable.Cell> */}
      <IndexTable.Cell>{request.customer_name}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'moneySpent':
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case 'taggedWith':
        return `Tagged with ${value}`;
      case 'accountStatus':
        return (value).map((val) => `Customer ${val}`).join(', ');
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }


  return (
    <div class="page-outer-return">
      <Page
        title="Return"
        primaryAction={{
          content: 'Create Request',
        }}
        secondaryActions={[
          {
            content: 'Export',
            helpText: 'You need permission to Export.',
          },
        ]}
        fullWidth
      >
        <LegacyCard>
          <IndexFilters
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            queryValue={queryValue}
            queryPlaceholder="Searching in all"
            onQueryChange={handleQueryValueChange}
            onQueryClear={() => setQueryValue('')}
            onSort={setSortSelected}
            // primaryAction={primaryAction}
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false,
            }}
            tabs={tabs}
            // selected={selected}
            // onSelect={setSelected}
            // canCreateNewView
            // onCreateNewView={onCreateNewView}
            filters={filters}
            // appliedFilters={appliedFilters}
            // onClearAll={handleFiltersClearAll}
            mode={mode}
            setMode={setMode}
          />
          <IndexTable

            condensed={useBreakpoints().smDown}
            resourceName={resourceName}
            itemCount={orders.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: '' },
              { title: 'RMA No' },
              { title: 'Order No' },
              { title: 'Request Date' },
              { title: 'Status' },
              { title: 'Resolution' },
              // { title: 'Shipping Status' },
              { title: 'Customer' },
            ]}
            pagination={{
              hasPrevious: true,
              onPrevious: () => {
                prevPage();
              },
              hasNext: true,
              onNext: () => {
                nextPage();
              },
            }}
            loading={!loader}
          >
            {loader && rowMarkup}
          </IndexTable>
        </LegacyCard>
      </Page>
      <GiftCardModel show={open} setOpen={setOpen} customerID={customerId} />
    </div>
  );


}

export default OrderRequest

