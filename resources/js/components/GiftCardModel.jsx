import React, { useState, useCallback, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { Page, TextField, Badge, Spinner, Layout, ResourceList, Thumbnail, ResourceItem, LegacyCard, Text, ChoiceList, Button, Modal, LegacyStack, TextContainer, ActionList, Popover, Icon, Grid, List } from "@shopify/polaris";


const GiftCardModel = ({ show, setOpen, customerID }) => {
    const [giftCard, setGiftCard] = useState(null);

    const getGiftCard = async () => {
        setGiftCard(null);
        if (customerID) {
            try {
                const response = await fetch(`/gift_card/${customerID}?shop=${Config.shop}`);
                const result = await response.json();
                if (result.status) {
                    if (typeof data != null) {
                        setGiftCard(result.data);
                    }
                } else {
                    setGiftCard(null);
                }
            } catch (error) {
                console.error("Error fetching gift card:", error);
                setGiftCard(null);
            }
        }
    }

    useEffect(() => {
        if (show) {
            getGiftCard();
        }
    }, [show, customerID]);

    return (
        <Modal
            open={show}
            onClose={() => setOpen(false)}
            title="Gift Card"
            secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: () => setOpen(false),
                },
            ]}
        >
            <Modal.Section>
                <LegacyStack vertical>
                    {giftCard ? (
                        <>
                            <Text variant="headingLg" as="h5">{`Gift card value: $${giftCard.balance}`}</Text>
                            <Text variant="heading3xl" as="h2">{ giftCard.code.toUpperCase()}</Text>
                        </>
                    ) : (
                        <Text variant="headingXl" as="h4">Gift Card Not Available</Text>
                    )}
                </LegacyStack>
            </Modal.Section>
        </Modal>
    );
}

export default GiftCardModel;
