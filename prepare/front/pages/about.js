import React, { useEffect } from 'react';
import Head from 'next/head';
import { END } from 'redux-saga';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';

import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import {LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_USER_REQUEST} from '../reducers/user';
import wrapper from '../store/configureStore';

const About = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);
  if (!me) {
    return null;
  }

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={me.followings} />
        <FollowList header="팔로워 목록" data={me.followers} />
      </AppLayout>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 1,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default About;
