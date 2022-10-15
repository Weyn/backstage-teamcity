import { Entity } from '@backstage/catalog-model';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { Route, Routes } from 'react-router';
import { buildRouteRef } from '../plugin';
import { TEAMCITY_ANNOTATION } from '../routes';
import { TeamcityBuildPage } from './TeamcityBuildPage/TeamcityBuildPage';
import { TeamcityTableComponent } from './TeamcityTableComponent/TeamcityTableComponent';
// import { DetailedViewPage } from './BuildWithStepsPage/';

/** @public */
export const isJenkinsAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[TEAMCITY_ANNOTATION]);

export const Router = () => {
  const { entity } = useEntity();

  if (!isJenkinsAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={TEAMCITY_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path="/" element={<TeamcityTableComponent />} />
      <Route path={`/${buildRouteRef.path}`} element={<TeamcityBuildPage />} />
    </Routes>
  );
};