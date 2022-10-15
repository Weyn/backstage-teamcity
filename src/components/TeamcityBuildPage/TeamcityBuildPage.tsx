import {
  Box,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { buildRouteRef } from '../../plugin';
import { Breadcrumbs, Content, Link } from '@backstage/core-components';
import { useRouteRefParams } from '@backstage/core-plugin-api';


const TeamcityBuildPage = () => {
  const { buildName, buildId } = useRouteRefParams(buildRouteRef);
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="../../..">Build</Link>
        <Typography>{buildName} ({buildId})</Typography>
      </Breadcrumbs>
      <Box m={1} />
    </div>
  );
};
const Page = () => (
  <Content>
    <TeamcityBuildPage />
  </Content>
);

export default Page;
export { TeamcityBuildPage };