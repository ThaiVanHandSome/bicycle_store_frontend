import { useField } from 'formik';
import { Input } from '@nextui-org/react';
import { useState } from 'react';
import { EyeFilledIcon, EyeSlashFilledIcon } from '../Icon/Icon';
import clsx from 'clsx';


export const MyTextInp = ({ label, placeholder, isDisabled, className, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className={clsx("mb-3", className)}>
            <Input isDisabled={isDisabled} variant="bordered" type='text' label={label} {...field} {...props}/>
            {meta.touched && meta.error ? <div className='ms-2 text-sm text-red-600 font-bold'>{meta.error}</div> : null}
        </div>
    );
};

export const MyPasswordInp = ({ label, placeholder,  ...props }) => {
    const [field, meta] = useField(props);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    return (
        <div className='mb-3'>
            <Input
                label={label}
                variant="bordered"
                endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                    </button>
                }
                type={isVisible ? "text" : "password"}
                {...field}
                {...props}
            />
            {meta.touched && meta.error ? <div className='ms-2 text-sm text-red-600 font-bold'>{meta.error}</div> : null}
        </div>
    );
};

export const MyCheckBox = ({ children, ...props }) => {
    props = {
        ...props,
        type: 'checkbox',
    };
    const [field, meta] = useField(props);
    return (
        <div>
            <div>
                <div>
                    <input {...field} {...props}/>
                    <div></div>
                </div>
                <label>{children}</label>
            </div>
            {meta.touched && meta.error ? <div>{meta.error}</div> : null}
        </div>
    );
};

export const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div>
            <label htmlFor={props.id || props.name}>
                {label}
            </label>
            <select {...field} {...props}/>
            {meta.touched && meta.error ? <div>{meta.error}</div> : null}
        </div>
    );
};
