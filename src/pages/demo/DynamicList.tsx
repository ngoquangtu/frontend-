import { useState } from 'react';
import Page from '../../components/Page';
import { DynamicList, DynamicListFetchDataResult, FILTER_KEY_DIVIDER, FilterKey, FilterOption, SortOption, SortSettings } from '../../components/List';
import { arrayRange } from '../../inc/utils';
import { LIST_ITEMS_PER_PAGE } from '../../common/common';


interface ItemInfo {
    id: number;
	title: string;
	value1: number;
	value2: number;
	info: string;
}

const shadowData = arrayRange(1, 250).map(idx => ({
	id: idx,
    title: `Item ${idx}`,
    value1: Math.round((Math.random() * 1000)),
    value2: Math.round((Math.random() * 1000)),
    info: `This is item #${idx}`
}));


function filterAndSort(sortSettings: SortSettings, filterKeys: FilterKey[]): ItemInfo[] {
	let ret = [...shadowData];

	filterKeys.forEach(fk => {
		switch(fk) {
			case 'value1-odd':
				ret = ret.filter(e => e.value1 % 2 !== 1);
				break;
			case 'value1-even':
				ret = ret.filter(e => e.value1 % 2 !== 0);
				break;
			case 'value2-odd':
				ret = ret.filter(e => e.value2 % 2 !== 1);
				break;
			case 'value2-even':
				ret = ret.filter(e => e.value2 % 2 !== 0);
				break;
		}
	});

	const sign = sortSettings.descendant ? -1 : 1;
	switch (sortSettings.key) {
		case 'title':
			ret.sort((a, b) => a.title.localeCompare(b.title) * sign);
			break;
		case 'value1':
			ret.sort((a, b) => Math.sign(a.value1 - b.value1) * sign);
			break;
		case 'value2':
			ret.sort((a, b) => Math.sign(a.value2 - b.value2) * sign);
			break;
	}

	return ret;
}



const sortOptions: SortOption[] = [
    { key: 'title', title: 'Tiêu đề', descendant: false },
    { key: 'value1', title: 'Giá trị 1', descendant: false },
    { key: 'value2', title: 'Giá trị 2', descendant: true },
];

const filterOptions: FilterOption[] = [
    { key: 'value1-odd', title: 'Odd value1' },
    { key: 'value1-even', title: 'Even value1' },
	{ key: FILTER_KEY_DIVIDER },
    { key: 'value2-odd', title: 'Odd value2' },
    { key: 'value2-even', title: 'Even value2' },
];


// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
    const [page, setPage] = useState(0);
    const [sortSettings, setSortSettings] = useState<SortSettings>({ key: 'title', descendant: false });
    const [filterKeys, setFilterKeys] = useState<FilterKey[]>([]);

    return <Page title="DynamicList demo">
        <DynamicList
			fetchDataHandler={async () => {
				return await new Promise<DynamicListFetchDataResult<ItemInfo>>(resolve => {
					setTimeout(() => {
						const fd = filterAndSort(sortSettings, filterKeys);
				
						const minIdx = page * LIST_ITEMS_PER_PAGE;
						const pd = arrayRange(minIdx, Math.min(fd.length - 1, minIdx + LIST_ITEMS_PER_PAGE - 1), 1).map(e => fd[e]);
				
						resolve({
							itemCount: fd.length,
							pageData: pd
						});
					}, 500);
				});
			}}

            itemRenderer={(item) =>
				<div className='alert my-2' key={item.id}>
					<h3 className='font-bold'>{item.title}</h3>
					<p>Value 1: {item.value1}</p>
					<p>Value 2: {item.value2}</p>
					<p>Info: {item.info}</p>
				</div>
			}

            currentPage={page}
            setCurrentPage={setPage}

            sortable={true}
            sortOptions={sortOptions}
            currentSortSettings={sortSettings}
            setCurrentSortSettings={setSortSettings}

            filterable={true}
            filterOptions={filterOptions}
            currentFilterKeys={filterKeys}
            setCurrentFilterKeys={setFilterKeys}
        />
    </Page>
}

