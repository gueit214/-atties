import tw from 'tailwind-styled-components';

export interface ButtonProps {
  kind?: 'filled' | 'outlined';
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

const FilledButton = tw.button<ButtonProps>`
${({ disabled }) => disabled && 'opacity-50 cursor-not-allowed'}
w-[calc(100%-48px)] transition h-[3.25rem] text-sm rounded-[0.25rem] hover:opacity-90 border border-transparent hover:brand-2 bg-brand px-0 text-white leading-3 font-normal shadow-xl shadow-gray
`;

const OutlinedButton = tw.button<ButtonProps>`
${({ disabled }) => disabled && 'opacity-50 cursor-not-allowed'}
w-[calc(100%-48px)] transition h-[3.25rem] text-sm rounded-[0.25rem] border border-brand hover:brand-2 bg-white px-0 text-brand leading-3 font-normal
`;

export default function Button({
  kind = 'filled',
  text,
  disabled = false,
  onClick,
  ...rest
}: ButtonProps) {
  return kind === 'filled' ? (
    <FilledButton disabled={disabled} onClick={onClick} {...rest}>
      {text}
    </FilledButton>
  ) : (
    <OutlinedButton disabled={disabled} onClick={onClick} {...rest}>
      {text}
    </OutlinedButton>
  );
}
