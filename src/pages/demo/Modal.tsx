import { useState } from 'react';
import Page from '../../components/Page';
import { Modal, ModalWithForm } from '../../components/Modal';



// eslint-disable-next-line import/no-anonymous-default-export
export default function Page1() {
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    return <Page title="Modal demo">
		<div className="mt-4 mb-4">
            <button className="btn btn-primary mr-2" onClick={() => setShowModal1(true)}>Show Modal 1</button>
            <button className="btn btn-primary" onClick={() => setShowModal2(true)}>Show Modal 2</button>
        </div>

        <Modal title="Sample modal 1" id="sample-modal-1" show={showModal1}
            handleClose={() => setShowModal1(false)}
            actions={[
                <button className="btn btn-primary mr-2" key="1" onClick={() => console.log('Action 1')}>Action 1</button>,
                <button className="btn btn-secondary mr-2" key="2" onClick={() => console.log('Action 2')}>Action 2</button>
            ]}
        >
            <p className="mt-4">Hello!</p>
        </Modal>

        <ModalWithForm title="Sample modal 2" id="sample-modal-2" submitBtnTitle='OK' show={showModal2} handleClose={() => setShowModal2(false)}
            formikConfig={{
                initialValues: {
                    name: '',
                    quantity: 1
                },

                validate: values => {
                    const errors: any = {};

                    if (values.name.trim() === '') errors.name = 'Chưa điền tên.';
                    if (values.quantity < 0) errors.quantity = 'Số lượng không hợp lệ.';
        
                    return errors;
        
                },

                onSubmit: (values, {setSubmitting}) => {
                    setSubmitting(true);

                    setTimeout(() => {
                        setShowModal2(false);
                        setSubmitting(false);
                    }, 2000);
                }
            }}
        >
            {formik => <>
                <div>
                    <label className="label mt-4">
                        <span className="text-base label-text">Tên</span>
                    </label>
                    <input type="text" name="name" className="w-full input input-bordered"
                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                </div>

                <div>
                    <label className="label mt-4">
                        <span className="text-base label-text">Số lượng</span>
                    </label>
                    <input type="number" name="quantity" className="w-full input input-bordered"
                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.quantity} />
                </div>
            </>}
        </ModalWithForm>
    </Page>
}

