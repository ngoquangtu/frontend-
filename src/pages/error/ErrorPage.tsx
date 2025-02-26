import { ReactNode } from "react";
import { faWarning, faBomb, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Page from "../../components/Page";


export enum ErrorLevels {
	ERROR,
	WARNING,
	INFO,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function({level = ErrorLevels.ERROR, children}: {level?: ErrorLevels, children: ReactNode}) {
	const levelStyle = {
		[ErrorLevels.ERROR]: {
			title: 'Lỗi',
			className: 'alert-error',
			icon: faBomb
		},
		[ErrorLevels.WARNING]: {
			title: 'Cảnh báo',
			className: 'alert-warning',
			icon: faWarning
		},
		[ErrorLevels.INFO]: {
			title: 'Thông báo',
			className: 'alert-info',
			icon: faInfo
		},
	}[level];

	return <Page title={levelStyle.title}>
		<div className={`alert ${levelStyle.className}`}>
			<FontAwesomeIcon icon={levelStyle.icon} className="h-8 w-8" />
			{children}
		</div>
	</Page>
}



