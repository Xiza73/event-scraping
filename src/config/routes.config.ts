import { Router } from 'express';

import { authRouter } from '@/api/auth/routes/auth.router';
import { eventRouter } from '@/api/core/event/routes/event.route';
import { rymRouter } from '@/api/rym/routes/rym.route';
import { ModulePath, Route } from '@/models/route.model';

const routeList: Route[] = [
  {
    path: ModulePath.AUTH,
    router: authRouter,
  },
  {
    path: ModulePath.RYM,
    router: rymRouter,
  },
  {
    path: ModulePath.EVENT,
    router: eventRouter,
  },
];

export const routes = (() => {
  const routes: Router = Router();

  routeList.forEach((route) => {
    routes.use(route.path, route.router);
  });

  return routes;
})();
