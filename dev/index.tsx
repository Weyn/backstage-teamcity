import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { teamcityPlugin, TeamcityPage } from '../src/plugin';

createDevApp()
  .registerPlugin(teamcityPlugin)
  .addPage({
    element: <TeamcityPage />,
    title: 'Root Page',
    path: '/teamcity'
  })
  .render();
