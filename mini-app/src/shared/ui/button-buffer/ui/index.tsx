import { ButtonHTMLAttributes } from 'react';

interface ButtonPastFromBufferProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  setBufferValue: (val: string) => void;
}

export const ButtonPastFromBuffer = ({ setBufferValue, className, ...otherProps }: ButtonPastFromBufferProps) => {
  const past = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setBufferValue(text);
    } catch (error: any) {
      console.error('text:', error?.message);
    }
  };

  return (
    <button id="new-copy" className={className} {...otherProps} onClick={past}>
      Past
    </button>
  );
};
