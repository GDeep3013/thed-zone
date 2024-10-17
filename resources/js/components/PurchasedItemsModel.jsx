import React, { useState, useCallback, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { Page, TextField, Badge, Spinner, Layout, ResourceList, Thumbnail, ResourceItem, LegacyCard, Text, ChoiceList, Button, Modal, LegacyStack, TextContainer, ActionList, Popover, Icon, Grid, List } from "@shopify/polaris";


const PurchasedItemsModel = ({ show, setOpenModal, orderData, orderDetail }) => {
    
    const image_urls = orderDetail && orderDetail.image_urls ? JSON.parse(orderDetail.image_urls) : [];
    return (
        <Modal
            open={show}
            onClose={() => setOpenModal(false)}
            title="Purchased items"
            secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: () => setOpenModal(false),
                },
            ]}
        >
            <Modal.Section>
                <LegacyStack vertical>
                    {
                        orderData && orderData.line_items && orderData.line_items.map((variant, inx) => (
                            <Grid key={inx}>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                                    <Thumbnail
                                        className="product-img"
                                        source={image_urls[variant.variant_id]}
                                        alt={variant.title}
                                    />
                                </Grid.Cell>
                                <Grid.Cell className="item-content" columnSpan={{ xs: 6, sm: 3, md: 7, lg: 7, xl: 7 }}>
                                    <Text variant="headingSm" as="h4"> {variant.title}</Text>
                                    <Text variant="bodySm">{variant.variant_title}</Text>
                                    <Text variant="bodySm">SKU: {variant.sku}</Text>
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 2, xl: 2 }}>
                                    <Text variant="bodySm">${variant.price} x 1</Text>
                                </Grid.Cell>
                            </Grid >

                        ))
                    }
                </LegacyStack>
            </Modal.Section>
        </Modal >
    )
}

export default PurchasedItemsModel
