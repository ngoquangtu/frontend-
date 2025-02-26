


interface ItemInfo {
	key: string;
	value: any;
}

// export function InfoList({list}: {list: ItemInfo[]}) {
// 	return <>
// 		{list.map((item, idx) =>
// 			<div className="flex flex-col sm:flex-row mt-4" key={idx}>
// 				<span className="sm:w-1/4 font-bold">{item.key}:</span>
// 				<span className="sm:w-3/4 pl-2 sm:pl-0">{item.value ?? '-'}</span>
// 			</div>)}
// 	</>
// }

export function InfoList({ list }: { list: ItemInfo[] }) {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap">
                {list.map((item, idx) => (
                    <div key={idx} className="flex items-center mr-6 mb-2">
                        <span className="font-bold">{item.key}:</span>
                        <span className="ml-2">{item.value ?? '-'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}