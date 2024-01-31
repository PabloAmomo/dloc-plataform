import express from 'express';
const routers = express.Router();

routers.get('/health', (req, res, next) => res.status(200).json({ message: 'ok' }));

export default routers;
