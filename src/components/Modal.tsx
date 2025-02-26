import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormikConfig, FormikProps, FormikValues, useFormik } from "formik";
import { DateTime } from "luxon";
import { HTMLInputTypeAttribute, ReactNode, useEffect, useRef } from "react"

import DatePicker, { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { makeUniqueNumber } from "../inc/utils";



interface GenericModalProps {
	title: string;
	id?: string;
	show: boolean;
	backdrop?: boolean;
	closeOnClickBackdrop?: boolean;
	handleClose: () => void;
	onShow?: (show: boolean) => void;
	actions?: ReactNode[];

	boxClasses?: string;
}

interface ModalProps extends GenericModalProps {
}


interface ModalWithFormProps<FormFields> extends ModalProps {
	submitBtnTitle: string;
	initialValues?: FormFields;
	formikConfig?: FormikConfig<FormFields>;
}



function GenericModal(	{
	title,
	id,
	show,
	backdrop = true,
	closeOnClickBackdrop = false,
	handleClose,
	onShow,
	children,

	boxClasses = '',
} : ModalProps & {
	children?: ReactNode;
}) {
	const dlg = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (show) {
			(dlg.current?.querySelector('.modal-body')?.querySelector('input, textarea, select, button') as HTMLElement)?.focus();
		}

		if (onShow) onShow(show);
	}, [show, onShow]);

	return <dialog id={id ?? 'default-modal-id'} className={`modal ${backdrop ? 'backdrop-brightness-50' : ''}`} open={show} onCancel={handleClose} ref={dlg}>
		<div className={['modal-box', boxClasses].join(' ')}>
			<button className="btn btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
				<FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
			</button>

			<h3 className="font-bold text-lg">{title}</h3>

			<div className="modal-body">
				{children}
			</div>
		</div>

		{backdrop && <div className="modal-backdrop" onClick={closeOnClickBackdrop ? handleClose : undefined} />}
	</dialog>
}


export function Modal(	{
	handleClose,
	actions = [],
	children,
	...otherProps
} : ModalProps & {
	children?: ReactNode;
}) {
	return <GenericModal handleClose={handleClose} {...otherProps}>
		{children}

		<div className="modal-action">
			{actions}

			<button type="button" className="btn" onClick={handleClose}>Đóng</button>
		</div>
	</GenericModal>
}


export function ModalWithForm<FormFields extends FormikValues>({
	show,
	handleClose,
	actions = [],
	children,

	submitBtnTitle,
	initialValues,
	formikConfig,

	...otherProps
} : ModalWithFormProps<FormFields> & {
	children: (formik: FormikProps<FormFields>) => ReactNode;
	formikConfig: FormikConfig<FormFields>;
}) {
	const formik = useFormik<FormFields>({
		validateOnBlur: false,
		validateOnChange: false,
		...formikConfig
	});

	useEffect(() => {
		if (initialValues) formik.setValues(initialValues);
		// eslint-disable-next-line
	}, [initialValues]);

	useEffect(() => {
		if (show && initialValues) formik.setValues(initialValues);
		// eslint-disable-next-line
	}, [show]);

    const errors = Object.values(formik.errors);

	return <GenericModal show={show} handleClose={handleClose} {...otherProps}>
		<form className="text-left" onSubmit={formik.handleSubmit}>
			{children(formik)}

			{errors.length > 0 && <div className="alert alert-error mt-4">
				<div>
					{errors.map((err, idx) => <div key={idx}>{err}</div>)}
				</div>
			</div>}

			<div className="modal-action">
				{actions}
				<button type="submit" className="btn btn-primary mr-2" disabled={formik.isSubmitting}>
					{formik.isSubmitting && <span className="loading loading-spinner"></span>}
					{submitBtnTitle}
				</button>

				<button type="button" className="btn" onClick={handleClose}>Đóng</button>
			</div>
		</form>
	</GenericModal>
}




interface CommonFormFieldProps<FormFields> {
	formik: FormikProps<FormFields>;
	name?: keyof FormFields;
	label: string | ReactNode;
	labelControls?: ReactNode;
	onChange?: (evt: React.ChangeEvent<any>) => void;
	onBlur?: (e: React.FocusEvent<any>) => void;
	readOnly?: boolean;
}


export function ModalFormInputLabel({
	inputId,
	label,
	labelControls,
} : {
	inputId: string;
	label: string | ReactNode;
	labelControls?: ReactNode;
}) {
	return <span className="label mt-2 text-base label-text">
		<label htmlFor={inputId}>{label}</label>
		{labelControls && <span>{labelControls}</span>}
	</span>
}

