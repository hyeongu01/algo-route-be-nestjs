import { Params } from 'nestjs-pino';
import { ulid } from 'ulid';

const isProd = process.env.NODE_ENV === 'prod';

export const loggerConfig: Params = {
  assignResponse: true,
  pinoHttp: {
    level: isProd ? 'info' : 'debug',
    transport: isProd
      ? { target: 'pino/file', options: { destination: 1 } }
      : { target: 'pino-pretty' },
    autoLogging: {
      ignore: (req) => ['/health'].includes((req.url ?? '').split('?')[0]),
    },
    genReqId: (req, res) => {
      const existing = req.headers['x-request-id'];
      if (existing) return existing;
      const id = ulid();
      res.setHeader('x-request-id', id);
      return id;
    },
    serializers: {
      req(req) {
        return { id: req.id, method: req.method.toUpperCase(), url: req.url };
      },
      res(res) {
        return { statusCode: res.statusCode, headers: res.headers };
      },
    },
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
  },
};
