export enum EnvKeys {
  node_env = "NODE_ENV",
  port = "PORT",
  jwt_secret = "JWT_SECRET",
  db_host = "db_host",
  db_user = "db_user",
  db_pass = "db_pass",
  db_name = "db_name",
  redis_url = "REDIS_URL",
  openai_api_key = "OPENAI_API_KEY"
}

export const getEnvValue = (key: EnvKeys): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} not found`);
  return value;
};
