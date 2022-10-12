import { createPlugin } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const teamcityPlugin = createPlugin({
  id: 'teamcity',
  routes: {
    root: rootRouteRef,
  },
});