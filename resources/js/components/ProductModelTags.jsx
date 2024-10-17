import React, { useState, useCallback, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { Page, TextField, Badge, Spinner, Layout, ResourceList, Thumbnail, ResourceItem, LegacyCard, Text, ChoiceList, Button, Modal, LegacyStack, TextContainer, ActionList, Popover, Icon, Grid, List } from "@shopify/polaris";
const ProductModelTags = ({ show, setShowModal, productData, selectedResources }) => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [productTags, setProductTags] = useState('');
    const handleProductTagChange = useCallback((value) => setProductTags(value), []);
    const filteredProducts = productData
        .filter(product => selectedResources.includes(product.id))
        .map(product => ({ id: product.id, title: product.title }));

    const addProductsTags = () => {
        setLoader(true);
        fetch("/add-product-tag", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                shop: Config.shop,
                tag: productTags,
                product: filteredProducts
            })
        }).then((res) => res.json())
            .then((response) => {
                if (response.status) {
                    setShowModal(false);
                    navigate('/page/product')
                    shopify.toast.show(result.message, { duration: 2000 });
                } else {
                    shopify.toast.show(result.message, { duration: 2000, isError: !result.status });
                }
            });
    }
    return (
        <div>
            <Modal
                open={show}
                onClose={() => {
                    setShowModal(false)
                    setProductTags("")
                }}
                title="Add Product Tag"
                primaryAction={{
                    content: 'Add Tag',//loader ? <Spinner size="small" /> : 'Add Tag',
                    onAction: () => { addProductsTags() },
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => {
                            setShowModal(false)
                            setProductTags("")
                        },
                    },
                ]}
            >
                <Modal.Section>

                    <LegacyStack vertical>
                        <LegacyStack.Item>
                            <TextField
                                value={productTags}
                                onChange={handleProductTagChange}
                                label="Product Tag"
                                type="text"
                                autoComplete="off"
                            />
                        </LegacyStack.Item>
                    </LegacyStack>
                </Modal.Section>
            </Modal>
        </div>
    )
}

export default ProductModelTags
