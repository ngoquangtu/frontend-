import { useEffect, useState } from 'react';
import Page from '../../components/Page';
import { FILTER_KEY_DIVIDER, FilterKey, FilterOption, SortOption, SortSettings, StaticList, StaticListFilterOption, StaticListSortOption } from '../../components/List';
import { arrayRange } from '../../inc/utils';



interface ItemInfo {
    id: number;
	title: string;
	value1: number;
	value2: number;
	info: string;
    compound: {
        sub1: string;
        sub2: number;
    }
}

const shadowData: ItemInfo[] = arrayRange(1, 250).map(idx => ({
    id: idx,
    title: `Item ${idx}`,
    value1: Math.round((Math.random() * 1000)),
    value2: Math.round((Math.random() * 1000)),
    info: `This is item #${idx}`,
    compound: {
        sub1: `Sub1: ${Math.round(Math.random() * 1000)}`,
        sub2: Math.round(Math.random() * 1000)
    }
}));

const sortOptions: StaticListSortOption<ItemInfo>[] = [
    { key: 'title', title: 'Tiêu đề',
        handlerInfo: { field: 'title' } },
    { key: 'value1', title: 'Giá trị 1',
        handlerInfo: { field: 'value1' } },
    { key: 'value2', title: 'Giá trị 2', descendant: true,
        handlerInfo: { field: 'value2' } },
    { key: 'compound.sub1', title: 'Compound -> sub1',
        handlerInfo: { field: item => item.compound.sub1 } },
    { key: 'compound.sub2', title: 'Compound -> sub2',
        handlerInfo: { field: item => item.compound.sub2 } },
];

const filterOptions: StaticListFilterOption<ItemInfo>[] = [
    { key: 'value1-odd', title: 'Odd value1',
        handler: item => item.value1 % 2 !== 1 },
    { key: 'value1-even', title: 'Even value1',
        handler: item => item.value1 % 2 !== 0 },
	{ key: FILTER_KEY_DIVIDER },
    { key: 'value2-odd', title: 'Odd value2',
        handler: item => item.value2 % 2 !== 1 },
    { key: 'value2-even', title: 'Even value2',
        handler: item => item.value2 % 2 !== 0 },
];


// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
    const [page, setPage] = useState(0);
    const [sortSettings, setSortSettings] = useState<SortSettings>({ key: 'title', descendant: false });
    const [filterKeys, setFilterKeys] = useState<FilterKey[]>([]);

    return <Page title="StaticList demo">
        <StaticList<ItemInfo>
            data={shadowData}
            itemRenderer={(item) => <div className='alert my-2' key={item.id}>
                <h3 className='font-bold'>{item.title}</h3>
                <p>Value 1: {item.value1}</p>
                <p>Value 2: {item.value2}</p>
                <p>Info: {item.info}</p>
                <p>Compound: {item.compound.sub1}, {item.compound.sub2}</p>
            </div>}

            currentPage={page}
            setCurrentPage={setPage}

            sortable={true}
            sortOptions={sortOptions}
            currentSortSettings={sortSettings}
            setCurrentSortSettings={s => setSortSettings(s)}

            filterable={true}
            filterOptions={filterOptions}
            currentFilterKeys={filterKeys}
            setCurrentFilterKeys={setFilterKeys}
        />
    </Page>
}

