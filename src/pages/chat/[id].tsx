import ChattingMessage from '@components/chat/ChatMessage';
import Layout from '@components/common/Layout';
import Modal from '@components/common/Modal';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useGetChatRoom from '@hooks/queries/chat/useGetChatRoom';
import * as StompJs from '@stomp/stompjs';
import { createClient, publish, subscribe } from '@apis/chat/socketConnect';
import chatApi from '@apis/chat/chatApi';
import useGetProfile from '@hooks/queries/useGetProfile';
import { isUser } from '@utils/isUser';
import moment from 'moment';
import 'moment/locale/ko';

interface ContentForm {
  message: string;
  image: FileList;
}

export default function ChatRoom() {
  const router = useRouter();
  const client = useRef({}) as React.MutableRefObject<StompJs.Client>;
  const scrollRef: any = useRef();

  const id = Number(router.query.id);

  const { register, handleSubmit, watch, reset } = useForm<ContentForm>();
  const { data: chatRoom, refetch: refetchChatRoom } = useGetChatRoom(+id);
  const { artist, member, messages } = chatRoom || {};
  const { data: userInfo } = useGetProfile();
  const userId = userInfo?.id || 0;

  const [isModal, setIsModal] = useState(false);
  const [isPreparingModal, setIsPreparingModal] = useState(false);

  const onAccept = async () => {
    await chatApi.deleteChatRoom(id);
    router.push('/chat');
  };

  const sendImage = (e) => {
    // const reader = new FileReader();
    // reader.readAsDataURL(e.target.files[0]);
    // reader.onload = () => {
    //   const base64data = reader.result;
    //   publishImage(client.current, id, userInfo?.id, base64data);
    // };
    setIsPreparingModal(true);
  };

  const connect = async () => {
    client.current = await createClient('/ws-connection');
    client.current.onConnect = await onConnected;
    await client.current.activate();
  };

  const onConnected = () => {
    subscribe(client.current, id, subscribeCallback, true);
  };

  const subscribeCallback = () => {
    reset({ message: '' });
    refetchChatRoom();
  };

  const disconnect = () => {
    if (client != null && client.current.connected) {
      client.current.deactivate();
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  const onSubmit = (form: { message: string; image: FileList }) => {
    if (!client.current.connected) return;
    publish(client.current, id, userInfo?.id, form?.message);
  };

  useEffect(() => {
    scrollRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }, [messages]);

  return (
    <Layout>
      <Modal
        message="아직 준비 중인 서비스예요."
        isModal={isPreparingModal}
        onCloseModal={() => {
          setIsPreparingModal(false);
        }}
        denyMessage="나가기"
        onAccept={() => {
          setIsPreparingModal(false);
        }}
      />
      <Modal
        isMain
        message="채팅방을 나가면 채팅 목록 및 대화내용이 삭제 됩니다.
채팅방에서 나가시겠어요?"
        isModal={isModal}
        onCloseModal={() => {
          setIsModal(false);
        }}
        denyMessage="나가기"
        onAccept={onAccept}
      />
      <header className="fixed inset-x-0 top-0 mx-auto h-[9.0625rem] max-w-[26.25rem] bg-[#FC6554]">
        <article className="relative mt-[4.375rem] flex w-full px-5 text-white">
          <Image
            src="/svg/icons/back_white.svg"
            alt="back"
            width="11"
            height="0"
            onClick={() => router.push('/chat')}
            className="cursor-pointer"
          />
          <div className="px-5 text-16 ">
            {isUser ? artist?.name : member?.name}
          </div>
          <div className="flex items-center text-12">
            {messages &&
              messages.length > 0 &&
              '응답시간 :' +
                moment(
                  messages && messages[messages.length - 1]?.sendDate,
                  'YYYY-MM-DD-HH-mm-ss',
                ).fromNow()}
          </div>
          <Image
            src="/svg/icons/option.svg"
            alt="option"
            width="3"
            height="0"
            className="absolute right-5 cursor-pointer"
            onClick={() => {
              setIsModal(true);
            }}
          />
        </article>
      </header>
      <section
        className="overflow absolute inset-x-0 top-[7.5rem] w-full  rounded-xl bg-white p-5"
        ref={scrollRef}
      >
        <article className="flex h-[2.5rem] items-center justify-center text-center text-14 font-bold text-[#767676]">
          {messages &&
            messages.length > 0 &&
            moment(
              messages && messages[0]?.sendDate,
              'YYYY-MM-DD-HH-mm-ss',
            ).format('YYYY년 MM월 DD일')}
        </article>
        <article className="mt-4">
          {messages &&
            messages.map((message: Message, idx: number) => (
              <ChattingMessage
                key={idx}
                sender={+userId === message?.senderId ? 'me' : 'you'}
                sendDate={message.sendDate}
                content={message.content}
              />
            ))}
        </article>
        <div className="h-20" />
      </section>
      <div className="fixed inset-x-0 bottom-0 mx-auto flex h-[4.375rem] w-full max-w-[26.25rem] justify-center bg-white px-[1.25rem]">
        <form
          className="flex h-[3.125rem] w-full items-center rounded-[1.5313rem] px-[0.625rem]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            className="h-full w-full appearance-none rounded-[1.5313rem] border-none bg-[#F8F8FA] px-[1.25rem]  text-14  font-semibold placeholder:text-[#999999] "
            placeholder="메세지를 입력해주세요."
            {...register('message', { required: true })}
          />
          {watch('message') ? (
            <button className="absolute right-[2.5rem] cursor-pointer">
              <Image alt="" src="/svg/icons/send.svg" width="22" height="0" />
            </button>
          ) : (
            <>
              <label
                className="flex items-center justify-center"
                htmlFor="profileImage"
              >
                <Image
                  src="/svg/icons/picture.svg"
                  alt="picture"
                  width="25"
                  height="0"
                  className="absolute right-[2.5rem] cursor-pointer"
                />
              </label>
              <input
                // type="file"
                id="profileImage"
                accept="image/*"
                className="hidden "
                {...register('image')}
                // onChange={sendImage}
                onClick={sendImage}
              />
            </>
          )}
        </form>
      </div>
    </Layout>
  );
}
