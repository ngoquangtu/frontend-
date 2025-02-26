import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { LIST_ITEMS_PER_PAGE } from "../common/common";
import { faAnglesLeft, faAnglesRight, faArrowDown, faArrowUp, faChevronLeft, faChevronRight,
	faCircleDot, faFilter, faListCheck, faShuffle, faSpinner, faSquareCheck,  faXmark} from "@fortawesome/free-solid-svg-icons";
import { faCircle, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { arrayRange } from "../inc/utils";
import Placeholder from "./Placeholder";


export const FILTER_KEY_DIVIDER = '<divider>';

export type SortKey = string | number;
export type FilterKey = string | number;

export interface SortSettings {
	key: SortKey;
	descendant: boolean;
}

export interface SortOption {
	key: SortKey;
	descendant?: boolean;
	title?: string;
}

export interface StaticListSortOption<ItemInfo> extends SortOption {
	handlerInfo?: {
		field: keyof ItemInfo | ((item: ItemInfo) => any),
		type?: "string" | "number",
	};
	handlerFunc?: (a: ItemInfo, b: ItemInfo) => number;
}

export interface FilterOption {
	key: FilterKey;
	title?: string;
}

export interface StaticListFilterOption<ItemInfo> extends FilterOption {
	handler?: (item: ItemInfo) => boolean;
}

interface GenericListProps {
	dataReady?: boolean;
	itemCount: number;

	paged?: boolean;
	pageItemCount?: number;
	currentPage?: number;
	setCurrentPage?: (page: number) => void;

	sortable?: boolean;
	sortOptions?: SortOption[];
	currentSortSettings?: SortSettings;
	setCurrentSortSettings?: (settings: SortSettings) => void;

	sortAndFilterHandler?: () => void;

	filterable?: boolean;
	filterOptions?: FilterOption[];
	currentFilterKeys?: FilterKey[];
	setCurrentFilterKeys?: (keys: FilterKey[]) => void;

	addtionalNavItems?: ReactNode;
	addtionalHeadItems?: ReactNode;
	addtionalFootItems?: ReactNode;
}

interface StaticListProps<ItemInfo> extends Omit<GenericListProps, "itemCount"> {
	data: ItemInfo[];
	sortOptions?: StaticListSortOption<ItemInfo>[];
	filterOptions?: StaticListFilterOption<ItemInfo>[];
}


export interface DynamicListFetchDataResult<ItemInfo> {
	itemCount: number;
	pageData: ItemInfo[];
}

// paging is required in a dynamic list
interface DynamicListProps<ItemInfo> extends Omit<GenericListProps, "paged" | "dataReady" | "itemCount"> {
	fetchDataHandler: () => Promise<DynamicListFetchDataResult<ItemInfo> | null>;
	currentPage: number;
	setCurrentPage: (page: number) => void;
}



function GenericList({
	dataReady = true,
	itemCount,
	itemsRenderer,

	paged = true,
	pageItemCount = LIST_ITEMS_PER_PAGE,
	currentPage = 0,
	setCurrentPage,

	sortable = false,
	sortOptions,
	currentSortSettings,
	setCurrentSortSettings,

	filterable = false,
	filterOptions,
	currentFilterKeys,
	setCurrentFilterKeys,

	sortAndFilterHandler,

	addtionalNavItems,
	addtionalHeadItems,
	addtionalFootItems,
} : GenericListProps & {
	itemsRenderer: () => ReactNode;
}) {
	useEffect(() => {
		if (sortAndFilterHandler) sortAndFilterHandler();
		if (setCurrentPage) setCurrentPage(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sortable, sortOptions, currentSortSettings, filterable, filterOptions, currentFilterKeys]);


	const pageCount = paged ? Math.floor((itemCount + pageItemCount - 1) / pageItemCount) : 1;

	const pagingBlock = paged &&
		<span className="join">
			<button type="button" className="join-item btn"
				disabled={currentPage === 0}
				onClick={() => setCurrentPage && setCurrentPage(0)}
			>
				<FontAwesomeIcon icon={faAnglesLeft} fixedWidth={true} />
			</button>

			<button type="button" className="join-item btn"
				disabled={currentPage === 0}
				onClick={() => setCurrentPage && setCurrentPage(currentPage > 0 ? currentPage - 1 : 0)}
			>
				<FontAwesomeIcon icon={faChevronLeft} fixedWidth={true} />
			</button>

			<button type="button" className="join-item btn btn-disabled">
				{pageCount > 0 ? currentPage + 1 : '-'} / {pageCount}
			</button>

			<button type="button" className="join-item btn"
				disabled={currentPage >= pageCount - 1}
				onClick={() => setCurrentPage && setCurrentPage(currentPage + 1)}
			>
				<FontAwesomeIcon icon={faChevronRight} fixedWidth={true} />
			</button>

			<button type="button" className="join-item btn"
				disabled={currentPage >= pageCount - 1}
				onClick={() => setCurrentPage && setCurrentPage(pageCount - 1)}
			>
				<FontAwesomeIcon icon={faAnglesRight} fixedWidth={true} />
			</button>
		</span>;

	const sortBlock = sortable && sortOptions &&
		(() => {
			const currentSortOption = currentSortSettings ? sortOptions.find(e => e.key === currentSortSettings.key) : sortOptions[0];

			return <div className="dropdown">
				<div tabIndex={0} role="button" className="btn btn-outline">
					<FontAwesomeIcon icon={faShuffle} fixedWidth={true} />
					<span className="max-sm:hidden">{currentSortOption?.title ?? currentSortOption?.key ?? '<invalid-sort-key>'}</span>
					<FontAwesomeIcon icon={currentSortSettings?.descendant ? faArrowDown : faArrowUp} fixedWidth={true} />
				</div>

				<ul tabIndex={0} className="menu dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow">
					{sortOptions.map(e => <li key={e.key}>
						<button type="button" onClick={() => {
							if (setCurrentSortSettings)
								setCurrentSortSettings({ key: e.key, descendant: (e.key === currentSortOption?.key ? !currentSortSettings?.descendant : e.descendant) ?? false});
						}}>
							<FontAwesomeIcon icon={e.key === currentSortOption?.key ? faCircleDot : faCircle} fixedWidth={true} />
							{e.title ?? e.key}
							<FontAwesomeIcon icon={(e.key === currentSortOption?.key ? currentSortSettings?.descendant : e.descendant) ? faArrowDown : faArrowUp} fixedWidth={true} />
						</button>
					</li>)}
				</ul>
			</div>
		})();

	const filterBlock = filterable && filterOptions &&
		(() => {
			const currentVisibles = filterOptions.filter(e => !currentFilterKeys?.includes(e.key));

			const divider = <li className="border-t-2"></li>;

			return <div className="dropdown">
				<div tabIndex={0} role="button" className="btn btn-outline">
					<FontAwesomeIcon icon={faFilter} fixedWidth={true} />
					{currentVisibles.length === filterOptions.length ? 'Tất cả' :
					currentVisibles.length === 1 ? `${(currentVisibles[0].title ?? currentVisibles[0].key)}` :
					`[${currentVisibles.length}]`}
				</div>

				<ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
					<li>
						<button type="button" onClick={() => setCurrentFilterKeys && setCurrentFilterKeys([])}>
							<FontAwesomeIcon icon={faXmark} fixedWidth={true} /> Chọn hết
						</button>
						<button type="button" onClick={() => setCurrentFilterKeys && setCurrentFilterKeys(filterOptions.map(e => e.key))}>
							<FontAwesomeIcon icon={faListCheck} fixedWidth={true} /> Bỏ hết
						</button>
					</li>

					{divider}

					{filterOptions.map(e => {
						if (e.key === FILTER_KEY_DIVIDER) return divider;
						
						return <li key={e.key}>
							<button type="button" onClick={() => {
								if (!setCurrentFilterKeys) return;

								let newKeys = currentFilterKeys ? [...currentFilterKeys] : [];
								const keyIdx = newKeys.indexOf(e.key);

								if (keyIdx >= 0)
									newKeys.splice(keyIdx, 1);
								else newKeys.push(e.key);

								setCurrentFilterKeys(newKeys);
							}}>
								<FontAwesomeIcon icon={currentFilterKeys?.includes(e.key) ? faSquare : faSquareCheck} fixedWidth={true} />
								{e.title ?? e.key}
							</button>
						</li>
					})}
				</ul>
			</div>
		})();

	const nav = (pagingBlock || sortBlock || filterBlock || addtionalNavItems) &&
		<div className="flex gap-2">
			{pagingBlock}
			{sortBlock}
			{filterBlock}
			{addtionalNavItems}
		</div>;

	return <div>
		{nav}
		{addtionalHeadItems}
		{dataReady ? itemsRenderer() : <Placeholder /> }
		{addtionalFootItems}
	</div>
}




export function StaticList<ItemInfo extends Object>({
	data,
	itemRenderer,

	paged = true,
	currentPage = 0,
	pageItemCount = LIST_ITEMS_PER_PAGE,

	sortOptions,
	currentSortSettings,
	
	filterOptions,
	currentFilterKeys,

	...otherProps
} : StaticListProps<ItemInfo> & {
	itemRenderer: (item: ItemInfo, idx: number) => ReactNode;
}) {
    const [frontData, setFrontData] = useState<ItemInfo[]>(data);

	const genericSortOptions = useMemo(() => sortOptions?.map(e => ({
		key: e.key,
		descendant: e.descendant,
		title: e.title
	})), [sortOptions]);

	const genericFilterOptions = useMemo(() => filterOptions?.map(e => ({
		key: e.key,
		title: e.title
	})), [filterOptions]);

	const sortAndFilterHandler = useCallback(() => {
		let ret = [...data];

		currentFilterKeys?.forEach(fk => {
			const filterOption = filterOptions?.find(e => e.key === fk);
			if (filterOption?.handler) ret = ret.filter(e => filterOption.handler && filterOption.handler(e));
		});

		if (currentSortSettings) {
			const sortOption = sortOptions?.find(e => e.key === currentSortSettings.key);
			if (ret.length > 0 && sortOption) {
				let sortFunc: ((a: ItemInfo, b: ItemInfo) => number) | null = null;

				if (sortOption.handlerInfo) {
					let type: 'string' | 'number' | 'date' | null = null;

					let accessor: ((item: ItemInfo) => any) =
						(sortOption.handlerInfo.field instanceof Function) ?
						sortOption.handlerInfo.field :
						(anItem) => anItem[sortOption.handlerInfo?.field as keyof ItemInfo];

					if (sortOption.handlerInfo.type === 'string') type = 'string';
					else if (sortOption.handlerInfo.type === 'number') type = 'number';
					else if (sortOption.handlerInfo.type === 'date') type = 'date';
					else {
						let aField = accessor(ret[0]);
						if (typeof aField === 'string') type = 'string';
						else if (typeof aField === 'number') type = 'number';
						else if (aField instanceof Date) type = 'date';
					}

					switch (type) {
						case 'string':
							sortFunc = (a, b) => accessor(a).localeCompare(accessor(b));
							break;
						case 'number':
							sortFunc = (a, b) => accessor(a) - accessor(b);
							break;
						case 'date':
							sortFunc = (a, b) => accessor(a).valueOf() - accessor(b).valueOf();
							break;
					}
				} else {
					sortFunc = sortOption.handlerFunc ?? null;
				}

				if (!sortFunc) {
					if (process.env.NODE_ENV === 'development') {
						console.log('Invalid list sort handler');
						console.trace();
					}
				} else {
					const sign = currentSortSettings.descendant ? -1 : 1;
					ret.sort((a, b) => (sortFunc && sortFunc(a, b) * sign) ?? 0);
				}
			}
		}

		setFrontData(ret);
	}, [sortOptions, currentSortSettings, filterOptions, currentFilterKeys, data]);

	// eslint-disable-next-line
	useEffect(sortAndFilterHandler, [data]);

	return <GenericList
		itemCount={frontData.length}
		itemsRenderer={() => {
			const itemCount = frontData.length;

			const visibleItemsIdx: number[] =
				paged ? arrayRange(currentPage * pageItemCount, Math.min(itemCount - 1, (currentPage + 1) * pageItemCount - 1), 1) :
				arrayRange(0, itemCount - 1, 1);

			if (visibleItemsIdx.length === 0) {
				return <div className="bg-gray-900 rounded-lg mt-4 p-4">Không có mục nào trong danh sách.</div>;
			}

			return visibleItemsIdx.map(idx => itemRenderer(frontData[idx], idx));
		}}

		paged={paged}
		currentPage={currentPage}
		pageItemCount={pageItemCount}

		sortOptions={genericSortOptions}
		currentSortSettings={currentSortSettings}

		filterOptions={genericFilterOptions}
		currentFilterKeys={currentFilterKeys}

		sortAndFilterHandler={sortAndFilterHandler}

		{...otherProps}
	/>
}




export function DynamicList<ItemInfo>({
	fetchDataHandler,
	itemRenderer,

	pageItemCount = LIST_ITEMS_PER_PAGE,
	currentPage,
	currentSortSettings,
	currentFilterKeys,

	addtionalNavItems,

	...otherProps
} : DynamicListProps<ItemInfo> & {
	itemRenderer: (item: ItemInfo, idx: number) => ReactNode;
}) {
	const [fetchingDataCounter, setFetchingDataCounter] = useState<number>(0);
	const [data, setData] = useState<{itemCount: number, pageData: ItemInfo[]} | null>(null);

	useEffect(() => {
		setFetchingDataCounter(v => v + 1);

		fetchDataHandler().then(ret => {
			setData(ret);
			setFetchingDataCounter(v => v - 1);
		});

		// eslint-disable-next-line
	}, [currentPage, currentSortSettings, currentFilterKeys]);

	return <GenericList
		dataReady={data?.pageData != null}
		itemCount={data?.itemCount ?? 0}
		itemsRenderer={() => {
			if (!data?.pageData && data?.pageData.length === 0) {
				return <div className="bg-gray-900 rounded-lg mt-4 p-4">Không có mục nào trong danh sách.</div>;
			}

			const firstIdx = currentPage * pageItemCount;
			return data?.pageData?.map((item, idxInPage) => itemRenderer(item, firstIdx + idxInPage));
		}}

		paged={true}
		pageItemCount={pageItemCount}
		currentPage={currentPage}
		currentSortSettings={currentSortSettings}
		currentFilterKeys={currentFilterKeys}

		addtionalNavItems={<>
			{fetchingDataCounter > 0 &&
				<span className="items-center flex">
					<FontAwesomeIcon icon={faSpinner} spin={true} fixedWidth={true} />
				</span>}

			{addtionalNavItems}
		</>}

		{...otherProps}
	/>
}
