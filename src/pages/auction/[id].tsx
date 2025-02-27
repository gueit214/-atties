import chatApi from '@apis/chat/chatApi';
import Guarantee from '@components/auction/Guarantee';
import KeywordBox from '@components/common/KeywordBox';

import useDeletePrefer from '@hooks/mutations/useDeletePrefer';
import usePostPrefer from '@hooks/mutations/usePostPrefer';
import { useCountDown } from '@hooks/useCountDown';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Button from 'stories/Button';

interface ViewProps {
  userInfo: User;
  detailData: ArtworkDetail;
  id: number;
}
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params || {};
  const resArtwork = await axios.get(`art-works/${id}`);
  return { props: { detailData: resArtwork.data, id } };
};

export default function View({ userInfo, detailData, id }: ViewProps) {
  const router = useRouter();
  const { artWork, artist } = detailData || {};

  const { mutate: postPrefer } = usePostPrefer(artWork?.id!, '/auction');
  const { mutate: deletePrefer } = useDeletePrefer(artWork?.id!, '/auction');
  const [days, hours, minutes, seconds] = useCountDown?.(
    detailData?.endDate || '',
  );
  const remaind = +days + +hours + +minutes + +seconds;
  const isMine = userInfo?.id === artist?.id;

  const handleChat = async () => {
    const chatData = await chatApi.postChatRoom({
      artistId: artist?.id!,
      artWorkId: id,
    });
    router.push(`/chat/${chatData?.chatRoomId}`);
  };

  const handlePreferButton = () => {
    if (detailData?.preferred) {
      deletePrefer();
    } else {
      postPrefer();
    }
  };

  const target = useRef<HTMLDivElement | null>(null);
  const [isCardOver, setIsCardOver] = useState(false);
  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.boundingClientRect.y < 64) {
        setIsCardOver(true);
      } else {
        setIsCardOver(false);
      }
    });
  };

  useEffect(() => {
    let observer: IntersectionObserver;
    if (target && target.current) {
      observer = new IntersectionObserver(onIntersect, {
        rootMargin: `0px 0px -${window.innerHeight - 64}px 0px`,
      });
      observer.observe(target.current);
    }
    return () => observer && observer.disconnect();
  }, [target]);

  return (
    <article>
      <section>
        <div
          className={`fixed inset-x-0 top-0 z-50 mx-auto flex h-24 w-full max-w-[26.25rem] items-center justify-between px-5 ${
            isCardOver && 'bg-white'
          }`}
        >
          {isCardOver ? (
            <section>
              <Image
                onClick={() => router.back()}
                alt="back"
                src="/svg/icons/auction/arrow_black.svg"
                width="24"
                height="24"
                className="cursor-pointer"
              />
              {!isMine && detailData?.preferred && (
                <Image
                  onClick={handlePreferButton}
                  alt="prefer"
                  src="/svg/icons/heart_filled.svg"
                  width="24"
                  height="24"
                  className="cursor-pointer"
                />
              )}
              {!isMine && !detailData?.preferred && (
                <Image
                  onClick={handlePreferButton}
                  alt="prefer"
                  src="/svg/icons/auction/heart_black.svg"
                  width="24"
                  height="24"
                  className="cursor-pointer"
                />
              )}
            </section>
          ) : (
            <section>
              <Image
                alt="back"
                src="/svg/icons/auction/arrow_white.svg"
                width="24"
                height="24"
                className="cursor-pointer"
                onClick={() => router.back()}
              />
              {!isMine && detailData?.preferred && (
                <Image
                  onClick={handlePreferButton}
                  alt="prefer"
                  src="/svg/icons/heart_filled.svg"
                  width="24"
                  height="24"
                  className="cursor-pointer"
                />
              )}

              {!isMine && !detailData?.preferred && (
                <Image
                  onClick={handlePreferButton}
                  alt="prefer"
                  src="/svg/icons/auction/heart_white.svg"
                  width="24"
                  height="24"
                  className="cursor-pointer"
                />
              )}
            </section>
          )}
        </div>

        <section className="absolute inset-x-0 top-0 h-60">
          <Image
            alt="detail"
            src={artWork?.images[0] || '/svg/example/detail.svg'}
            fill
            className="object-cover"
            quality={100}
          />
        </section>
        <section
          ref={target}
          className="absolute inset-x-0 top-[13rem] h-full rounded-2xl bg-white px-6 py-8"
        >
          <section>
            <div>
              <div className="flex items-center justify-between">
                <span className="max-w-[12rem] text-18 font-semibold">
                  {artWork?.title}
                </span>
                {remaind > 0 ? (
                  !Number.isNaN(+days) && (
                    <span className="text-14">
                      <span className="rounded-l-md bg-[#F8F8FA] px-2 py-1 text-brand">
                        마감까지
                      </span>

                      <span className="rounded-r-md bg-brand px-2 py-1 text-[#FFFFFF]">
                        {
                          <span
                            className={`${
                              +days >= 1 ? 'w-fit' : 'w-[4.125rem]'
                            } text-[0.875rem] font-medium tracking-widest`}
                          >
                            {+days >= 1
                              ? 'D-' + days
                              : hours + ':' + minutes + ':' + seconds}
                          </span>
                        }
                      </span>
                    </span>
                  )
                ) : (
                  <span className="flex rounded-md border border-[#999999] px-2 py-0.5 text-14 text-[#999999]">
                    <Image
                      alt="clock"
                      src="/svg/icons/clock_gray.svg"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    00:00:00
                  </span>
                )}
              </div>
              <div className="mt-3 text-14">{artist?.artistEducation}</div>
            </div>
          </section>
          <section className="space-y-3 py-8 text-14 leading-[0.875rem]">
            <p>
              <span className="inline-block w-[6rem] text-[#767676]">
                작가명
              </span>
              <span className="text-[#191919]">{artist?.artistName}</span>
            </p>
            <p>
              <span className="inline-block w-[6rem] text-[#767676]">
                제작연도
              </span>
              <span className="text-[#191919]">{artWork?.productionYear}</span>
            </p>
            <p>
              <span className="inline-block w-[6rem] text-[#767676]">장르</span>
              <span className="text-[#191919]">{artWork?.genre}</span>
            </p>
            <p>
              <span className="inline-block w-[6rem] text-[#767676]">재료</span>
              <span className="text-[#191919]">{artWork?.material}</span>
            </p>
            <p>
              <span className="inline-block w-[6rem] text-[#767676]">액자</span>
              <span className="text-[#191919]">
                {artWork?.frame ? '있음' : '없음'}
              </span>
            </p>
            <p>
              <span className="inline-block w-[6rem] text-[#767676]">크기</span>
              <span className="text-[#191919]">
                {artWork?.artWorkSize?.width}x{artWork?.artWorkSize?.length}x
                {artWork?.artWorkSize?.height} | {artWork?.artWorkSize?.size}호
              </span>
            </p>
          </section>
          <div className="mt-8 border-y border-y-[#EDEDED] py-8">
            <div className="flex w-[4.625rem] flex-col items-center justify-center">
              <p className="w-full text-center font-medium">작가프로필</p>
              <div className="relative my-2 flex aspect-square w-[4rem] cursor-pointer items-center justify-center overflow-hidden rounded-full border  border-[#999999]">
                {artist?.artistImage ? (
                  <Image
                    src={artist?.artistImage}
                    alt="profile"
                    priority
                    fill
                    className="object-cover"
                    onClick={() => {
                      router.push({
                        pathname: `/profile/${artist?.id}`,
                      });
                    }}
                  />
                ) : (
                  <Image
                    src="/svg/icons/profile/avatar.svg"
                    alt="user"
                    width={40}
                    height={40}
                    onClick={() => {
                      router.push({
                        pathname: `/profile/${artist?.id}`,
                      });
                    }}
                  />
                )}
              </div>
              <div className="w-fulltext-center ">{artist?.artistName}</div>
            </div>
          </div>

          <section className="border-b py-8 font-medium">
            <div className="text-16">작품 설명</div>
            <div className="mt-2 text-10 text-brand">
              세부 사항 등 궁금한 점은 채팅으로 작가와 소통 할 수 있어요.
            </div>
            <div className="mt-4">
              <p className="text-14">{artWork?.description}</p>
              <div className="mt-4 flex flex-wrap">
                {artWork?.keywords?.map((keyword: string, idx: number) => (
                  <KeywordBox text={keyword} key={idx} />
                ))}
              </div>
            </div>
          </section>
          <section>
            {artWork?.images.slice(1).map((image: string, idx: number) => (
              <div key={idx} className="relative mt-8 aspect-square w-full">
                <Image
                  src={image}
                  alt="artwork"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ))}
          </section>
          {artWork && artist && (
            <Guarantee
              mainImage={artWork?.images[0]}
              guaranteeImage={artWork?.guaranteeImage}
              title={artWork?.title}
              nickname={artist?.artistName}
              productionYear={artWork?.productionYear}
              genre={artWork?.genre}
              width={artWork?.artWorkSize?.width}
              length={artWork?.artWorkSize?.length}
              height={artWork?.artWorkSize?.height}
            />
          )}
          <div className="h-[7rem]" />
        </section>
      </section>
      {
        <section className="fixed inset-x-0 bottom-0 mx-auto max-w-[26.25rem]">
          <div className="to-gray-10 h-[1.125rem] bg-gradient-to-t from-white" />
          <div className="m-auto flex w-full gap-5 bg-white  px-6 pb-3 shadow-lg">
            <Button
              text="채팅하기"
              kind="outlined"
              onClick={handleChat}
              disabled={isMine}
            />
            <Button
              text="응찰하기"
              onClick={() =>
                router.push({
                  pathname: '/auction/bidding/' + id,
                })
              }
              disabled={remaind <= 0}
            />
          </div>
        </section>
      }
    </article>
  );
}
