import React from 'react';
import { Link, Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { useApi, configApiRef, useRouteRef } from '@backstage/core-plugin-api';
import Launch from '@material-ui/icons/Launch';
import { useEntity } from '@backstage/plugin-catalog-react';
import { TEAMCITY_ANNOTATION } from '../../routes';
import moment from 'moment';
import { buildLogsRouteRef, buildRouteRef } from '../../plugin';
import { BuildType, DenseTableProps, Revision } from '../types';
import { TeamcityStatus } from '../TeamcityStatus/TeamcityStatus';
import { TeamcitySource } from '../TeamcitySource/TeamcitySource';

export const buildUrl = (build: Partial<BuildType>) => {
  const LinkWrapper = () => {
    const routeLink = useRouteRef(buildRouteRef);
    return (
        <Link
            to={routeLink({
              buildName: String(build.name),
              buildId: String(build.id)
            })}>
          {build.name}
        </Link>
    );
  }

  return <LinkWrapper />;
}

export const buildLogUrl = (build: Partial<BuildType>, buildRunId?: string) => {
  const LinkWrapper = () => {
    const routeLink = useRouteRef(buildLogsRouteRef);
    return buildRunId ? (
        <Link
            style={{float:'left'}}
            to={routeLink({
              buildName: String(build.name),
              buildId: String(build.id),
              buildRunId: String(buildRunId)
            })}>
          (view logs)
        </Link>
    ) : (<></>);
  }

  return <LinkWrapper />;
}

export const DenseTable = ({ builds }: DenseTableProps) => {
  const columns: TableColumn[] = [
    {
      title: 'Name',
      field: 'name',
      highlight: true,
      render: (build: Partial<BuildType>) => {
        return buildUrl(build);
      }
    },
    { title: 'Source', field: 'branchName' },
    { title: 'Status', field: 'status' },
    { title: 'Finished At', field: 'finishedAt' },
    { title: 'Url', field: 'webUrl' },
  ];
  const data = builds.map(build => {
    let finishedAt = '';
    let branchName = '';
    let buildRunId;
    let revision: Revision = {
      version: ''
    };

    if (build?.builds?.build?.length >= 0) {
      finishedAt = build?.builds?.build[0]?.finishDate ? moment(build?.builds?.build[0]?.finishDate).format('MMM Do, HH:mm') : '';
      branchName = build?.builds?.build[0]?.branchName;
      buildRunId = build?.builds?.build[0]?.id;
      const revisions = build?.builds?.build[0]?.revisions?.revision;
      revision = build?.builds?.build[0]?.revisions?.revision[revisions.length-1];
    }

    return {
      id: build.id,
      name: build.name,
      projectName: build.projectName,
      projectId: build.projectId,
      branchName: (<TeamcitySource revision={revision} branchName={branchName}/>),
      status: (
          <>
            <TeamcityStatus status={build?.builds?.build[0]?.status} statusText={build?.builds?.build[0]?.statusText} />
            {buildLogUrl(build, buildRunId)}
          </>
      ),
      finishedAt: `${finishedAt}`,
      webUrl: (
          <Link
              to={build.webUrl}
              target="_blank"
          ><Launch fontSize="small"/></Link>
      ),
    };
  });

  // group builds by projectId and show table for each TC subproject
  const projectNames = new Map<string, string>();
  const groupedBuildsMap = data.reduce<Map<string, typeof data>>((acc, build) => {
    const projectId = build.projectId || "";
    const projectName = build.projectName || "";

    if (!acc.has(projectId)) {
      acc.set(projectId, [build]);
    } else {
      acc.get(projectId)?.push(build)
    }

    projectNames.set(projectId, projectName);
    return acc;
  }, new Map<string, typeof data>());


  const items: JSX.Element[] = [];
  groupedBuildsMap.forEach((value, projectIdKey) => {
    const projectName = projectNames.get(projectIdKey) || ""; // every subproject level is separated by '/'
    const lastSlashIndex = projectName.lastIndexOf("/");
    let beforeLastPart; let lastPart;

    if (lastSlashIndex > 0) {
      beforeLastPart = projectName.slice(0, lastSlashIndex).trim();
      lastPart = projectName.slice(lastSlashIndex + 1).trim();
    } else {
      beforeLastPart = "";
      lastPart = projectName.trim();
    }

    items.push(
        <>
          <Table
              title={lastPart}
              subtitle={beforeLastPart}
              options={{search: false, paging: false}}
              columns={columns}
              data={value}/>
          <br/>
        </>
    );
  });

  return (<>
    {items}
  </>)
};

/** @public */
export const TeamcityTableComponent = () => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<BuildType[]> => {
    const backendUrl = config.getString('backend.baseUrl');
    const fieldsQuery = 'buildType(id,name,projectId,projectName,webUrl,builds($locator(running:false,count:1),build(id,number,status,statusText,branchName,revisions(revision(version,vcsBranchName,vcs-root-instance)),startDate,finishDate)))';
    const response = await fetch(`${backendUrl}/api/proxy/teamcity-proxy/app/rest/buildTypes?locator=affectedProject:(id:${entity.metadata.annotations?.[TEAMCITY_ANNOTATION]})&fields=${fieldsQuery}`);
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
