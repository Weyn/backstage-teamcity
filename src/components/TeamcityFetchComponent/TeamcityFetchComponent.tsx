import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Cancel from '@material-ui/icons/Cancel';
import { useEntity } from '@backstage/plugin-catalog-react';
import { TEAMCITY_ANNOTATION } from '../../routes';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type BuildStatus = {
  status: string;
  statusText: string;
};
type Build = {
  name: string;
  status: string;
  webUrl: string;
  builds: {
    build: BuildStatus[];
  }
};

type DenseTableProps = {
    builds: Build[];
};

export const DenseTable = ({ builds }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Status', field: 'status' },
    { title: 'Url', field: 'webUrl' },
  ];

  const data = builds.map(build => {
    const isSuccess = build?.builds?.build[0].status === 'SUCCESS';
    
    return {
      name:  build.name,
      status: (
        <span style={{color: isSuccess ? 'green' : 'red'}}>
            {isSuccess ? (<CheckCircle/>) : (<Cancel/>)}
            {build.builds.build[0].statusText}
        </span>
      ),
      webUrl: (
        <a
          href={build.webUrl}
          target="_blank"
        > Open </a>
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

export const TeamcityFetchComponent = () => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<Build[]> => {
    const backendUrl = config.getString('backend.baseUrl');
    const response = await fetch(`${backendUrl}/api/proxy/teamcity-proxy/app/rest/buildTypes?locator=affectedProject:(id:${entity.metadata.annotations?.[TEAMCITY_ANNOTATION]})&fields=buildType(id,name,webUrl,builds($locator(running:false,count:1),build(number,status,statusText,finishDate)))`);
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
