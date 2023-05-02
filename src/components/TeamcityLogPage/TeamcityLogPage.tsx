import {
  Box,
  Card,
  Typography,
} from '@material-ui/core';
// @ts-ignore
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { buildLogsRouteRef } from '../../plugin';
import { Breadcrumbs, Content, Link, Progress, LogViewer } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useApi, configApiRef, useRouteRefParams } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles({
  card: {
    padding: '10px 20px'
  },
  logPageRoot: {
    height: '100%'
  },
  logViewerWrapper: {
    width: '100%',
    height: 'min-content',
  },
  logViewer: {
    '& a[role="row"]': {
        display: 'none'
    },
  },
});


const TeamcityLogPage = () => {
  const classes = useStyles();
  const { buildName, buildId, buildRunId } = useRouteRefParams(buildLogsRouteRef);
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<string> => {
    const backendUrl = config.getString('backend.baseUrl');
    const response = await fetch(`${backendUrl}/api/proxy/teamcity-proxy/downloadBuildLog.html?buildId=${buildRunId}`);
    const data = await response.text();

    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <div className={classes.logPageRoot}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="../../../../..">Builds</Link>
        <Link to="../..">{buildName} ({buildId})</Link>
        <Typography>Logs</Typography>
      </Breadcrumbs>
      <Box m={1} />
      <Card className={classes.card}>
        {/* Since the LogViewer uses windowing to avoid rendering all contents at once, the
        log is sized automatically to fill the available vertical space. This means
        it may often be needed to wrap the LogViewer in a container that provides it
        with a fixed amount of space. */}
        <div className={classes.logViewerWrapper}>
          <LogViewer text={value || ""} classes={{ root: classes.logViewer }} />
        </div>
      </Card>
    </div>
  );
};
const Page = () => (
  <Content>
    <TeamcityLogPage />
  </Content>
);

export default Page;
export { TeamcityLogPage };
