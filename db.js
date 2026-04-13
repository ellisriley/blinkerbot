import { Client } from 'pg'
 
const client = new Client({
  user: 'database-user',
  password: 'secretpassword!!',
  host: 'my.database-server.com',
  port: 5334,
  database: 'database-name',
})