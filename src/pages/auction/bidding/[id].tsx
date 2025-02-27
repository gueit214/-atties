import AskPriceModal from '@components/auction/AskPriceModal';
import Button from '@components/common/Button';
import DivisionBar from '@components/common/DivisionBar';
import ErrorMessage from '@components/common/ErrorMessage';

import Navigate from '@components/common/Navigate';
import usePutBiddng from '@hooks/mutations/usePutBidding';
import useGetBiddingHistory from '@hooks/queries/auction/useGetBiddingHistory';
import { useCountDown } from '@hooks/useCountDown';
import { leatAskPrice } from '@utils/leastAskPrice';
import { priceToString } from '@utils/priceToString';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
interface inputForm {
  price: string;
}

export default function Bidding({ userInfo }) {
  const router = useRouter();
  const artWorkId = Number(router.query.id);
  const { data } = useGetBiddingHistory(artWorkId);
  const { artWork, auction, biddingList, totalBiddingCount } = data || {};
  const { mutate } = usePutBiddng(+artWorkId!);
  const [days, hours, minutes, seconds] = useCountDown?.(
    auction?.endDate || '',
  );
  const remaind = +days + +hours + +minutes + +seconds;
  const [isBlurred, setIsBlurred] = useState(true);
  const isMine = artWork?.artist === userInfo?.id;

  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<inputForm>({
    mode: 'onTouched',
  });

  useEffect(() => {
    if (data) {
      if (data.artWork.topPrice === null)
        setValue('price', priceToString(data.artWork.beginPrice));
      else {
        setValue('price', priceToString(leatAskPrice(data.artWork.topPrice)));
      }
    }
  }, [data]);

  const [isModal, setIsModal] = useState<boolean>(false);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, '');
    setValue('price', Number(value).toLocaleString('kr-KR') + '');
    if (isBlurred) trigger();
  };

  const onSubmit = (form: inputForm) => {
    const Price = form.price.replace(/,/g, '');
    mutate({ price: +Price });
  };

  return (
    <article>
      <Navigate
        isLeftButton={false}
        className="text-18 font-medium"
        message="응찰내역"
        handleRightButton={() => router.back()}
      />
      <div className="top-6.25rem absolute inset-x-0 mx-auto  max-w-[26.25rem] border-b border-brand" />
      <section>
        <article className="mt-3">
          <div className="textd-16 font-medium">작품정보</div>
          <div className="mt-3 flex items-center">
            <div className="relative h-[6.0625rem] w-[5.3125rem] overflow-hidden rounded-[0.25rem]">
              {artWork?.image && (
                <Image
                  alt="image"
                  src={artWork?.image}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="ml-3 h-fit flex-col">
              <p className="text-15 font-semibold leading-5">
                {artWork?.title}
              </p>
              <p className="mt-1 text-[0.7775rem] text-font-500">
                {artWork?.artistName}
                <span className="ml-[0.375rem]">{artWork?.genre}</span>
              </p>
              <div className="mt-3 text-[0.8125rem] font-medium text-font-500">
                <p className="leading-5">
                  현재가
                  <span className="ml-2 text-brand">
                    KRW {artWork?.topPrice && priceToString(artWork?.topPrice)}
                    (응찰 {totalBiddingCount})
                  </span>
                </p>
                <p className="leading-5">
                  시작가
                  <span className="ml-2 font-semibold text-[#191919]">
                    KRW{' '}
                    {artWork?.beginPrice && priceToString(artWork?.beginPrice)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </article>
        <article className="mt-5 flex h-[4.375rem] items-center rounded-xl border border-[#D9D9D9]">
          <div className="flex w-2/5 flex-col items-center border-r border-[#D9D9D9]">
            <p className="flex">
              <Image
                alt=""
                src="/svg/icons/clock_black.svg"
                width="17"
                height="0"
              />
              <span className="ml-1 text-14">남은시간</span>
            </p>
            <p className="w-full text-center text-16 font-semibold">
              {remaind > 0 ? (
                days ? (
                  <span>
                    {days}일 {hours}:{minutes}:{seconds}
                  </span>
                ) : (
                  <span>
                    {hours}:{minutes}:{seconds}
                  </span>
                )
              ) : (
                '경매종료'
              )}
            </p>
          </div>
          <div className="flex w-3/5 flex-col items-center">
            <p className="flex">
              <Image
                alt=""
                src="/svg/icons/clock_black.svg"
                width="17"
                height="0"
              />
              <span className="ml-1 text-14">시작시간</span>
            </p>
            <p className="text-16 font-semibold">
              {auction?.startDate.split('-').slice(0, 3).join('-') +
                ' ' +
                auction?.startDate.split('-').slice(3, 5).join(':')}
            </p>
          </div>
        </article>
      </section>
      <DivisionBar className="absolute inset-x-0 mx-auto mt-6" />
      <section>
        <article className="mt-14 flex justify-between ">
          <span className="text-16 font-medium">경매순위</span>
          <span
            className="font-meduim cursor-pointer rounded border border-[#DBDBDB] px-1 py-0.5 text-14 text-[#767676]"
            onClick={() => setIsModal(true)}
          >
            호가표
          </span>
        </article>
        <table className="mt-4 w-full">
          <tbody className="relative w-full text-center text-14">
            {biddingList && biddingList.length > 0 ? (
              <tr className="h-10">
                <td className="text-left">이름</td>
                <td>금액</td>
                <td>날짜</td>
                <td>시간</td>
              </tr>
            ) : (
              <tr className="my-10">
                <td>현재 입찰한 사람이 존재 하지 않습니다.</td>
              </tr>
            )}
            {biddingList && biddingList.length > 0 && (
              <article>
                <tr className="absolute -left-6 top-10 z-10 h-10 w-[calc(100%+3rem)] bg-brand opacity-25" />
                <tr className="h-10">
                  <td className="text-left">{biddingList[0].memberName}</td>
                  <td className="font-bold text-brand">
                    {priceToString(biddingList[0].price)}
                  </td>
                  <td>
                    {biddingList[0].date.split('-').slice(0, 3).join('-')}
                  </td>
                  <td>
                    {biddingList[0].date.split('-').slice(3, 6).join(':')}
                  </td>
                </tr>
              </article>
            )}
            {biddingList &&
              biddingList.length >= 1 &&
              biddingList.slice(1).map((bidding, idx: number) => (
                <tr className="h-10" key={idx}>
                  <td className="text-left">{bidding.memberName}</td>
                  <td className="font-bold">{priceToString(bidding.price)}</td>
                  <td>{bidding.date.split('-').slice(0, 3).join('-')}</td>
                  <td>{bidding.date.split('-').slice(3, 6).join(':')}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
      <DivisionBar className="absolute inset-x-0 mx-auto mt-6" />
      <form className="my-[3.4375rem]" onSubmit={handleSubmit(onSubmit)}>
        <article>
          <p className="font-meduim text-16">응찰하기</p>
          <p className="mt-1 text-12 text-[#FF3120]">
            응찰버튼을 누르면 바로 응찰되어 취소가 불가능 합니다.
          </p>
        </article>
        <article className="mt-4 flex items-center gap-3">
          <div className="w-full">
            <input
              placeholder="금액을 입력해주세요."
              className="placeholder:text-normal h-[2.625rem] w-full  appearance-none rounded-[0.25rem] border-[#D8D8D8] text-[0.8125rem] placeholder-[#999999] placeholder:text-14"
              type="text"
              {...register('price', {
                required: false,
                validate: (value) => {
                  if (value) {
                    if (artWork?.topPrice === null) {
                      if (
                        +value.replace(/,/g, '') <
                          leatAskPrice(artWork?.beginPrice!) &&
                        +value.replace(/,/g, '') > artWork.beginPrice
                      )
                        return '호가 단위를 확인해주세요.';
                      else return true;
                    } else if (
                      +value.replace(/,/g, '') <
                      leatAskPrice(artWork?.topPrice!)
                    )
                      return '호가 단위를 확인해주세요.';
                  }
                },
              })}
              onChange={handlePriceChange}
              onBlur={() => setIsBlurred(true)}
            />
          </div>
        </article>
        {errors.price && <ErrorMessage message={errors.price.message} />}

        <Button
          text="응찰"
          className="mt-4 w-full"
          disabled={
            remaind < 0 ||
            isMine ||
            moment().isBefore(moment(auction?.startDate, 'YYYY-MM-DD-hh-mm-ss'))
          }
        />
      </form>
      <AskPriceModal
        isModal={isModal}
        message="gg"
        onCloseModal={() => setIsModal(false)}
      />
    </article>
  );
}