export function ModalFormInput<FormFields>({
	formik,
	name,
	label,
	labelControls,
	size = 'input-md',
	type = 'text',
	onChange = formik.handleChange,
	onBlur = formik.handleBlur,
	...otherProps
} : CommonFormFieldProps<FormFields> & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size'> & {
	type?: HTMLInputTypeAttribute;
	size?: 'input-lg' | 'input-sm' | 'input-md' | 'input-xs';
}) {
	const id = '__modal-input-' + makeUniqueNumber();

	return <div>
		<ModalFormInputLabel inputId={id} label={label} labelControls={labelControls} />

		<input id={id} type={type} name={name as string} className={`input input-bordered w-full ${size}`}
			onChange={onChange} onBlur={onBlur} value={name ? formik.values[name] as any : undefined}
			{...otherProps}
		/>
	</div>
}




export function ModalFormFileInput<FormFields>({
	formik,
	name,
	label,
	labelControls,
	size = 'file-input-md',
	onChange = formik.handleChange,
	onBlur = formik.handleBlur,
	...otherProps
} : CommonFormFieldProps<FormFields> & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size'> & {
	size?: 'file-input-lg' | 'file-input-sm' | 'file-input-md' | 'file-input-xs';
}) {
	const ref = useRef<HTMLInputElement | null>(null);
	const id = '__modal-input-' + makeUniqueNumber();

	// In Chrome, the file input `cancel` event bubbles up to the dialog and it mistakenly causes the dialog to close. This workaround is to prevent this behaviour.
	useEffect(() => {
		ref.current?.addEventListener('cancel', evt => {
			evt.stopPropagation();
			return true;
		});
		// eslint-disable-next-line
	}, [ref.current]);

	return <div>
		<ModalFormInputLabel inputId={id} label={label} labelControls={labelControls} />

		<input type='file' id={id} name={name as string} className={`file-input file-input-bordered w-full ${size}`}
			onChange={onChange} onBlur={onBlur} value={name ? formik.values[name] as any : undefined}
			{...otherProps}
			ref={ref}
		/>
	</div>
}



type DateRangePickerValue = [DateTime, DateTime];

export function ModalFormDateRangePicker<FormFields>({
	formik,
	name,
	label,
	labelControls,
	size = 'input-md',
	onChange = formik.handleChange,
	onBlur = formik.handleBlur,
	selectsMultiple = true,	// for some reason, this line must be present to avoid error!
	...otherProps
} : CommonFormFieldProps<FormFields> & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size'> & DatePickerProps & {
	size?: 'input-lg' | 'input-sm' | 'input-md' | 'input-xs';
}) {
	const value = name ? formik.values[name] as DateRangePickerValue : undefined;
	const id = '__modal-input-' + makeUniqueNumber();

	return <div>
		<ModalFormInputLabel inputId={id} label={label} labelControls={labelControls} />

		<DatePicker id={id} name={name as string} className={`w-full input input-bordered ${size}`}
			wrapperClassName='w-full'
			selectsRange={true}
			startDate={(value && value[0].isValid) ? value[0].toJSDate() : undefined}
			endDate={(value && value[1].isValid) ? value[1].toJSDate() : undefined}
			onChange={(newRange, evt) => {
				if (name) {
					formik.setFieldValue(name.toString(), [
						newRange[0] ? DateTime.fromJSDate(newRange[0]) : DateTime.invalid('null'),
						newRange[1] ? DateTime.fromJSDate(newRange[1]) : DateTime.invalid('null')
					]);
				}
				if (evt) onChange(evt);
			}}
			onBlur={onBlur}
			{...otherProps}
		/>
	</div>
}


export function ModalFormSelect<FormFields>({
	formik,
	name,
	label,
	labelControls,
	size = 'select-md',
	children,
	onChange = formik.handleChange,
	onBlur = formik.handleBlur,
	...otherProps
} : CommonFormFieldProps<FormFields> & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'size'> & {
	size?: 'select-lg' | 'select-sm' | 'select-md' | 'select-xs';
	children: ReactNode;
}) {
	const id = '__modal-input-' + makeUniqueNumber();

	return <div>
		<ModalFormInputLabel inputId={id} label={label} labelControls={labelControls} />

		<select id={id} name={name as string} className={`w-full select select-bordered ${size}`}
			onChange={onChange} onBlur={onBlur} value={name ? formik.values[name] as any : undefined}
			{...otherProps}
		>
			{children}
		</select>
	</div>
}



export function ModalFormNumberValueSelect<FormFields>({
	formik,
	name,
	...otherProps
} : CommonFormFieldProps<FormFields> & {
	size?: 'select-lg' | 'select-sm' | 'select-md' | 'select-xs';
	children: ReactNode;
}) {
	return <ModalFormSelect<FormFields> formik={formik} name={name} {...otherProps}
		onChange={evt => formik.setFieldValue(name as string, +evt.target.value)}
	/>
}