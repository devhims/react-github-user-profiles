import React, { useContext } from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

const Repos = () => {
  const { repos } = useContext(GithubContext);

  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total;

    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});

  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .slice(0, 5)
    .map((entry) => {
      return { ...entry, value: entry.stars };
    })
    .filter((entry) => {
      return entry.value > 0;
    });

  // stars, forks

  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[name] = { label: name, value: stargazers_count };
      total.forks[name] = { label: name, value: forks };
      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );

  stars = Object.values(stars)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5)
    .filter((entry) => {
      return entry.value > 0;
    });

  forks = Object.values(forks)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5)
    .filter((entry) => {
      return entry.value > 0;
    });

  // let languages = [];
  // repos.forEach((entry) => {
  //   if (entry.language && !languages.includes(entry.language)) {
  //     languages.push(entry.language);
  //   }
  // });

  // let count = 0;
  // let pairs = [];

  // languages.forEach((language) => {
  //   repos.forEach((entry) => {
  //     if (entry.language === language) {
  //       count++;
  //     }
  //   });
  //   pairs.push({ label: language, value: count.toString() });
  //   count = 0;
  // });

  // console.log(pairs);
  // const chartData = [
  //   {
  //     label: 'Javascript',
  //     value: '90',
  //   },
  //   {
  //     label: 'Python',
  //     value: '30',
  //   },
  //   {
  //     label: 'C#',
  //     value: '95',
  //   },
  // ];
  return (
    <section className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartData} /> */}
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
