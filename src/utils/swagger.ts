// biome-ignore lint/style/useImportType: <explanation>
import express, { type Request, type Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';

import { version } from '../../package.json';

import log from './logger';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/index.ts', './src/schema/*.ts'], // Ensure these paths are correct
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(router: express.Router) {
  router.use('/api-docs', swaggerUi.serve);
  router.get('/api-docs', swaggerUi.setup(swaggerDocument));
  // Docs in JSON format
  router.get('/docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Log the URL where the documentation is available
  log.info('Docs available at /aj and /docs.json');
}

export default swaggerDocs;
