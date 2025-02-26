import { ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

import 'react-toastify/dist/ReactToastify.css';




export function SectionTitle({
	children
} : {
	children: ReactNode;
}) {
	return <h3 className="text-2xl font-bold text-accent mt-6">
		{children}
	</h3>
}



export function TextLink(props: LinkProps) {
	return <Link className="underline text-accent cursor-pointer" {...props} />
}



export function CopyToClipboardButton({
	content,
	className = ''
} : {
	content: string | number;
	className?: string;
}) {
    return (
		<button type="button" className={`btn ${className}`}
			onClick={() => {
				navigator.clipboard.writeText(content.toString());
				toast('Đã lưu nội dung vào clipboard.');
			}}
		>
        	<FontAwesomeIcon icon={faClipboard} />
		</button>
    )
}




