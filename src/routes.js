import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollController from './app/controllers/EnrollController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import HelpOrdersGymController from './app/controllers/HelpOrdersGymController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/students/:id/help-orders', HelpOrdersController.store);
routes.get('/students/:id/help-orders', HelpOrdersController.index);

routes.use(authMiddleware);

routes.put('/help-orders/:id/answer', HelpOrdersGymController.update); // falta email
routes.get('/help-orders', HelpOrdersGymController.index);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);

routes.post('/enrolls', EnrollController.store);
routes.get('/enrolls', EnrollController.index);
routes.put('/enrolls/:id', EnrollController.update);
routes.delete('/enrolls/:id', EnrollController.delete);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;
