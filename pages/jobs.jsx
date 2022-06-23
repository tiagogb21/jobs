import styled from 'styled-components';
import { Button, Card, Container, Dropdown, List, Segment } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as React from 'react';

import PropTypes from 'prop-types';

const BASE_URL = 'https://www.zippia.com/api/jobs/';

const jobsInfo = {
  companySkills: true,
  dismissedListingHashes: [],
  fetchJobDesc: true,
  jobTitle: 'Business Analyst',
  locations: [],
  numJobs: 20,
  previousListingHashes: [],
};

const minutes = 60;
const seconds = 60;
const hours = 24;
const week = 7;

const mobile = `@media (max-width: 800px)`;

export const getServerSideProps = async () => {
  const res = await axios.post(BASE_URL, jobsInfo);
  return {
    props: {
      data: res.data.jobs,
    },
  };
};

const Jobs = ({ data }) => {
  const [company, setCompany] = useState('');
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobTimeStamp, setJobTimeStamp] = useState(0);
  const [showCards, setShowCards] = useState(true);

  useEffect(() => {
    async function load() {
      const getData = await data;
      const newSet = new Set();
      for (let item of getData) {
        newSet.add(item.companyName);
      }
      const getCompanies = [...newSet];
      const teste = getCompanies.map((company) => ({
        key: company,
        text: company,
        value: company,
      }));
      setCompaniesOptions(teste);
    }
    load();
  }, [data]);

  useEffect(() => {
    async function load() {
      const getData = await data;
      console.log(getData);
      const filterJob = getData
        .filter(({ companyName }) => (company !== '' ? companyName === company : true))
        .filter((job) =>
          jobTimeStamp ? new Date(job.OBJpostingDate).getTime() > jobTimeStamp : true
        );
      setFilteredJobs(filterJob);
    }
    load();
  }, [data, company, jobTimeStamp]);

  const time = () => new Date().getTime() - 1000 * minutes * seconds * hours * week;

  return (
    <>
      {data !== undefined && (
        <StyledForContainer>
          <StyledForHeader>
            <StyledForDropdown
              placeholder="Company"
              options={[
                {
                  key: '',
                  text: '',
                  value: '',
                },
              ].concat(companiesOptions)}
              onChange={(event, data) => setCompany(data.value)}
              value={company}
            />
            <Button
              toggle
              active={jobTimeStamp !== undefined}
              onClick={() => setJobTimeStamp(jobTimeStamp === undefined ? 0 : time())}
            >
              Show last 7 days
            </Button>
            <Button toggle active={showCards} onClick={() => setShowCards(!showCards)}>
              Show cards
            </Button>
            <Button
              onClick={() => {
                setCompany('');
                setJobTimeStamp(0);
                setShowCards(true);
              }}
            >
              Reset
            </Button>
          </StyledForHeader>
          {showCards ? (
            <StyledForCards itemsPerRow={4} stackable>
              {filteredJobs !== undefined &&
                filteredJobs.slice(0, 10).map((job) => {
                  return (
                    <StyledForCard key={job.jobId}>
                      <Card.Content>
                        <Card.Header>{job.jobTitle}</Card.Header>
                        <Card.Meta>
                          {job.companyName}
                          <br />
                          {job.postedDate}
                        </Card.Meta>
                        <Card.Description>{job.shortDesc}...</Card.Description>
                      </Card.Content>
                    </StyledForCard>
                  );
                })}
            </StyledForCards>
          ) : (
            <List divided relaxed>
              {filteredJobs !== undefined &&
                filteredJobs.slice(0, 10).map((job) => {
                  return (
                    <List.Item key={job.jobId}>
                      <List.Content>
                        <List.Header>{job.jobTitle}</List.Header>
                        <List.Description>{job.shortDesc}...</List.Description>
                      </List.Content>
                    </List.Item>
                  );
                })}
            </List>
          )}
        </StyledForContainer>
      )}
    </>
  );
};

const StyledForContainer = styled(Container)`
  ${mobile} {
    margin-left: 1em !important;
    margin-right: 1em !important;
  }
`;

const StyledForHeader = styled(Segment)`
  ${mobile} {
    > * {
      margin-bottom: 1em !important;
    }
  }
`;

const StyledForDropdown = styled(Dropdown)`
  margin-right: 20px;
`;

const StyledForCards = styled(Card.Group)`
  ${mobile} {
    margin-left: 0 !important;
    margin-right: -2em !important;
    margin-top: -4px !important;
  }
`;

const StyledForCard = styled(Card)`
  border: 1px solid #d4d4d5 !important;
  box-shadow: 0 30px 30px -30px rgba(0, 0, 0, 0.2) !important;
  ${mobile} {
    margin-top: 10px;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
`;

Jobs.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object,
}.isRequired;

export default Jobs;
