// biome-ignore lint/style/useImportType: <explanation>
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';

import log from './logger';

function swaggerDocs(router: express.Router) {
  router.use('/api-docs', swaggerUi.serve);
  router.get('/api-docs', swaggerUi.setup(swaggerDocument));
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

  // Log the URL where the documentation is available
  log.info('Docs available at /aj and /docs.json');
}

export default swaggerDocs;
