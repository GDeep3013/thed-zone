import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
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
    Select,
    Modal,
    Button
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';

const ProductTags = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const [deleteLoader, setDeleteLoader] = useState(true);
    const [productBlockList, setProductBlockList] = useState([]);
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
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const [itemStrings, setItemStrings] = useState(['All']);
    const tabs = itemStrings.map((item, index) => ({
        content: item,
        onAction: () => { },

    }));
    const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
    const onHandleCancel = () => { };
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState(undefined);
    const handleQueryValueChange = useCallback((value) => { setQueryValue(value) }, []);

    const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleFiltersClearAll = useCallback(() => {
        handleTaggedWithRemove();
        handleQueryValueRemove();
    }, [
        handleQueryValueRemove,
        handleTaggedWithRemove,
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
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate);
        const optionsTime = { hour: '2-digit', minute: '2-digit' };
        const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

        return `${formattedDate}, ${formattedTime}`;
    };

    const getBlockListProduct = async (page, queryValue) => {
        setLoader(false);
        fetch(`/get-block-list?shop=${Config.shop}&page=${page}&search=${queryValue}`)
            .then((res) => res.json())
            .then((result) => {
                setLoader(true);
                if (result.status) {
                    setProductBlockList(result.data.data);
                    setPage(result.data.current_page);
                    setLastPage(result.data.last_page);

                }
            })
    }
    useEffect(() => {
        getBlockListProduct(page, queryValue)
    }, [page, queryValue])

    const handleDeleteTags = (id) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the tag?`);
        if (isConfirmed) {
            setLoader(false)
            fetch(`/delete-block-list/${id}?shop=${Config.shop}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())// or res.json()
                .then((result) => {
                    setLoader(true)
                    if (result.status) {
                        if (result.status) {
                            shopify.toast.show(result.message, { duration: 2000 });
                            getBlockListProduct(page, queryValue);
                        } else {
                            shopify.toast.show(result.message, { duration: 2000, isError: !result.status });
                        }
                    }
                })
        }
    }

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(productBlockList);
    const rowMarkup = productBlockList && productBlockList.map(({ id, tags, tags_type, created_at }, index,) => (
        <IndexTable.Row
            id={id}
            key={id}
            selected={selectedResources.includes(id)}
            position={index}
        >
            <IndexTable.Cell><Text variant="bodyMd" fontWeight="bold" as="span">{tags}</Text></IndexTable.Cell>
            <IndexTable.Cell>{formatDateTime(created_at)}</IndexTable.Cell>
            <IndexTable.Cell> <Badge>{tags_type}</Badge></IndexTable.Cell>
            <IndexTable.Cell><Button icon={DeleteIcon} accessibilityLabel="Delete theme" onClick={() => { handleDeleteTags(id) }} /></IndexTable.Cell>
        </IndexTable.Row>
    ),
    );

    return (
        <div class="cr-page-block-list">
            <Page
                title="Blocklist"
                primaryAction={{
                    content: 'Add Listing',
                    onAction: () => { navigate('/page/add-tag') },
                }}
                fullWidth
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
                        // appliedFilters={appliedFilters}
                        onClearAll={handleFiltersClearAll}
                        mode={mode}
                        setMode={setMode}
                    />
                    <IndexTable
                        resourceName={{ singular: 'product', plural: 'products' }}
                        itemCount={productBlockList.length}
                        selectedItemsCount={
                            allResourcesSelected ? 'All' : selectedResources.length
                        }
                        onSelectionChange={handleSelectionChange}
                        headings={[
                            { title: 'Value' },
                            { title: 'Date' },
                            { title: 'Type' },
                            { title: 'Action' },
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
                        selectable={false}
                    >
                        {loader && rowMarkup}
                    </IndexTable>
                </LegacyCard>
            </Page>
        </div>
    )
}

export default ProductTags
