import React, { useState, useCallback, useEffect } from 'react'
import {
    Text, Button, Icon, Grid, Thumbnail, LegacyCard,
    LegacyStack,
    Collapsible,
    TextContainer,
} from "@shopify/polaris";
import { XCircleIcon, PlusIcon, LabelPrinterIcon, ChevronDownIcon } from '@shopify/polaris-icons';

export default function ItemGrid({ orderDetail, product, requestData, variatnsImages, uploadsImages, orderID, getOrder }) {
    const image_urls = JSON.parse(variatnsImages);
    const upload_image = JSON.parse(uploadsImages);
    const itemsById = {};
    const itemCounts = {};
    upload_image.forEach(item => {
        const key = Object.keys(item)[0]; // Get the item ID
        const value = item[key]; // Get the image URL
        if (!itemsById[key]) {
            itemsById[key] = [];
        }
        itemsById[key].push(value);
    });
    for (const key in itemsById) {
        if (itemsById.hasOwnProperty(key)) {
            let keyVariantID = parseInt(key.replace("item_", ""))
            const array = itemsById[key];
            itemCounts[keyVariantID] = array.length;
        }
    }
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    const deleteItem = (variant_id, order_id) => {
        const confirmDelete = confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
            fetch(`/remove-order-item/${order_id}?variant_id=${variant_id}`)
                .then((res) => res.json())
                .then((result) => {
                    if (result.status) {
                        getOrder()
                        alert(result.message)
                    }

                })
        } else {
            // console.log('Deletion cancelled.');
        }
    }
    const handlePrint = (barCode, productTitle, variantSize) => {
        if (barCode !== "") {
            const encodedTitle = encodeURIComponent(productTitle);
            const encodedSize = encodeURIComponent(variantSize);

            fetch(`/bar-code/${barCode}?title=${encodedTitle}&size=${encodedSize}`)
                .then((res) => res.json())
                .then((result) => {
                    if (result.status) {
                        const imageUrl = `data:image/png;base64,${result.data}`;
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
                            <html>
                                <head>
                                    <title>Print Image</title>
                                    <style>
                                    @media print {
                                        body {
                                            margin: 0;
                                            padding: 0;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            height: 100vh;
                                        }
                                        .container {
                                            text-align: center;
                                            padding: 10px;
                                        }
                                        .title {
                                            font-size: 18px;
                                            margin-bottom: 10px;
                                        }
                                        img {
                                            max-width: 100%;
                                            max-height: 100%;
                                            page-break-inside: avoid;
                                        }
                                    }
                                    body {
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        height: 100vh;
                                        margin: 0;
                                    }
                                    .container {
                                        text-align: center;
                                        padding: 10px;
                                    }
                                    .title {
                                        font-size: 18px;
                                        margin-bottom: 10px;
                                    }
                                    img {
                                        max-width: 100%;
                                        max-height: 100%;
                                        page-break-inside: avoid;
                                    }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <div class="title">${productTitle} - ${variantSize}</div>
                                        <div>
                                            <img id="printImage" src="${imageUrl}" />
                                        </div>
                                    </div>
                                </body>
                                <script>
                                    window.onload = function() {
                                        window.print();
                                        window.close();
                                    };
                                </script>
                            </html>
                        `);
                        printWindow.document.close();
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                })
                .catch((error) => {
                    alert('An error occurred while processing the request.');
                });
        } else {
            alert('Invalid barcode');
        }
    };

    return (
        <>
            {
                product.variants.map((variant, inx) => (
                    typeof requestData[variant.id] !== 'undefined' && <><Grid key={inx}>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                            <div className="print-button"><Button onClick={() => handlePrint(variant.barcode, product.title, variant.option1)}><Icon source={LabelPrinterIcon} tone="base" /></Button></div>
                            <Thumbnail
                                className="product-img"
                                source={image_urls[variant.id]}
                                alt={product.title}
                            />
                        </Grid.Cell>
                        <Grid.Cell className="item-content" columnSpan={{ xs: 6, sm: 3, md: 7, lg: 7, xl: 7 }}>
                            <Text variant="headingSm" as="h4"> {product.title}</Text>
                            <Text variant="bodySm">{variant.title}</Text>
                            <Text variant="bodySm">SKU: {variant.sku}</Text>
                            <Text variant="headingSm" as="h6">Return reason: {requestData[variant.id].why_return}</Text> {/* Fixed typo in "reason" */}
                            <Text variant="bodySm">{requestData[variant.id].comments}</Text>
                            <div className="add-images"><Button> <Icon source={PlusIcon} tone="base" /> Add tags or images </Button></div>
                            <div className='cr-order-img'>
                                <LegacyStack vertical>
                                    <Button onClick={handleToggle} ariaExpanded={open} ariaControls="basic-collapsible">
                                        Upload Images ({itemCounts[variant.id]}) <Icon source={ChevronDownIcon} tone="base" />
                                    </Button>
                                    <Collapsible
                                        open={open}
                                        id="basic-collapsible"
                                        transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                                        expandOnPrint
                                    >
                                        <TextContainer>
                                            {Object.entries(itemsById).map(([itemId, images], index) => {
                                                if (parseInt(itemId.replace("item_", "")) === variant.id) {
                                                    return (
                                                        <div key={index} className='cr_order-return-img'>
                                                            {Array.isArray(images) && images.map((imageName, imageIndex) => (
                                                                <a
                                                                    key={imageIndex}
                                                                    href={`../../uploads/${imageName}`}
                                                                    target="_blank"
                                                                    rel={imageName}
                                                                >
                                                                    <img
                                                                        key={imageIndex}
                                                                        src={`../../uploads/${imageName}`}
                                                                        alt={imageName}
                                                                        width="100"
                                                                        height="100"
                                                                    />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                            })}

                                        </TextContainer>
                                    </Collapsible>
                                </LegacyStack>
                            </div>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 2, xl: 2 }}>
                            <Text variant="bodySm">${variant.price} x 1</Text>
                            <div className="delete-item"> <Button disabled={orderDetail.status !== "Pending" && orderDetail.status !== "Received"} onClick={() => { deleteItem(variant.id, orderID) }} icon={XCircleIcon} accessibilityLabel="Add theme" /> </div>
                        </Grid.Cell>
                    </Grid >
                        <hr className="grid-divider" />
                    </>
                ))
            }
        </>
    )
}
