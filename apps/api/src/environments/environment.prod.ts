import { env } from "process";

export const environment = {
  production: true,
  encrypt: {
    key: 'd85117047fd06d3afa79b6e44ee3a52eb426fc24c3a2e3667732e8da0342b4da',
    algorithm: 'aes-256-cbc',
    ivLength: 16,
    looseMatching: false
  },
  database: {
    host: env.MYSQL_HOST || '127.0.0.1',
    port: env.MYSQL_PORT || 3306,
    username: env.MYSQL_USER || 'root',
    password: env.MYSQL_PASSWORD || 'root',
    database: env.MYSQL_DB || 'playhits',
  },
  jwtSecret: 'P14YH1T5',
  client_id: 'c89100b02cd741c893c8454d85cd931c',
  client_secret: 'd3e8874af8344fb48fbe718228dbc6cf',
  redirect_uri: 'https://playhits.inixio.dev/host'
};

