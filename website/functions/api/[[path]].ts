import workerHandler, { type Env } from '../worker/index';

export const onRequest: PagesFunction<Env> = async (context) => {
  return workerHandler.fetch(context.request, context.env);
};
