export interface DatabaseModuleOptions {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
  ssl?: {
    rejectUnauthorized?: boolean;
  };
}
