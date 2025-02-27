import Input from '@components/common/Input';

import SearchItem from '@components/search/SearchItem';
import back from '@public/svg/icons/back.svg';
import Image from 'next/image';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import RecentSearchBox from '@components/search/RecentSearchBox';
import {
  useGetRecentSearch,
  useGetSearch,
} from '@hooks/queries/useGetSearchArtWork';
import { useDeleteAllWord } from '@hooks/mutations/useDeleteWord';
import FilterDropdown from '@components/search/FilterDropdown';
import KeywordBox from '@components/common/KeywordBox';

interface Genre {
  id: string;
  name: string;
}

const GENRELIST: Genre[] = [
  { id: '1', name: '동양화' },
  { id: '2', name: '한국화' },
  { id: '3', name: '서양화' },
  { id: '4', name: '조각' },
  { id: '5', name: '공예' },
  { id: '6', name: '서예' },
  { id: '7', name: '판화' },
  { id: '8', name: '드로잉' },
  { id: '9', name: '사진' },
  { id: '10', name: '리빙' },
  { id: '11', name: '패션' },
  { id: '12', name: '일러스트' },
  { id: '13', name: '제품' },
  { id: '14', name: '기타' },
];

interface DefaultProps {
  [key: string]: any;
}

const SearchBox = tw.header<DefaultProps>`
flex justify-between items-center font-semibold relative h-[4rem] mt-7
`;

export default function Search() {
  const [searchWord, setSearchWord] = useState<string>('');
  const [status, setStatus] = useState<string[]>([]);
  const [value, setValue] = useState<string>('');
  const router = useRouter();

  const { handleSubmit } = useForm<RecentSearch>();
  const { data: searchResults } = useGetSearch(searchWord, status);
  const { data: RecentWords } = useGetRecentSearch();
  const { mutate: deleteAllWords } = useDeleteAllWord();

  const handleValue = (e) => {
    setValue(() => e.target.value);
    if (!e.target.value) {
      setSearchWord('');
    }
  };
  const clearValue = () => {
    setValue('');
  };

  const onSubmit = () => {
    router.push(`search/?word=${value}`);
    setSearchWord(value);
  };

  const handleRecentWord = ({ word }) => {
    setSearchWord(word);
    router.push(`search/?word=${word}`);
    setValue(word);
  };

  const handleDeleteAll = () => {
    deleteAllWords();
  };

  const handleRecommendKeyword = (keyword: string) => {
    setValue(keyword);
    router.push(`search/?word=${keyword}`);
    setSearchWord(keyword);
  };

  const page = useMemo(() => {
    return router.query.word !== undefined ? router.query.word : '';
  }, [router.query]);

  useEffect(() => {
    page;
    setValue(page + '');
    setSearchWord(page + '');
  }, [page]);

  return (
    <article>
      <SearchBox>
        <div
          className="grow-[1]"
          onClick={() => {
            setValue('');
            router.back();
          }}
        >
          <Image src={back} alt="back" />
        </div>
        <form className="grow-[5]" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="h-[2.625rem] border-none bg-[#F1F1F5]"
            type="text"
            placeholder="검색어를 입력해주세요"
            value={value}
            onChange={handleValue}
          />
          <div
            className="absolute inset-y-0 bottom-0 right-3 top-0 m-auto flex cursor-pointer items-center text-20 font-medium"
            onClick={() => {
              setValue('');
            }}
          >
            x
          </div>
        </form>
      </SearchBox>
      {!!page ? (
        <div>
          <FilterDropdown setStatus={setStatus} />
          <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-y-5">
            {searchResults?.map((artwork: SearchArtWork, idx) => (
              <SearchItem artwork={artwork} key={+idx} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <section>
            <div className="mt-6 flex flex-col justify-between">
              <div className="text-base font-semibold ">장르</div>
              <div className="mt-2 flex flex-wrap">
                {GENRELIST.map((genre) => (
                  <KeywordBox
                    key={genre.id}
                    onClick={() => handleRecommendKeyword(genre.name)}
                    text={genre.name}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
      {RecentWords && RecentWords.length > 0 && !page && (
        <div>
          <section className="mt-[2.375rem]">
            <div className="flex justify-between">
              <span className="text-base font-semibold">최근 검색어</span>
              <span
                className="cursor-pointer text-xs leading-6 text-[#999999]"
                onClick={handleDeleteAll}
              >
                모두 지우기
              </span>
            </div>
            <div className="mt-[0.9375rem]">
              <ul className="m-auto flex flex-wrap">
                {RecentWords?.map((word: RecentSearch, idx) => (
                  <RecentSearchBox
                    key={idx}
                    data={word}
                    handleRecentWord={() => handleRecentWord(word)}
                  />
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}
    </article>
  );
}
