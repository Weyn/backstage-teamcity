import { createComponentExtension, createPlugin } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

/** @public */
export const teamcityPlugin = createPlugin({
  id: 'teamcity',
  routes: {
    root: rootRouteRef
  },
});

/** @public */
export const EntityTeamcityContent = teamcityPlugin.provide(
  createComponentExtension({
    name: 'EntityTeamcityContent',
    component: {
        lazy: () => import('./components/TeamcityFetchComponent').then(m => m.TeamcityFetchComponent),
    },
  }),
);