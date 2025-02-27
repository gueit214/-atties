
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface ToastProps {
  setToast: (value: boolean) => void;
  text: string;
  [key: string]: any;
}
export default function Toast({ setToast, text }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);
  return (
    <div className="fixed inset-x-0 top-8 z-50 m-auto flex min-h-[5rem] w-[18.75rem] animate-bounce4 flex-col items-start gap-2 rounded-2xl bg-[#F5F5F5] p-3 opacity-80">
      <div className="flex gap-2">
        <div className="flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded bg-[#FC6554]">
          <Image
            alt="logo"
            src="/svg/icons/logo_brand.svg"
            width="15"
            height="0"
          />
        </div>
        <span>Atties</span>
      </div>
      <p>{text}</p>
    </div>
  );
}
