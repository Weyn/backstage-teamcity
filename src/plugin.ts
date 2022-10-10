import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const teamcityPlugin = createPlugin({
  id: 'teamcity',
  routes: {
    root: rootRouteRef,
  },
});

// export const TeamcityPage = teamcityPlugin.provide(
// //   createRoutableExtension({
// //     name: 'TeamcityPage',
// //     component: () =>
// //       import('./components/ExampleComponent').then(m => m.ExampleComponent),
// //     mountPoint: rootRouteRef,
// //   }),
// );
