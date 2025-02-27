import instance from '@apis/_axios/instance';

import Loader from '@components/common/Loader';
import { useEffect } from 'react';
import { Token } from '@utils/localStorage/token';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';

export default function KakaoCallback() {
  const router = useRouter();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    instance
      .get(`/oauth2/kakao?code=${code}`)
      .then((response) => {
        setCookie('refreshToken', response.data.refreshToken);
      })
      .then(() => router.push('/home'))
      .catch((err) => {
        err;
      });
  }, []);

  return (
    <article>
      <Loader />
    </article>
  );
}
