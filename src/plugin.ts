import { 
  createSubRouteRef,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

/** @public */
export const teamcityPlugin = createPlugin({
  id: 'teamcity',
  routes: {
    entityContent: rootRouteRef
  },
});

/** @public */
export const buildRouteRef = createSubRouteRef({
  id: 'teamcity/build',
  path: '/build/:buildName/:buildId',
  parent: rootRouteRef,
});

/** @public */
export const buildLogsRouteRef = createSubRouteRef({
  id: 'teamcity/build',
  path: '/build/:buildName/:buildId/log/:buildRunId',
  parent: rootRouteRef,
});

/** @public */
export const EntityTeamcityContent = teamcityPlugin.provide(
  createRoutableExtension({
    name: 'EntityTeamcityContent',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);