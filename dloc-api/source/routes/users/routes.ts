import express from 'express';
import { getUser } from './getUser';
import { getPersistence } from '../../persistence/persistence';
const routers = express.Router();

const validId = (id: string) => {
  return id && !isNaN(Number(id));
};

routers.get('/users', (req, res, next) => {
  const id: string = req.query?.id?.toString() ?? '';
  /** validate id and get user */
  if (validId(id)) getUser(parseInt(id), getPersistence()).then((response) => res.status(response.code).json(response.result));
  else res.status(400).json({ error: 'id is required and must be numeric' });
});

routers.get('/users/:id', (req, res, next) => {
  const id: string = req.params?.id;
  /** validate id and get user */
  if (validId(id)) getUser(parseInt(id), getPersistence()).then((response) => res.status(response.code).json(response.result));
  else res.status(400).json({ error: 'id is required and must be numeric' });
});

export default routers;
