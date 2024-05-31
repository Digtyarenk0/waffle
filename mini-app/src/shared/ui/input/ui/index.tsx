import cs from 'classnames';
import { InputHTMLAttributes, memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { UseFormRegisterReturn, FieldErrors, UseFormReset, FieldValues } from 'react-hook-form';
import { TiDelete } from 'react-icons/ti';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  errors: FieldErrors;
  placeholder?: string;
  example?: string;
  reset?: (name: string) => void;
  classNameInput?: string;
}

export const Input = memo(function Input(props: InputProps) {
  const { register, errors, className, placeholder = '', reset, example = '', classNameInput, ...otherProps } = props;

  const uID = useId();
  const ref = useRef<HTMLInputElement>();

  const [isFocus, setIsFocus] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const onBlurCapture = () => setIsFocus(false);
  const onFocus = () => setIsFocus(true);

  const refShare = (e: HTMLInputElement) => {
    register.ref(e);
    ref.current = e;
  };

  const value = ref.current?.value;
  const error = value && errors[register.name]?.message?.toString();

  const isShowPlaceholder = useMemo(() => {
    if (isFocus) return false;
    if (!value) return true;
  }, [isFocus, value]);

  useEffect(() => {
    value || isFocus ? setIsActive(true) : setIsActive(false);
  }, [value, isFocus]);

  return (
    <div className={cs('relative text-white-main', className)}>
      <input
        {...register}
        {...otherProps}
        onBlurCapture={onBlurCapture}
        onFocus={onFocus}
        id={uID}
        className={cs('bg-transparent border-[1px] font-medium border-gray-500 rounded-[4px]', classNameInput)}
        ref={refShare}
      />
      {value && reset && (
        <button onClick={() => reset(register.name)}>
          <TiDelete className="absolute top-2 right-2 text-gray-main" size="25px" />
        </button>
      )}
      {isShowPlaceholder && <p className="absolute top-2 left-4">{placeholder}</p>}
    </div>
  );
});
