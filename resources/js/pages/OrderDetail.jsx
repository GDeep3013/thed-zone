import React, { useState, useCallback, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { TextField, Page, Link, Badge, Spinner, Layout, ResourceList, Thumbnail, ResourceItem, LegacyCard, Text, ChoiceList, Button, Modal, LegacyStack, TextContainer, ActionList, Popover, Icon, Grid, List } from "@shopify/polaris";
import { MenuHorizontalIcon, PlusCircleIcon, XCircleIcon, PlusIcon, LabelPrinterIcon } from '@shopify/polaris-icons';
import ItemGrid from "../components/ItemGrid";
import { ExportIcon } from '@shopify/polaris-icons';
import { getIDs, getProducts } from "./api/productApi";
import PurchasedItemsModel from "../components/PurchasedItemsModel";

function OrderDetail() {
    const navigate = useNavigate();

    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const { OrderID } = useParams();
    const [orderDetail, setOrderDetail] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [timeLines, setTimeLines] = useState([]);
    const [orderResolution, setOrderResolution] = useState(null);
    const [orderShipping, setOrderShipping] = useState(null);
    const [orderRedirectURL, setOrderRedirectURL] = useState(null);
    const [products, setProducts] = useState([]);
    const [productIds, setProductIds] = useState([]);
    const [customerPayload, setCustomerPayload] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalRef, setTotalRef] = useState(0);
    const [feeCharge, setFeeCharge] = useState(0);
    const [newOrderIetm, setNewOrderIetm] = useState([]);
    const [extractNewOrderData, setExtractNewOrderData] = useState([]);
    const [modalActive, setModalActive] = useState(false);
    const [optionModel, setOptionModel] = useState(false);
    const [selectedExport, setSelectedExport] = useState([]);
    const [maximumRefundable, setMaximumRefundable] = useState(0);
    const [labelFee, setLabelFee] = useState(null);
    const [refundModel, setRefundModel] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [refundedPrice, setRefundedPrice] = useState(0);
    const [totalRrefundedPrice, setTotalRefundedPrice] = useState(0);
    const [totlaRefundValue, setTotalRefundedValue] = useState(0);
    const [refundedGiftPrice, setRefundedGiftPrice] = useState(0)

    const handleRefundChange = useCallback((newValue) => {
        let newRefundedPrice = parseFloat(newValue);
        if (isNaN(newRefundedPrice) || newRefundedPrice <= 0) {
            newRefundedPrice = 1;
        }
        if (parseFloat(totalRef) > 0 && parseFloat(totalRef) > newRefundedPrice) {
            // let total = parseFloat(totalRef) - newRefundedPrice;
            setTotalRefundedPrice(newRefundedPrice);
        }
        // setRefundedPrice(newRefundedPrice);
    }, [totalRef]);

    const handleRefundGiftChange = useCallback((newValue) => {
        let newRefundedPrice = parseFloat(newValue);
        if (isNaN(newRefundedPrice) || newRefundedPrice <= 0) {
            newRefundedPrice = 1;
        }
        if (parseFloat(totalRef) > 0 && parseFloat(totalRef) > newRefundedPrice) {
            // let total = parseFloat(totalRef) - newRefundedPrice;
            // setTotalRefundedPrice(newRefundedPrice.toFixed(2));
            setTotalRefundedPrice(newRefundedPrice);
        }
    }, [totalRef]);


    const handleModalChange = useCallback(() => setModalActive(!modalActive), [modalActive]);
    const handleSelectModalChange = useCallback(() => setOptionModel(!optionModel), [optionModel]);
    const handleRefundModalChange = useCallback(() => {
        setRefundModel(!refundModel)
        if (!refundModel && totalPrice) {
            setTotalRefundedPrice(totalPrice);
        }
    }, [refundModel, totalPrice])


    // const [tags, setTags] = useState([]);

    const [Loading, setLoading] = useState(true);
    const [refundLoading, setrefundLoading] = useState(false);

    const storeName = Config.shop.split('.')[0]
    const getOrder = () => {
        setLoading(false);
        fetch(`/request/${OrderID}?shop=${Config.shop}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.status) {
                    let maximumRefundable = result.maximumRefundable != null ? result.maximumRefundable : 0.00;
                    let URL = "https://admin.shopify.com/store/" + Config.shop.replace('.myshopify.com', '') + "/orders/" + result.data.order_id;
                    setOrderDetail(result.data);
                    setTimeLines(result.timeLine);
                    setTotalRefundedValue(result.data.refunded_amount);
                    setMaximumRefundable(maximumRefundable);
                    setOrderData(result.order);
                    setOrderResolution(JSON.parse(result.data.resolution));
                    setOrderShipping(JSON.parse(result.data.shipping));
                    setLabelFee(JSON.parse(result.data.shipping_label_fee))
                    setOrderRedirectURL(URL)
                    const extractedData = JSON.parse(result.data.active_items).map(item => ({
                        variant_id: item.variant_id,
                        quantity: item.quantity
                    }));
                    setExtractNewOrderData(extractedData)
                    if (result.product != null) {
                        // setProductDetail(result.product);
                    }
                    // setTags(result.product.tags.split(", "));
                }
                setLoading(true);
            });
    };
    useEffect(() => {
        if (OrderID) {
            getOrder();
        }
    }, [OrderID]);

    useEffect(() => {
        if (typeof orderDetail.active_items == "string") {
            (async () => {
                let json = JSON.parse(orderDetail.active_items);
                setCustomerPayload(JSON.parse(orderDetail.item_payload));
                let ids = await getIDs(json);
                setProductIds(ids);
            })();
        }
    }, [orderDetail]);
    useEffect(() => {
        let totalQuantity = 0;
        let totalPrice = 0;
        let Fee = "Free";
        for (const itemId in customerPayload) {
            if (customerPayload.hasOwnProperty(itemId)) {
                const item = customerPayload[itemId];
                if (typeof item.remove_status === 'undefined') {
                    totalQuantity += item.quantity;
                    totalPrice += parseFloat(item.price);
                }
            }
        }
        if (maximumRefundable && maximumRefundable < totalPrice) {
            totalPrice = maximumRefundable;
        }
        if (orderResolution && orderResolution.refund === "Refund to original payment method ($5 Fee)") {
            setTotalRef(totalPrice.toFixed(2));
            totalPrice -= 5;
            Fee = "$5.00";
        } else {
            setTotalRef(totalPrice.toFixed(2));
        }
        setQuantity(totalQuantity);
        setTotalPrice(totalPrice.toFixed(2));
        setTotalRefundedPrice(totalPrice.toFixed(2));
        setFeeCharge(Fee);
    }, [customerPayload, maximumRefundable, orderResolution]);

    useEffect(() => {
        if (productIds.length > 0) {
            (async () => {
                let want_fields = "id,images,title,images,variants";
                let res = await getProducts(productIds.join(","), Config.shop, want_fields);
                setProducts(res.products);
            })();
        } else {
            setProducts([])
        }
    }, [productIds]);


    const getNewItem = (order_id) => {
        setSelectedItems([]);
        // setLoading(true)
        fetch(`/get-order-items/${order_id}?shop=${Config.shop}`)
            .then((res) => res.json())
            .then((result) => {
                // setLoading(false)
                if (result.status) {
                    if (result.data.length > 0) {
                        handleModalChange();
                        setNewOrderIetm(result.data);
                    } else {
                        shopify.toast.show("There are no additional items available for return", { duration: 5000, isError: true });
                    }
                }
            })
    }
    const statusApproved = (orderId) => {
        setLoading(false)
        fetch(`/request-status/${orderId}?shop=${Config.shop}&status=Received`)
            .then((res) => res.json())
            .then((result) => {
                setLoading(true)
                if (result.status) {
                    shopify.toast.show(result.message, { duration: 2000 });
                    getOrder();
                }

            })
    }


    const handleRefund = () => {
        setrefundLoading(true)
        console.log(totalRrefundedPrice, "TotalRefund")
        if (selectedExport.length > 0) {
            fetch(`/refund-order-item/${OrderID}?shop=${Config.shop}&type=${selectedExport.toString()}&price=${totalRrefundedPrice}`)
                .then((res) => res.json())
                .then((result) => {
                    setrefundLoading(false)
                    if (result.status) {
                        shopify.toast.show(result.message, { duration: 2000 });
                        handleSelectModalChange();
                        getOrder();
                    } else {
                        handleSelectModalChange();
                        shopify.toast.show(result.message, { duration: 5000, isError: !result.status });
                    }
                })
        } else {
            setrefundLoading(false);
            shopify.toast.show("Please select the refund option.", { duration: 5000, isError: true });
        }
    }

    const promotedBulkActions = [
        {
            content: 'Add New Item',
            onAction: () => handleAddNewItem(),
        },
    ];
    const handleAddNewItem = async () => {
        try {
            fetch(`/add-order-item/${OrderID}?shop=${Config.shop}&variant_id=${selectedItems}`)
                .then((res) => res.json())
                .then((result) => {
                    if (result.status) {
                        handleModalChange();
                        getOrder();
                    }
                })

        } catch (error) {
            shopify.toast.show(error.toString(), { duration: 2000, isError: error });
        } finally {
            setLoading(true);
        }
    }

    const handleDownload = async (id) => {
        if (id != "") {
            try {
                const response = await fetch(`/api/v1/return-label/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/pdf',
                    },
                });

                if (!response.ok) {
                    shopify.toast.show(`${response.status} ${response.statusText}`, { duration: 2000, isError: !result.status });
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'document.pdf'; // Set the desired file name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                shopify.toast.show(error, { duration: 2000, isError: !result.status });

                console.error('Failed to download PDF:', error);
            }
        }
    };

    function formatDate(dateString) {
        const options = { month: 'long', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = date.toLocaleTimeString('en-US', options);
        return `${formattedDate}`;
    }

    const activator = (
        <Button onClick={toggleActive} disclosure>
            More actions
        </Button>
    );

    const handleSelectModelOpen = (OrderID) => {
        // handleSelectModalChange();
        handleRefundModalChange();
        handleSelectedExport([]);
    };
    const handleRefundSubmit = () => {
        handleRefundModalChange()
        handleSelectModalChange();
    }

    const handleSelectedExport = useCallback(value => setSelectedExport(value), []);
    const handleExchangeWithSameItems = async (OrderID) => {
        setLoading(false);
        try {
            fetch(`/replace_with_same/${OrderID}?shop=${Config.shop}`)
                .then((res) => res.json())
                .then((result) => {
                    if (result.status) {
                        shopify.toast.show(result.message, { duration: 2000 });
                        getOrder();
                        if (orderRedirectURL != "") {
                            setTimeout(function () { window.open(`https://admin.shopify.com/store/${storeName}/orders/${orderDetail.order_id}`, '_blank'); }, 2000)
                        }
                    } else {
                        shopify.toast.show(result.message, { duration: 5000, isError: !result.status });
                    }
                })

        } catch (error) {
            shopify.toast.show(error.toString(), { duration: 5000, isError: error });
        } finally {
            setLoading(true);
        }


    }
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate);
        const optionsTime = { hour: '2-digit', minute: '2-digit' };
        const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

        return `${formattedDate}, ${formattedTime}`;
    };
    const formatDate1 = (isoString) => {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleSeeePurchasedItems = () => {
        setOpenModal(true);
    }
    console.log("refundModel", totalRrefundedPrice)
    return (
        <>
            <div className="order-detail">
                <Page
                    backAction={{ content: 'Settings', onAction: (() => { navigate('/'); }) }}
                    title={"RMA #" + orderDetail.id}
                    titleMetadata={<Badge>{orderDetail.status}</Badge>}
                    subtitle={formatDate(orderDetail.created_at)}
                    compactTitle
                    secondaryActions={[
                        {
                            content: 'Resend Notification',
                            onAction: () => alert('View on your store action'),
                        },
                    ]}
                    actionGroups={[
                        {
                            title: 'More actions',
                            actions: [
                                {
                                    content: 'Share on Facebook',
                                    accessibilityLabel: 'Individual action label',
                                    onAction: () => alert('Share on Facebook action'),
                                },
                            ],
                        },
                    ]}
                >
                    <Layout>
                        <Layout.Section>
                            <LegacyCard title="Credit details" sectioned>
                                <div className="section-heading d-flex align-center">
                                    <div className="dotted-circle"><span></span></div>
                                    <Text variant=" bodySm" >{orderDetail.status}</Text>
                                    <Button disabled={orderDetail.status !== "Pending" && orderDetail.status !== "Received"} onClick={() => { getNewItem(OrderID) }} icon={PlusCircleIcon} />
                                </div>
                                <hr className="grid-divider" />
                                <div class="grid-purchased-items">
                                    <Text variant="headingLg" as="h5"> Return items</Text>
                                    <Button variant="plain" onClick={() => { handleSeeePurchasedItems() }}>See purchased items</Button>
                                </div>
                                {products.length > 0 && products.map((product, index) => (
                                    <ItemGrid orderDetail={orderDetail} product={product} getOrder={getOrder} orderID={OrderID} requestData={customerPayload} variatnsImages={orderDetail.image_urls} uploadsImages={orderDetail.upload_images} />
                                ))}
                                <div className="resolution-text">
                                    <Grid>
                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                                            <Text variant="headingSm" as="h4">Resolution</Text>
                                        </Grid.Cell>
                                        <Grid.Cell className="item-content" columnSpan={{ xs: 6, sm: 3, md: 9, lg: 9, xl: 9 }}>
                                            <Text variant="headingSm" as="h4">{orderResolution ? orderResolution.refund : ""} </Text>
                                        </Grid.Cell>
                                    </Grid>
                                    <Grid>
                                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                                            <Text variant="headingSm" as="h4">Return method</Text>
                                        </Grid.Cell>
                                        <Grid.Cell className="item-content" columnSpan={{ xs: 6, sm: 3, md: 9, lg: 9, xl: 9 }}>
                                            <Text variant="headingSm" as="h4">{orderResolution ? orderResolution.ship : ""}</Text>
                                        </Grid.Cell>
                                    </Grid>
                                </div>

                                <hr className="grid-divider" />
                                <div className="custom-grid-buttons">
                                    <div className="refund-btn">
                                        {
                                            orderDetail.status === 'Pending'
                                                ?
                                                <Button size="slim" onClick={() => { statusApproved(OrderID) }}>Mark as received</Button>
                                                :
                                                orderDetail.status === 'Received' ?
                                                    <Button size="slim"
                                                        title={(orderDetail.status === 'Refunded' || orderDetail.status == "GiftCard") ? 'Refunded' : 'Refund'}
                                                        onClick={() => { orderResolution && Object.keys(orderResolution.replaceItems).length > 0 ? handleExchangeWithSameItems(OrderID) : handleSelectModelOpen(OrderID) }}
                                                    >
                                                        {
                                                            orderResolution && Object.keys(orderResolution.replaceItems).length > 0
                                                                ? refundLoading
                                                                    ? <Spinner size="small" />
                                                                    : "Create Exchange Request"
                                                                :
                                                                orderResolution && orderResolution.refund === "Refund to store credit (Free of Charge)" && orderResolution && Object.keys(orderResolution.replaceItems).length == 0
                                                                    ?
                                                                    refundLoading
                                                                        ? <Spinner size="small" />
                                                                        : "Store Credit"
                                                                    :
                                                                    refundLoading
                                                                        ? <Spinner size="small" />
                                                                        : "Refund"
                                                        }

                                                    </Button>
                                                    :
                                                    <Button size="slim" > <a href={`https://admin.shopify.com/store/${storeName}/orders/${orderDetail.order_id}`} target="_blank" style={{
                                                        textDecoration: "none",
                                                        color: "#fff"
                                                    }}>View Order</a></Button>

                                        }
                                    </div>
                                </div>
                            </LegacyCard>
                            <LegacyCard title="Return pending">
                                <div className="return-panding">
                                    <Grid>
                                        <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                            <Text variant="bodyMd" as="p">Return item(s)</Text>
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{ md: 7, lg: 7, xl: 7 }}>
                                            <Text variant="bodyMd" as="p">{quantity && quantity > 1 ? quantity + " items" : quantity + " item"}</Text>
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{ md: 2, lg: 2, xl: 2 }}>
                                            <Text variant="bodyMd" as="p">{`$${totalRef}`}</Text>
                                        </Grid.Cell>
                                    </Grid>
                                    <Grid>
                                        <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                            <Text variant="bodyMd" as="p">Cost of return</Text>
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{ md: 7, lg: 7, xl: 7 }}>
                                            <Text variant="bodyMd" as="p">{feeCharge}</Text>
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{ md: 2, lg: 2, xl: 2 }}>
                                            <Text variant="bodyMd" as="p">{feeCharge}</Text>
                                        </Grid.Cell>
                                    </Grid>
                                    <div className="refund-total">
                                        <Grid>
                                            <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                                <Text variant="bodyMd" as="p">Total refund</Text>
                                            </Grid.Cell>
                                            <Grid.Cell columnSpan={{ md: 7, lg: 7, xl: 7 }}>
                                                <Text variant="bodyMd" as="p">{orderResolution ? orderResolution.refund : ""}</Text>
                                            </Grid.Cell>
                                            <Grid.Cell columnSpan={{ md: 2, lg: 2, xl: 2 }}>
                                                <Text variant="bodyMd" as="p">{`$${totalPrice}`} USD</Text>
                                            </Grid.Cell>
                                        </Grid>
                                        {totlaRefundValue && totlaRefundValue > 0 &&
                                            <Grid>
                                                <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                                    <Text variant="bodyMd" as="p">Total refunded Amount</Text>
                                                </Grid.Cell>
                                                <Grid.Cell columnSpan={{ md: 7, lg: 7, xl: 7 }}>
                                                    <Text variant="bodyMd" as="p"></Text>
                                                </Grid.Cell>
                                                <Grid.Cell columnSpan={{ md: 2, lg: 2, xl: 2 }}>
                                                    <Text variant="bodyMd" as="p">{`$${totlaRefundValue.toFixed(2)}`} USD</Text>
                                                </Grid.Cell>
                                            </Grid>
                                        }
                                    </div>
                                </div>
                            </LegacyCard>

                            <div className="timeline-text">
                                <Grid>
                                    <Grid.Cell columnSpan={{ md: 9, lg: 9, xl: 9 }}>
                                        <Text variant="headingMd" as="h2">Timeline</Text>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                        <label className="show-comment"> <input type="checkbox" /> Show Comments </label>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{ md: 12, lg: 12, xl: 12 }}>
                                        <div className="cr-time-lines-outer">
                                            <List type="bullet">
                                                {timeLines.length > 0 && timeLines.map((timeline, index) => (
                                                    <List.Item key={index}> <b>{timeline.message}</b> <span>{formatDateTime(timeline.created_at)}</span></List.Item>
                                                ))}
                                            </List>
                                        </div>
                                    </Grid.Cell>
                                </Grid>
                            </div>
                        </Layout.Section>
                        <Layout.Section variant="oneThird">
                            <LegacyCard title="Notes" sectioned>
                                <p>No notes for this request</p>
                            </LegacyCard>
                            <LegacyCard title="Order" sectioned>
                                <p>Orginal Order</p>
                                {/* <Link to={`/store/${storeName}/orders`}>{`#${orderDetail.order_no}`}</Link> */}
                                <a href={`https://admin.shopify.com/store/${storeName}/orders/${orderDetail.order_id}`} target="_blank">{`#${orderDetail.order_no}`}</a>
                            </LegacyCard>
                            <LegacyCard title="Customer" sectioned>
                                <p>{orderDetail.customer_name}</p>
                                {/* <Link to={`/store/${storeName}/customers`}>{orderDetail.customer_email}</Link> */}
                                <a href={`https://admin.shopify.com/store/${storeName}/customers/${orderDetail.customer_id}`} target="_blank">{orderDetail.customer_email}</a>
                            </LegacyCard>
                            <LegacyCard sectioned  >
                                <div className="top-heading d-flex " >
                                    <Text variant="headingSm" as="h2"> Return Shipment</Text>
                                    <Badge>Pre-shipment</Badge>
                                </div>

                                <hr />
                                <div className="return-ship-outer d-flex">
                                    <div className="return-ship-inner">
                                        {orderDetail.tracking_url && orderDetail.tracking_code &&
                                            <>
                                                <Link url={orderDetail.tracking_url} target="_blank">{orderDetail.tracking_code}</Link>
                                                <span>&nbsp;&nbsp;USPS</span>
                                                <Button variant="plain" onClick={() => { handleDownload(OrderID) }}><Icon source={ExportIcon} tone="base" /></Button>
                                            </>
                                        }
                                    </div>
                                    <Icon source={MenuHorizontalIcon} tone="base" />
                                </div>
                                <div className="return-ship-content">
                                    <Text variant="bodyLg" as="p">Shipping Rate : {orderShipping ? `$${orderShipping.rate}` : ""}</Text>
                                    {/* <Text variant="bodyLg" as="p">Label Fee : $4.36</Text>
                                    <Text variant="bodyLg" as="p">Postage Fee : $4.36</Text>
                                    <Text variant="bodyLg" as="p">Insurance Fee : $4.36</Text> */}
                                    {labelFee && labelFee.map((fee, index) => (
                                        <Text key={index} variant="bodyLg" as="p">{fee.type.replace('Fee', ' Fee')} : {fee.amount > 0 ? `$${parseFloat(fee.amount).toFixed(2)}` : null}</Text>
                                    ))}
                                    <Popover
                                        active={active}
                                        activator={activator}
                                        autofocusTarget="first-node"
                                        onClose={toggleActive}
                                    >
                                        <ActionList
                                            actionRole="menuitem"
                                            items={[
                                                {
                                                    content: 'Import file',
                                                },
                                                {
                                                    content: 'Export file',
                                                },
                                            ]}
                                        />
                                    </Popover>
                                </div>
                            </LegacyCard>
                        </Layout.Section>
                    </ Layout>
                </Page>
            </div>

            <Modal
                open={modalActive}
                onClose={handleModalChange}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleModalChange,
                    },
                ]}
            >
                <Modal.Section>
                    {Loading && !newOrderIetm ? <Spinner /> :
                        <LegacyCard>
                            <ResourceList
                                resourceName={{ singular: 'Product', plural: 'Products' }}
                                items={newOrderIetm}
                                renderItem={(item) => {
                                    const { id, product_title, sku, image_url } = item;
                                    const media = <Thumbnail
                                        source={image_url}
                                        alt="product-image"
                                    />;
                                    return (
                                        <ResourceItem
                                            id={id}
                                            media={media}
                                            accessibilityLabel={`View details for ${product_title}`}
                                        >
                                            <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                {product_title}
                                            </Text>
                                            <div>
                                                <span>{sku}</span>
                                            </div>
                                        </ResourceItem>
                                    );
                                }}
                                selectedItems={selectedItems}
                                onSelectionChange={setSelectedItems}
                                promotedBulkActions={promotedBulkActions}
                            />
                        </LegacyCard>}
                </Modal.Section>
            </Modal>
            {/* Refund model popup functionality start */}
            <Modal
                open={refundModel}
                onClose={handleRefundModalChange}
                title={orderResolution && orderResolution.refund === "Refund to store credit (Free of Charge)" ? "Store Credit" : "Refund Payment"}
                primaryAction={{
                    content: refundLoading ? <Spinner size="small" /> : 'Submit',
                    onAction: handleRefundSubmit,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleRefundModalChange,
                    },
                ]}
            >
                <Modal.Section>

                    <LegacyStack vertical>
                        <LegacyStack.Item>

                            <div className="return-panding-model-pop-up">
                                <Grid>
                                    <Grid.Cell columnSpan={{ md: 9, lg: 9, xl: 9 }}>
                                        <Text variant="bodyMd" as="p">Return credit(s)</Text>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                        <Text variant="bodyMd" as="p">{`$${totalRef}`}</Text>
                                    </Grid.Cell>
                                </Grid>
                                {
                                    orderResolution && orderResolution.refund === "Refund to store credit (Free of Charge)" ?
                                        (
                                            <div className="refund-total">
                                                <Grid>
                                                    <Grid.Cell columnSpan={{ md: 9, lg: 9, xl: 9 }}>
                                                        <Text variant="bodyMd" as="p">Total refund</Text>
                                                    </Grid.Cell>
                                                    <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                                        <div className="return-txt-field">
                                                            <span>$</span>
                                                            <TextField
                                                                value={totalRrefundedPrice}
                                                                onChange={handleRefundGiftChange}
                                                                type="number"
                                                                placeholder="Enter cost of return"
                                                                autoComplete="off"

                                                            />
                                                        </div>
                                                    </Grid.Cell>
                                                </Grid>
                                            </div>
                                        )
                                        :
                                        (
                                            <>
                                                <Grid>
                                                    <Grid.Cell columnSpan={{ md: 9, lg: 9, xl: 9 }}>
                                                        <Text variant="bodyMd" as="p">Cost of return</Text>
                                                    </Grid.Cell>
                                                    <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                                        <Text variant="bodyMd" as="p">{feeCharge}</Text>
                                                    </Grid.Cell>
                                                </Grid>
                                                <div className="refund-total">
                                                    <Grid>
                                                        <Grid.Cell columnSpan={{ md: 9, lg: 9, xl: 9 }}>
                                                            <Text variant="bodyMd" as="p">Total refund</Text>
                                                        </Grid.Cell>
                                                        <Grid.Cell columnSpan={{ md: 3, lg: 3, xl: 3 }}>
                                                            <div className="return-txt-field">
                                                                <span>$</span>
                                                                <TextField
                                                                    value={totalRrefundedPrice}
                                                                    onChange={handleRefundChange}
                                                                    type="number"
                                                                    autoComplete="off"

                                                                />
                                                            </div>
                                                            {/* <Text variant="bodyMd" as="p">{`$${totalRrefundedPrice}`} USD</Text> */}
                                                        </Grid.Cell>
                                                    </Grid>
                                                </div>
                                            </>
                                        )
                                }
                            </div>
                        </LegacyStack.Item>
                    </LegacyStack>
                </Modal.Section>
            </Modal>
            {/* Refund model popup functionality start */}
            <Modal
                open={optionModel}
                onClose={handleSelectModalChange}
                title="Refund option"
                primaryAction={{
                    content: refundLoading ? <Spinner size="small" /> : 'Submit',
                    onAction: handleRefund,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleSelectModalChange,
                    },
                ]}
            >
                <Modal.Section>

                    <LegacyStack vertical>
                        <LegacyStack.Item>
                            <ChoiceList

                                choices={
                                    orderResolution && orderResolution.refund.includes("Refund to original payment method ($5 Fee)")
                                        ? [
                                            { label: 'Complete Refund', value: "complete_refund" },

                                        ]
                                        : [
                                            { label: 'Create Gift Card', value: "create_gift_card" },
                                        ]
                                }
                                selected={selectedExport}
                                onChange={handleSelectedExport}
                            />
                        </LegacyStack.Item>
                    </LegacyStack>
                </Modal.Section>
            </Modal>

            <PurchasedItemsModel show={openModal} setOpenModal={setOpenModal} orderData={orderData} orderDetail={orderDetail} />
        </>
    );
}

export default OrderDetail;
