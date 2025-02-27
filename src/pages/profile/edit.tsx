import DoubleCheckButton from '@components/common/DoubleCheckButton';
import ErrorMessage from '@components/common/ErrorMessage';
import Input from '@components/common/Input';

import Navigate from '@components/common/Navigate';
import useGetProfile from '@hooks/queries/useGetProfile';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { isUser } from '@utils/isUser';
import { makeBlob } from '@utils/makeBlob';
import { useGetDuplicateCheck } from '@hooks/queries/useGetDuplicateCheck';
import { usePatchArtist, usePatchUser } from '@hooks/mutations/usePatchMember';
import Loader from '@components/common/Loader';
import Toast from '@components/common/Toast';
interface checkForm {
  nickname: boolean;
  email: boolean;
}

export default function Edit() {
  const [isValidate, setIsValidate] = useState<checkForm>({
    nickname: false,
    email: false,
  });
  const [toast, setToast] = useState(false);

  const { data } = useGetProfile();
  const [userInfo, setUserInfo] = useState<Member | null>(null);
  const { mutate: mutateUser, isLoading: isPatchUserLoading } = usePatchUser();
  const { mutate: mutateArtist, isLoading: isPatchArtistLoading } =
    usePatchArtist();

  useEffect(() => {
    if (!data) return;
    setUserInfo(data);
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm<Member>({ mode: 'onTouched' });
  const nickname = watch('nickname');

  const [enabled, setEnabled] = useState<DuplicateCheck>({
    userId: '',
    nickname: '',
    email: '',
  });
  const results = useGetDuplicateCheck(enabled);
  useEffect(() => {
    setIsValidate((prev) => ({ ...prev, nickname: false }));
    setEnabled((prev) => ({ ...prev, nickname: '' }));
  }, [nickname]);

  const nicknameResult = results[1];
  useEffect(() => {
    if (nicknameResult.isSuccess) {
      setIsValidate((prev) => ({ ...prev, nickname: true }));
      clearErrors('nickname');
    }
    if (
      nicknameResult.error &&
      nicknameResult.error.code === 'EXIST_USER_NICKNAME'
    ) {
      setIsValidate((prev) => ({ ...prev, nickname: false }));
      setError('nickname', {
        type: 'nickname doublecheck',
        message: '이미 존재하는 닉네임 입니다.',
      });
    }
  }, [nicknameResult.isFetching]);

  const router = useRouter();
  const profile = watch('image');

  const handleLeftButton = () => {
    router.push('/profile');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);

  useEffect(() => {
    if (!profile) return;
    setUserInfo(
      (prev) =>
        ({
          ...prev,
          image: makeBlob(profile[0]),
        } as User),
    );
  }, [profile]);

  const onSubmit = async (form: Member) => {
    const {
      nickname,
      instagram,
      behance,
      education,
      history,
      description,
      telephone,
    } = form;
    if (!nickname || !userInfo || !telephone) return;

    if (!isValidate.nickname && userInfo.nickname !== form.nickname) {
      setError('nickname', {
        type: 'need nickname duplicate',
        message: '닉네임 중복체크를 해주세요',
      });
      return;
    }

    const formData = new FormData();

    formData.append('nickname', nickname);
    formData.append('email', data?.email!);
    formData.append('telephone', telephone);

    if (profile && profile?.length) {
      //유저가 프로필을 변환하였다면
      formData.append('isChanged', 'true');
      formData.append('image', profile[0]);
    } else {
      // 유저가 프로필을 변경하지 않았다면
      formData.append('isChanged', 'false');
      formData.append('image', new File([''], ''));
    }

    if (!isUser) {
      if (education) formData.append('education', education);
      if (history) formData.append('history', history);
      if (description) formData.append('description', description);

      if (instagram) formData.append('instagram', instagram);
      if (behance) formData.append('behance', behance);
    }

    if (isUser) {
      mutateUser(formData);
      router.replace('/profile');
    } else {
      mutateArtist(formData);
      router.replace({
        pathname: '/profile/detail' + userInfo?.id,
      });
    }
  };
  useEffect(() => {
    if (userInfo && !userInfo?.telephone) {
      setToast(true);
    }
  }, [userInfo]);
  if (isPatchUserLoading || isPatchArtistLoading) return <Loader />;

  return (
    <article>
      {toast && (
        <Toast
          text="전화번호 등록을 완료해야 서비스 이용이 가능합니다."
          setToast={setToast}
        />
      )}
      <Navigate
        right_message="완료"
        left_message={
          <Image alt="X" src="/svg/icons/close.svg" width="18" height="0" />
        }
        handleLeftButton={handleLeftButton}
        handleRightButton={handleSubmit(onSubmit)}
      />
      <label className="flex h-[7.5rem] justify-center" htmlFor="image">
        {userInfo?.image ? (
          <div className="relative flex h-[6.1875rem] w-[6.1875rem] cursor-pointer items-center justify-center rounded-full bg-[#FFFFFF]            ">
            <Image
              src={userInfo?.image}
              className="rounded-full object-cover"
              fill
              alt="profile"
            />
            <div className="absolute bottom-0 right-0 flex h-[1.625rem] w-[1.625rem] items-center justify-center rounded-full bg-[#575757]">
              <Image
                src="/svg/icons/camera.svg"
                width="15"
                height="0"
                alt="image"
              />
            </div>
          </div>
        ) : data?.image ? (
          <div className="relative flex h-[6.1875rem] w-[6.1875rem] cursor-pointer items-center justify-center rounded-full bg-[#FFFFFF]            ">
            <Image
              src={data?.image}
              className="rounded-full object-cover"
              fill
              alt="profile"
            />
            <div className="absolute bottom-0 right-0 flex h-[1.625rem] w-[1.625rem] items-center justify-center rounded-full bg-[#575757]">
              <Image
                src="/svg/icons/camera.svg"
                width="15"
                height="0"
                alt="image"
              />
            </div>
          </div>
        ) : (
          <div className=" relative flex h-[6.1875rem] w-[6.1875rem] cursor-pointer items-center justify-center rounded-full border-2 border-[#999999] bg-[#FFFFFF]">
            <Image
              src="/svg/icons/avatar.svg"
              width="60"
              height="0"
              alt="profile"
            />
            <div className="absolute bottom-0 right-0 flex h-[1.625rem] w-[1.625rem] items-center justify-center rounded-full bg-[#575757]">
              <Image
                src="/svg/icons/camera.svg"
                width="15"
                height="0"
                alt="profileEdit"
              />
            </div>
          </div>
        )}
      </label>
      <input
        type="file"
        accept="image/*"
        id="image"
        className="hidden"
        {...register('image')}
      />

      <section className="relative">
        <Input
          type="text"
          label="닉네임"
          placeholder="닉네임을 입력해 주세요."
          defaultValue={userInfo?.nickname}
          $error={!!errors.nickname}
          register={register('nickname', {
            required: true,
            pattern: {
              value: /^[가-힣A-Za-z0-9]{1,5}$/g,
              message: '한글, 숫자를 포함하여 최대 5자 까지 입력 가능합니다.',
            },
          })}
        />
        <DoubleCheckButton
          $valid={!isValidate.nickname}
          onClick={() => {
            trigger('nickname');
            if (!errors.nickname) {
              setEnabled((prev) => ({ ...prev, nickname: watch('nickname') }));
            }
          }}
          text={isValidate.nickname ? '사용가능' : '중복확인'}
        />
        {errors.nickname && <ErrorMessage message={errors.nickname.message} />}
      </section>

      <Input
        type="text"
        label="휴대폰 번호"
        placeholder="-를 제외하고 입력해주세요."
        $error={!!errors.telephone}
        register={register('telephone', {
          required: true,
          pattern: {
            value: /^01([0|1|6|7|8|9])[0-9]{4}[0-9]{4}$/g,
            message: '휴대폰번호를 정확히 입력해주세요.',
          },
        })}
        defaultValue={data?.telephone}
      />

      <Input
        type="text"
        label="이메일"
        disabled
        defaultValue={userInfo?.email}
        placeholder="이메일을 입력해 주세요."
        $error={!!errors.email}
        className="disabled text-[#999999]"
      />

      {!isUser && (
        <section>
          <Input
            type="text"
            label="학력"
            defaultValue={userInfo?.education}
            placeholder="학교와 학위, 전공 등을 입력해 주세요."
            $error={!!errors.education}
            register={register('education')}
          />
          {errors.education && (
            <ErrorMessage message={errors.education.message} />
          )}
          <Input
            type="textarea"
            label="이력"
            defaultValue={userInfo?.history}
            placeholder="이력을 작성해 주세요."
            $error={!!errors.history}
            register={register('history')}
          />
          {errors.history && <ErrorMessage message={errors.history.message} />}
          <Input
            type="textarea"
            label="작가소개"
            placeholder="소개를 작성해 주세요."
            defaultValue={userInfo?.description}
            $error={!!errors.description}
            register={register('description')}
          />
          {errors.description && (
            <ErrorMessage message={errors.description.message} />
          )}
          <article className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="instagram">
                <Image
                  src="/svg/icons/instagram_gray.svg"
                  width="20"
                  height="20"
                  className="mr-1"
                  alt="instagram"
                />
              </label>
              <input
                placeholder="인스타그램 추가하기"
                {...register('instagram')}
                id="instagram"
                defaultValue={userInfo?.instagram}
                className="h-[1.875rem] w-[8.75rem] indent-1 text-12 placeholder:text-[#999]"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="behance">
                <Image
                  src="/svg/icons/behance_gray.svg"
                  width="20"
                  height="20"
                  className="mr-1"
                  alt="behance"
                />
              </label>
              <input
                placeholder="비헨스 추가하기"
                {...register('behance')}
                id="behance"
                defaultValue={userInfo?.behance}
                className="h-[1.875rem] w-[8.75rem] indent-1 text-12 placeholder:text-[#999]"
              />
            </div>
          </article>
        </section>
      )}
    </article>
  );
}
