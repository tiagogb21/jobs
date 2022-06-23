import styled from 'styled-components';
import { Button, Card, Container, Dropdown, List, Segment } from 'semantic-ui-react';
import { useMemo, useState } from 'react';
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

const mobile = `@media (max-width: 768px)`;

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
  const [jobTimeStamp, setJobTimeStamp] = useState(0);
  const [showCards, setShowCards] = useState(true);

  const companies = useMemo(() => {
    const newSet = new Set();
    data.forEach(({ companyName }) => newSet.add(companyName));
    return Array.from(newSet.values());
  }, [data]);

  const enterpriseOptions = useMemo(() => {
    companies.map((company) => ({
      key: company,
      text: company,
      value: company,
    }));
  }, [companies]);

  const filteredJobs = useMemo(() => {
    data
      .filter(({ companyName }) => (company !== '' ? companyName === company : true))
      .filter(({ job }) =>
        jobTimeStamp ? new Date(job.OBJpostingDate).getTime() > jobTimeStamp : true
      );
  }, [data, company, jobTimeStamp]);

  const time = () => new Date().getTime() - 1000 * minutes * seconds * hours * week;

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledDropdown
          placeholder="Company"
          options={[
            {
              key: '',
              text: '',
              value: '',
            },
          ].concat(enterpriseOptions)}
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
      </StyledHeader>
      {showCards ? (
        <StyledCards itemsPerRow={4} stackable>
          {filteredJobs.slice(0, 10).map((job) => {
            return (
              <StyledCard key={job.jobId}>
                <Card.Content>
                  <Card.Header>{job.jobTitle}</Card.Header>
                  <Card.Meta>
                    {job.companyName}
                    <br />
                    {job.postedDate}
                  </Card.Meta>
                  <Card.Description>{job.shortDesc}...</Card.Description>
                </Card.Content>
              </StyledCard>
            );
          })}
        </StyledCards>
      ) : (
        <List divided relaxed>
          {filteredJobs.slice(0, 10).map((job) => {
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
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  ${mobile} {
    margin-left: 0.5em !important;
    margin-right: 0.5em !important;
  }
`;

const StyledHeader = styled(Segment)`
  ${mobile} {
    > * {
      margin-bottom: 0.5em !important;
    }
  }
`;

const StyledDropdown = styled(Dropdown)`
  margin-right: 10px;
`;

const StyledCards = styled(Card.Group)`
  ${mobile} {
    margin-left: 0 !important;
    margin-right: -2em !important;
    margin-top: -4px !important;
  }
`;

const StyledCard = styled(Card)`
  border: 1px solid #d4d4d5 !important;
  box-shadow: 0 22px 23px -19px rgba(0, 0, 0, 0.2) !important;
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
