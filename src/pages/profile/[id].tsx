import Navigate from '@components/common/Navigate';
import PickArtistWork from '@components/profile/pick/PickArtistWork';
import { Tab } from '@headlessui/react';
import useDeletePick from '@hooks/mutations/useDeletePick';
import usePostPick from '@hooks/mutations/usePostPick';
import useGetPickDetail from '@hooks/queries/useGetPickDetail';
import Image from 'next/image';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

interface defaultProps {
  [key: string]: any;
}

const PickDetailContainer = tw.div<defaultProps>`
w-full flex items-center mt-5 mb-8
`;

const PickDetailProfile = tw.div<defaultProps>`
w-[3.75rem] mr-[0.625rem] aspect-square flex justify-center items-center rounded-full border-[0.0625rem] border-[#999999] overflow-hidden relative
`;

export default function PickDetail({ userInfo }) {
  const router = useRouter();
  const artistId = Number(router.query.id);

  const { data: pickDetail } = useGetPickDetail(artistId);
  const { member, artworks, pick } = pickDetail || {};

  const { mutate: postPrefer } = usePostPick(artistId);
  const { mutate: deletePrefer } = useDeletePick(artistId);
  const isMine = userInfo?.id === artistId;

  const handlePick = async () => {
    if (pick) {
      deletePrefer();
    } else {
      postPrefer();
    }
  };
  member;

  return (
    <article>
      <Navigate isRightButton={false} message="작가 프로필" />
      <PickDetailContainer>
        <PickDetailProfile>
          {member?.image ? (
            <Image
              src={member?.image}
              alt="profile"
              priority
              fill
              className="object-cover"
            />
          ) : (
            <Image
              src="/svg/icons/profile/avatar.svg"
              alt="user"
              width={40}
              height={40}
            />
          )}
        </PickDetailProfile>
        <div className="flex h-10 flex-col">
          <span className="text-18 font-semibold">{member?.nickname}</span>
          <span className="text-14">{member?.education}</span>
        </div>

        {!isMine && (
          <Image
            alt="like"
            src={`/svg/icons/book_mark${pick ? '_focused' : ''}.svg`}
            width="20"
            height="0"
            className="absolute right-5 cursor-pointer"
            onClick={handlePick}
          />
        )}
      </PickDetailContainer>

      <Tab.Group>
        <Tab.List>
          <Tab className="h-[3.25rem] w-1/2 border-[#191919] text-16 font-bold ui-selected:border-b-[0.1875rem] ui-selected:text-[#191919] ui-not-selected:border-b ui-not-selected:border-[#EDEDED] ui-not-selected:text-[#999999] ">
            작가소개
          </Tab>
          <Tab className="h-[3.25rem] w-1/2 border-[#191919] text-16 font-bold ui-selected:border-b-[0.1875rem] ui-selected:text-[#191919] ui-not-selected:border-b ui-not-selected:border-[#EDEDED] ui-not-selected:text-[#999999] ">
            작품
          </Tab>
        </Tab.List>
        <Tab.Panels className="pt-8">
          <Tab.Panel className="space-y-8">
            {!member?.description &&
              !member?.history &&
              !member?.instagram &&
              !member?.behance && <div>등록된 정보가 없습니다.</div>}
            {member?.description && (
              <div className="space-y-3 text-14">
                <p className="font-semibold">소개</p>
                <p className="text-14 leading-5">{member?.description}</p>
              </div>
            )}
            {member?.history && (
              <div className="space-y-3 text-14">
                <p className="font-semibold">이력</p>
                <p className="text-14 leading-5">{member?.history}</p>
              </div>
            )}
            {(member?.instagram || member?.behance) && (
              <div className="text-14">
                <p className="font-semibold">SNS</p>
                <div className="mt-3 flex flex-col">
                  <div className="mb-2 flex w-1/2 items-center">
                    <Image
                      src="/svg/icons/instagram_black.svg"
                      width={20}
                      height={20}
                      alt="instagram"
                    />
                    <p className="ml-[0.375rem] text-14 leading-5">
                      <a href={member?.instagram}>{member?.instagram}</a>
                    </p>
                  </div>
                  <div className="flex w-1/2 items-center">
                    <Image
                      src="/svg/icons/behance_black.svg"
                      width={20}
                      height={20}
                      alt="behance"
                    />
                    <p className="ml-[0.375rem] text-14 leading-5">
                      <a href={member?.behance}>{member?.behance}</a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel className="space-y-6">
            {artworks && artworks.length > 0 ? (
              artworks?.map((artwork, index: number) => (
                <PickArtistWork
                  key={index}
                  title={artwork?.title}
                  saleStatus={artwork?.saleStatus}
                  onClick={() => {
                    router.push({
                      pathname: '/auction/view',
                      query: { id: artwork.id },
                    });
                  }}
                  image={artwork?.image}
                />
              ))
            ) : (
              <div>등록된 작품이 없습니다.</div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </article>
  );
}
