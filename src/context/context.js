import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({ show: false, msg: '' });

  // check rate
  const checkRequests = async () => {
    try {
      // directly in json
      const response = await axios(`${rootUrl}/rate_limit`);
      let {
        data: {
          rate: { remaining },
        },
      } = response;
      setRequests(remaining);

      if (remaining === 0) {
        // throw an error
        toggleError(true, 'sorry, hourly rate limit exceeded');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    try {
      const response = await axios(`${rootUrl}/users/${user}`);
      console.log(response);
      setGithubUser(response.data);

      if (response) {
        const { followers_url, repos_url } = response.data;
        try {
          const results = await Promise.allSettled([
            axios(`${followers_url}?per_page=100`),
            axios(`${repos_url}?per_page=100`),
          ]);

          const [followers, repos] = results;

          if (followers.status === 'fulfilled') {
            setFollowers(followers.value.data);
          }

          if (repos.status === 'fulfilled') {
            setRepos(repos.value.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
      toggleError(true, 'user not found');
    }

    checkRequests();
    setIsLoading(false);
  };

  const toggleError = (show = false, msg = '') => {
    setError({ show, msg });
  };

  useEffect(() => {
    checkRequests();
  }, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
