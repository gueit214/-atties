import Image from 'next/image';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/router';
import useDeletePrefer from '@hooks/mutations/useDeletePrefer';

interface DefaultProps {
  [key: string]: any;
}

const WishCardContainer = tw.div<DefaultProps>`
rounded-lg hover:ring-1 hover:ring-blue-500 cursor-pointer relative
`;

export default function WishCard({ wish }) {
  const router = useRouter();
  const { mutate: deletePrefer } = useDeletePrefer(wish?.id, '/wish');
  const handlePrefer = (e) => {
    e.stopPropagation();
    deletePrefer();
  };
  const statusArr: string[] = [wish.saleStatus];
  if (!wish.hot) {
    statusArr.push('HOT');
  }

  return (
    <WishCardContainer
      onClick={() => {
        router.push(`/auction/view?id=${wish.id}`);
      }}
    >
      <div className="relative h-28  rounded-t-lg bg-gray-300">
        <Image
          className="rounded-t-lg object-cover"
          src={wish?.image || '/svg/icons/favorite.svg'}
          alt="favorite"
          fill
        />
      </div>
      <div className="h-30 rounded-b-lg border-x-[0.0625rem] border-b-[0.0625rem] border-[#ededed] p-3">
        <div className="flex w-[5.25rem] text-[0.625rem] text-white">
          {statusArr.map((status, idx) => (
            <div
              className={`h-[1.0625rem] w-1/2 bg-[${
                status === '입찰중'
                  ? '#4B9E77'
                  : status === 'HOT'
                  ? '#F5535D'
                  : status === '입찰완료'
                  ? '#191919'
                  : status === '경매전'
                  ? '#7B61FF'
                  : ''
              }]  flex items-center justify-center text-10`}
              key={idx}
            >
              {status}
            </div>
          ))}
        </div>
        <div className="pt-[0.375rem]">
          <div className="text-14 leading-4">{wish.title}</div>
          <div className="text-12 leading-6">{wish.artist}</div>
          <div className="text-14 font-bold leading-6 ">
            {wish.price.toLocaleString()}원
          </div>
        </div>
      </div>

      <Image
        alt="prefer"
        src="/svg/icons/heart_filled.svg"
        width={20}
        height={20}
        className="absolute right-3 top-3"
        onClick={handlePrefer}
      />
    </WishCardContainer>
  );
}
