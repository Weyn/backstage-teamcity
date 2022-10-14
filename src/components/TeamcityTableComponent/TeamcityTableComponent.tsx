import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Cancel from '@material-ui/icons/Cancel';
import Launch from '@material-ui/icons/Launch';
import { useEntity } from '@backstage/plugin-catalog-react';
import { TEAMCITY_ANNOTATION } from '../../routes';
import { Link } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles({
  verticalCenter: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  pl3: {
    paddingLeft: '3px'
  },
  success: {
    color: '#388e3c',
  },
  error: {
    color: '#c62828',
  }
});

type Build = {
  status: string;
  statusText: string;
  finishDate: string;
  startDate: string;
  branchName: string;
  revisions: RevisionsCollection;
};

type BuildType = {
  name: string;
  status: string;
  webUrl: string;
  builds: {
    build: Build[];
  }
};

type RevisionsCollection = {
  revision: Revision[];
};

type Revision = {
  version: string;
};

type DenseTableProps = {
  builds: BuildType[];
};

export const DenseTable = ({ builds }: DenseTableProps) => {
  const classes = useStyles();
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Source', field: 'branchName' },
    { title: 'Status', field: 'status' },
    { title: 'Finished At', field: 'finishedAt' },
    { title: 'Url', field: 'webUrl' },
  ];
  const data = builds.map(build => {
    let isSuccess = true;
    let finishedAt = '';
    let startedAt = '';
    let branchName = '';
    let revision = '';

    if (build?.builds?.build?.length >= 0) {
        isSuccess = build?.builds?.build[0].status === 'SUCCESS';
        startedAt = moment(build?.builds?.build[0]?.startDate).format('MMM Do, HH:mm');
        finishedAt = moment(build?.builds?.build[0]?.finishDate).format('MMM Do, HH:mm');
        branchName = build?.builds?.build[0].branchName;
        const revisions = build?.builds?.build[0]?.revisions?.revision;
        revision = build?.builds?.build[0]?.revisions?.revision[revisions.length-1]?.version.substring(0, 7);
    }
    
    return {
      name: build.name,
      branchName: `${branchName} (${revision})`,
      status: (
        <p className={[isSuccess ? classes.success : classes.error, classes.verticalCenter].join(' ')}>
          {isSuccess ? (<CheckCircle fontSize="small"/>) : (<Cancel fontSize="small"/>)}
          <span className={classes.pl3}>
            {build.builds.build[0].statusText}
          </span>
        </p>
      ),
      finishedAt: `${finishedAt}`,
      webUrl: (
        <Link
          href={build.webUrl}
          target="_blank"
        ><Launch fontSize="small"/></Link>
      ),
    };
  });

  return (
    <Table
      title="Builds"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

/** @public */
export const TeamcityTableComponent = () => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<BuildType[]> => {
  const backendUrl = config.getString('backend.baseUrl');
  const response = await fetch(`${backendUrl}/api/proxy/teamcity-proxy/app/rest/buildTypes?locator=affectedProject:(id:${entity.metadata.annotations?.[TEAMCITY_ANNOTATION]})&fields=buildType(id,name,webUrl,builds($locator(running:false,count:1),build(number,status,statusText,branchName,revisions,startDate,finishDate)))`);
  const data = await response.json();
    
    return data.buildType;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable builds={value || []} />;
};
