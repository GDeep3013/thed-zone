import React, { useState, useCallback, useEffect, useRef } from 'react'
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
    FormLayout,
    Pagination,
    Button,
    Thumbnail
} from '@shopify/polaris';
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from '@shopify/polaris-icons';
const AddTags = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState([]);
    const [blockList, setBlockList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loader, setLoader] = useState(true);
    const openModal = () => { setShowModal(true) }
    const closeModal = () => { setShowModal(false) }
    /* start pagination  */
    const [nextPage, setNextPage] = useState("");
    const [pageRel, setPageRel] = useState("");
    const [prevPage, setPrevPage] = useState("");
    const [page, setPage] = useState("");
    const [lastPage, setLastPage] = useState(1);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const [itemStrings, setItemStrings] = useState(['All']);
    const tabs = itemStrings.map((item, index) => ({
        content: item,
        onAction: () => { },
        // id: `${item}-${index}`,
        // isLocked: index === 0,
        // actions:
        //   index === 0
        //     ? []
        //     : [
        // {
        //   type: 'rename',
        //   onAction: () => { },
        //   onPrimaryAction: async (value) => {
        //     const newItemsStrings = tabs.map((item, idx) => {
        //       if (idx === index) {
        //         return value;
        //       }
        //       return item.content;
        //     });
        //     await sleep(1);
        //     setItemStrings(newItemsStrings);
        //     return true;
        //   },
        // },
        // {
        //   type: 'duplicate',
        //   onPrimaryAction: async (value) => {
        //     await sleep(1);
        //     duplicateView(value);
        //     return true;
        //   },
        // },
        // {
        //   type: 'edit',
        // },
        // {
        //   type: 'delete',
        //   onPrimaryAction: async () => {
        //     await sleep(1);
        //     deleteView(index);
        //     return true;
        //   },
        // },
        // ],
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

    const handleAccountStatusChange = useCallback((value) => setAccountStatus(value), []);
    const handleMoneySpentChange = useCallback((value) => setMoneySpent(value), []);
    const handleTaggedWithChange = useCallback((value) => setTaggedWith(value), []);
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

    const appliedFilters =
        taggedWith && !isEmpty(taggedWith)
            ? [
                {
                    key: 'taggedWith',
                    label: disambiguateLabel('taggedWith', taggedWith),
                    onRemove: handleTaggedWithRemove,
                },
            ]
            : [];

    useEffect(() => {
        getAllProducts()
    }, [page, pageRel])

    const getAllProducts = async () => {
        setLoader(false);
        fetch(`/products?shop=${Config.shop}&page=${page}&rel=${pageRel}`)
            .then((res) => res.json())
            .then((result) => {
                setLoader(true);
                if (result.status) {
                    let newProducts = result.data.products;
                    setProductData(newProducts);
                    setBlockList(result.blockList);
                    if (result.next.page_info !== "") {
                        setNextPage(result.next.page_info);
                    }
                    if (result.previous.page_info !== "") {
                        setPrevPage(result.previous.page_info)
                    }
                }
            })
    }
    const promotedBulkActions = [
        {
            content: 'Add Tags',
            onAction: () => { openModal() },
        },

    ];
    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(productData, {resourceFilter: ({disabled}) => !disabled});

    const rowMarkup = productData && productData.map(({ id, title, image }, index) => {
        let productIndex = selectedResources.indexOf(id);
        const isBlocked = blockList.includes(id);
    
        // Conditionally handle selection and avoid direct manipulation of selectedResources during rendering
        // const isSelected = isBlocked ? (selectedResources.splice(productIndex, 1), false) : selectedResources.includes(id);
    
        return (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
                onClick={() => { console.log("Row Click") }}
                disabled={blockList.includes(id)}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        <Thumbnail size="extraSmall" source={image.src} alt="product-image" />
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{title}</IndexTable.Cell>
                <IndexTable.Cell>
                    {isBlocked ? (
                        <Button
                            icon={DeleteIcon}
                            accessibilityLabel="Remove theme"
                            tone="critical"
                            onClick={() => {
                                handleDeleteTags(id)
                            }}
                        />
                    ) : null}
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    });
    const handleDeleteTags = (id) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the tag?`);
        if (isConfirmed) {
            setLoader(false)
            fetch(`/delete-tag/${id}?shop=${Config.shop}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())// or res.json()
                .then((result) => {
                    setLoader(true)
                    if (result.status) {
                        if (result.status) {
                            shopify.toast.show(result.message, { duration: 2000 });
                            getAllProducts();
                        } else {
                            shopify.toast.show(result.message, { duration: 2000, isError: !result.status });
                        }
                    }
                })
        }
    }
    return (
        <div>
            <Page
                backAction={{ content: 'Settings', onAction: (() => { navigate('/page/product'); }) }}
                title="Add Tag"
            // primaryAction={<Button variant="primary">Save</Button>}
            >
                <LegacyCard>
                    <IndexFilters
                        // sortOptions={sortOptions}
                        // sortSelected={sortSelected}
                        queryValue={queryValue}
                        queryPlaceholder="Searching in all"
                        onQueryChange={handleQueryValueChange}
                        onQueryClear={() => setQueryValue('')}
                        // onSort={setSortSelected}
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
                        appliedFilters={appliedFilters}
                        onClearAll={handleFiltersClearAll}
                        mode={mode}
                        setMode={setMode}
                    />
                    <IndexTable
                        // condensed={useBreakpoints().smDown}
                        resourceName={{ singular: 'product', plural: 'products' }}
                        itemCount={productData.length}
                        selectedItemsCount={
                            allResourcesSelected ? 'All' : selectedResources.length
                        }
                        onSelectionChange={handleSelectionChange}
                        headings={[
                            { title: 'Image' },
                            { title: 'Product' },
                            { title: "Action" }
                        ]}
                        // bulkActions={bulkActions}
                        promotedBulkActions={promotedBulkActions}
                        pagination={{
                            hasPrevious: true,
                            onPrevious: () => {
                                if (prevPage != "") {
                                    setPageRel('previous')
                                    setPage(prevPage);
                                }

                            },
                            hasNext: true,
                            onNext: () => {
                                if (nextPage != "") {
                                    setPageRel('next')
                                    setPage(nextPage);
                                }
                            },
                        }}
                        loading={!loader}
                    >
                        {loader && rowMarkup}
                    </IndexTable>
                </LegacyCard>
            </Page>
        </div>
    )
}

export default AddTags
