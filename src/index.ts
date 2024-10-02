import express, { type Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (res: Response) => {
  res.send('Hello, TypeScript Express!');
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
