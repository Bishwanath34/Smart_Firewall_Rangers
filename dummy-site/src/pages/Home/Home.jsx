import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import UserSession from '../../components/UserSession/UserSession';
import ActionSection from '../../components/ActionSection/ActionSection';
import ResponseDisplay from '../../components/ResponseDisplay/ResponseDisplay';
import useApi from '../../hooks/useApi';
import { ACTION_TYPES } from '../../utils/constants';
import styles from './Home.module.css';

const Home = () => {
  const [userId, setUserId] = useState("alice");
  const [role, setRole] = useState("user");
  const { loading, lastRequest, callApi } = useApi();

  const handleApiCall = async (path) => {
    await callApi(path, userId, role);
  };

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <UserSession
          userId={userId}
          setUserId={setUserId}
          role={role}
          setRole={setRole}
        />

        <ActionSection
          type={ACTION_TYPES.NORMAL}
          onActionClick={handleApiCall}
          loading={loading}
        />

        <ActionSection
          type={ACTION_TYPES.SUSPICIOUS}
          onActionClick={handleApiCall}
          loading={loading}
        />

        <ResponseDisplay
          loading={loading}
          lastRequest={lastRequest}
        />
      </main>
    </div>
  );
};

export default Home;