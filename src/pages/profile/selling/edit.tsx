import Guarantee from '@components/auction/Guarantee';
import ErrorMessage from '@components/common/ErrorMessage';
import Input from '@components/common/Input';
import KeywordBox from '@components/common/KeywordBox';

import Loader from '@components/common/Loader';
import Navigate from '@components/common/Navigate';
import Select from '@components/common/Select';
import GenreModal from '@components/home/post/GenreModal';
import GuaranteeModal from '@components/home/post/GuaranteeModal';
import KeywordModal from '@components/home/post/KeywordModal.tsx';
import FileItem from '@components/inquiry/FileItem';
import usePatchArtwork from '@hooks/mutations/usePatchArtwork';
import useGetEditForm from '@hooks/queries/artwork/useGetEditForm';
import useGetProfile from '@hooks/queries/useGetProfile';
import { dataURLtoFile } from '@utils/dataURLtoFile';
import { getToken } from '@utils/localStorage/token';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const ARTWORK_STATUS = [
  { value: '매우 좋음' },
  { value: '좋음' },
  { value: '보통' },
];

const IS_FRAME = [{ value: '있음' }, { value: '없음' }];

const CANVAS_SIZE = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '8',
  '10',
  '12',
  '15',
  '20',
  '25',
  '30',
  '40',
  '50',
  '60',
  '80',
  '100',
  '120',
  '150',
  '200',
  '300',
  '500',
];

export default function Edit({ userInfo }) {
  const router = useRouter();
  const scrollRef: any = useRef();
  const scrollToElement = () =>
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });

  const artWorkId = Number(router.query.id);
  const { data: editForm } = useGetEditForm(artWorkId);

  const [isGuaranteeModal, setIsGuaranteeModal] = useState<boolean>(false);
  const [isKeywordModal, setIsKeywordModal] = useState<boolean>(false);
  const [isGenreModal, setIsGenreModal] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>('');
  const [keywordList, setKeywordList] = useState<string[]>(editForm?.keywords);
  const [genre, setGenre] = useState<string>(editForm?.genre);
  const [fileList, setFileList] = useState([
    ...editForm?.images.map((image: string, idx: number) => {
      return {
        url: image,
        idx: idx,
      };
    }),
  ]);

  if (getToken().roles !== 'ROLE_ARTIST') {
    router.push('/home');
  }

  const handleRemoveFile = (targetIdx: string): void => {
    const newFileList = fileList.filter((file) => {
      if (file.hasOwnProperty('url')) {
        return file.idx !== targetIdx;
      } else {
        return file.name !== targetIdx;
      }
    });
    setFileList(newFileList);
    setValue('image', newFileList as any);
  };

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    trigger,
  } = useForm<Artwork>({
    mode: 'onTouched',
    defaultValues: {
      title: editForm?.title,
      productionYear: editForm?.productionYear,
      description: editForm?.description,
      material: editForm?.material,
      frame: editForm?.frame,
      width: editForm?.artWorkSize?.width,
      length: editForm?.artWorkSize?.length,
      height: editForm?.artWorkSize?.height,
      size: editForm?.artWorkSize?.size,
      price: editForm?.price,
      status: editForm?.status,
      statusDescription: editForm?.statusDescription,
    },
  });

  const handleImage = (e) => {
    clearErrors('image');
    const files = e.target.files;
    if (fileList?.length <= 5 && fileList?.length + files?.length <= 5) {
      const newFileList: any = [];
      for (const i of files) {
        newFileList.push(i);
      }
      setFileList((prev) => prev.concat(newFileList));
    }
  };

  useEffect(() => {
    if (keywordList.length > 0) {
      setValue('keywords', keywordList);
    }
    if (genre) {
      setValue('genre', genre);
    }
    if (signature) {
      setValue('guaranteeImage', signature);
    }
  }, [keywordList, setValue, genre, signature]);

  const { mutate, isLoading: isLoadingPost } = usePatchArtwork(artWorkId);
  const guaranteeRef = useRef<HTMLDivElement>(null);

  const onSubmit = (form: Artwork) => {
    const {
      title,
      productionYear,
      description,
      material,
      frame,
      width,
      length,
      height,
      size,
      price,
      status,
      statusDescription,
    } = form;

    if (fileList.length === 0) {
      setError('image', {
        type: 'required',
        message: '작품 사진을 최소 한 장 이상 선택해주세요.',
      });
      return;
    }

    if (keywordList.length === 0) {
      setError('keywords', {
        type: 'required',
        message: '태그를 최소 한 개 이상 선택해주세요.',
      });
      return;
    }
    if (genre === '') {
      setError('genre', {
        type: 'required',
        message: '장르를 선택해주세요.',
      });
      return;
    }

    if (signature === '') {
      setError('guaranteeImage', {
        type: 'required',
        message: '작가 서명을 입력해주세요.',
      });
      return;
    }

    const formData = new FormData();

    formData.append('title', title);
    formData.append('productionYear', productionYear + '');
    formData.append('description', description);
    formData.append('material', material);
    formData.append('frame', (frame + '' === '있음') + '');
    formData.append('width', width + '');
    formData.append('length', length + '');
    formData.append('height', height + '');
    formData.append('size', size);
    formData.append('price', price + '');
    formData.append('status', status);
    formData.append('statusDescription', statusDescription);
    formData.append('keywords', keywordList + '');

    for (const i of fileList) {
      if (i.hasOwnProperty('url')) {
        formData.append('prevImage', i.url);
      } else {
        formData.append('image', i);
      }
    }
    if (!fileList.some((file) => !file.hasOwnProperty('url'))) {
      formData.append('image', new File([''], ''));
    }
    if (!fileList.some((file) => file.hasOwnProperty('url'))) {
      formData.append('prevImage', '');
    }
    if (genre) {
      formData.append('genre', genre);
    }
    if (signature) {
      let file;

      file = dataURLtoFile(signature, 'guaranteeImage');

      formData.append('guaranteeImage', file);
    }

    mutate(formData);
  };

  if (isGuaranteeModal)
    return (
      <GuaranteeModal
        onCloseModal={() => setIsGuaranteeModal(false)}
        setSignature={setSignature}
      />
    );

  if (isKeywordModal)
    return (
      <KeywordModal
        keywordList={keywordList}
        setKeywordList={setKeywordList}
        onCloseModal={() => setIsKeywordModal(false)}
      />
    );

  if (isGenreModal)
    return (
      <GenreModal
        genre={genre}
        setGenre={setGenre}
        onCloseModal={() => setIsGenreModal(false)}
      />
    );

  if (isLoadingPost) {
    return <Loader />;
  }
  return (
    <article>
      <form className="w-full space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Navigate right_message="완료" />
        <div className="flex">
          <label htmlFor="fileImage">
            <div className="mr-0 flex h-[3.75rem] w-[3.75rem] cursor-pointer flex-col items-center justify-center rounded border-[0.0625rem] border-[#DBDBDB]">
              <Image
                src="/svg/icons/camera_black.svg"
                alt="camera"
                width={17}
                height={17}
              />
              <div className="text-12 text-[#999999]">
                {fileList.length > 0 ? `${fileList.length}/5` : '0/5'}
              </div>
            </div>
          </label>
          {fileList.length > 0 && (
            <div className="flex flex-wrap">
              {fileList.map((file, idx) => (
                <FileItem
                  handler={handleRemoveFile}
                  key={'' + idx}
                  file={file}
                  idx={idx}
                />
              ))}
            </div>
          )}
          <input
            multiple
            type="file"
            id="fileImage"
            className="hidden"
            onChange={handleImage}
          />
        </div>
        {errors.image && (
          <ErrorMessage
            className="mt-2"
            message={'작품 이미지를 최소 한 장 이상 등록해주세요.'}
          />
        )}
        <div>
          <Input
            type="text"
            label="작품명"
            placeholder="작품명을 입력해주세요"
            register={register('title', { required: true })}
          />
          <button
            onClick={() => {
              clearErrors('keywords');
              setIsKeywordModal(true);
            }}
            className="relative"
          >
            <div className="flex h-[2.375rem] w-[5.75rem] items-center rounded-[0.25rem] border border-[#D8D8D8] pl-3 text-[0.8125rem] text-[#999999]">
              태그추가
            </div>
            <div className="absolute bottom-0 left-[3.9375rem] flex h-full items-center">
              <Image
                src="/svg/icons/plus_gray.svg"
                alt="tag"
                width={20}
                height={20}
              />
            </div>
          </button>
          <div className="mt-3 flex flex-wrap">
            {keywordList?.map((name) => (
              <KeywordBox text={name} key={name} focused />
            ))}
          </div>
          {errors.keywords && (
            <ErrorMessage message={errors.keywords.message} />
          )}
        </div>
        <Input
          type="number"
          label="제작연도"
          min={2010}
          placeholder="숫자만 입력해주세요. ex)2022"
          register={register('productionYear', {
            required: true,
            min: 2010,
            max: 2023,
          })}
        />
        {errors.productionYear && (
          <ErrorMessage message="제작년도를 확인해주세요." />
        )}
        <div>
          <div className="flex justify-between">
            <label htmlFor="description" className="text-14 leading-8">
              작품설명
            </label>
            <div className="text-14 text-[#999999]">
              <span
                className={`${
                  watch('description') ? 'text-[#191919]' : 'text-[#999999]'
                }`}
              >
                {watch('description')?.length || 0}
                /1000
              </span>
            </div>
          </div>
          <textarea
            id="content"
            maxLength={1000}
            placeholder="작품에 대해 자세히 기입해주세요."
            className="h-[9.375rem] w-full resize-none overflow-hidden rounded-[0.25rem] border-[#D8D8D8] text-[0.8125rem] placeholder-[#999999] placeholder:text-14"
            {...register('description', { required: true })}
          />
        </div>
        <Input
          type="text"
          label="재료"
          placeholder="사용한 재료를 입력해주세요."
          register={register('material', { required: true })}
        />
        <div
          onClick={() => {
            clearErrors('genre');
            setIsGenreModal(true);
          }}
        >
          <label className="text-14 leading-8">장르</label>
          <div
            className={`flex h-[3.25rem] w-full cursor-pointer items-center rounded-[0.25rem] border border-[#D8D8D8] pl-3 text-[0.8125rem] ${
              genre ? 'text-[#191919]' : 'text-[#999999]'
            }`}
          >
            {genre ? genre : '선택하기'}
          </div>
        </div>
        {errors.genre && <ErrorMessage message={errors.genre.message} />}
        <Select
          name="frame"
          setValue={setValue}
          options={IS_FRAME}
          label="액자"
        />
        <div>
          <span className="text-14">크기/호수</span>
          <article className="flex gap-4">
            <Input
              type="number"
              min={0}
              placeholder="가로"
              className=""
              register={register('width', { required: true })}
              unit="cm"
            />
            <Input
              type="number"
              min={0}
              placeholder="세로"
              className=""
              register={register('length', { required: true })}
              unit="cm"
            />
            <Input
              type="number"
              min={0}
              placeholder="높이"
              className=""
              register={register('height', { required: true })}
              unit="cm"
            />
          </article>
          <article className="w-[calc((100%-2rem)/3)]">
            <Input
              type="number"
              placeholder="10"
              unit="호"
              register={register('size')}
            />
            {!CANVAS_SIZE.includes(watch('size')) && (
              <ErrorMessage message={'호수를 확인해주세요.'} />
            )}
          </article>
        </div>
        <Input
          type="text"
          label="경매 시작가"
          placeholder="작품 최소 가격을 설정해주세요."
          register={register('price', { required: true })}
          unit="원"
        />
        <Select
          name="status"
          setValue={setValue}
          options={ARTWORK_STATUS}
          label="작품 상태"
        />
        <textarea
          id="content"
          maxLength={1000}
          placeholder="작품상태에 대해 자세히 기입해주세요."
          className="h-[9.375rem] w-full resize-none overflow-hidden rounded-[0.25rem] border-[#D8D8D8] text-[0.8125rem] placeholder-[#999999] placeholder:text-14  "
          {...register('statusDescription', { required: true })}
        />
        <div
          className="w-full cursor-pointer"
          onClick={() => {
            clearErrors('guaranteeImage');
            setIsGuaranteeModal(true);
          }}
        >
          <label htmlFor="statusDetail" className="text-14 leading-8">
            작품 보증서
          </label>
          {signature ? (
            <div
              className="flex h-[8rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-[#DBDBDB] p-4"
              onClick={() => setIsGuaranteeModal(true)}
            >
              <Image src={signature} width={163} height={91} alt="guarantee" />
            </div>
          ) : (
            <div className="relative">
              <div className="flex h-[3.25rem] w-full items-center rounded-[0.25rem] border border-[#D8D8D8] pl-3 text-[0.8125rem] text-[#999999]">
                전자 서명이 필요합니다.
              </div>
              <div
                onClick={() => setIsGuaranteeModal(true)}
                className="absolute bottom-0 right-4 flex h-[3.25rem] cursor-pointer items-center"
              >
                <Image
                  src="/svg/icons/pencil_gray.svg"
                  alt="setting"
                  className="cursor-pointer"
                  width="23"
                  height="0"
                />
              </div>
            </div>
          )}
        </div>
        <input {...register('guaranteeImage')} className="h-0 w-0" />
        {errors.guaranteeImage && (
          <ErrorMessage message={errors.guaranteeImage.message} />
        )}
        {userInfo &&
          watch('title') &&
          watch('productionYear') &&
          watch('width') &&
          watch('length') &&
          watch('height') &&
          watch('genre') &&
          signature && (
            <Guarantee
              nickname={userInfo.nickname}
              title={watch('title')}
              productionYear={watch('productionYear')}
              width={watch('width')}
              length={watch('length')}
              height={watch('height')}
              genre={watch('genre')}
              guaranteeImage={signature}
              mainImage={
                fileList[0] && fileList[0].hasOwnProperty('url')
                  ? fileList[0]?.url
                  : fileList[0]
              }
            />
          )}

        <div className="relative h-[21rem]">
          <div className="absolute -bottom-10 -left-6 h-[23.5rem] w-[23.4375rem]">
            <div className="mt-12 h-4 bg-[#F8F8FA]"></div>
            <div className="px-6 text-12">
              <p className="mt-8 font-medium">
                다음의 경우 작품등록이 제외될 수 있습니다.
              </p>
              <ul className="ml-3 mt-3 w-fit list-disc space-y-2 tracking-tight text-[#767676]">
                <li>
                  작품의 선정성, 유해성이 통신판매업 시행령(2019) 기준에 맞지
                  아니 하다고 판단되는 경우
                </li>
                <li>
                  제출된 자료의 내용이 미흡하거나, 허위로 기재된 사실이 밝혀질
                  경우
                </li>
                <li>
                  제출된 작품 이미지로 작품의 형태 유무의 대부분을 판단할 수
                  없는 경우
                </li>
                <li>
                  과반 이상의 심사위원이 작품이 완성되지 않았다고 판단하거나
                  프로그램의 취지에 맞지 아니하다고 판단될 경우
                </li>
                <li>유사 온라인 아트플랫폼에 이미 등록되었거나 확인될 경우</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </article>
  );
}
