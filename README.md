# Express + MYSQL

# Consulta SQL

## crear usuario

```sql
Create user 'admin_clinica'@'localhost' identified by '1234';

```

# archivo .env

## Puerto servidor

APP_PORT = 80
PORT_SERVICIO_EMPLEADOS = 81
PORT_SERVICIO_CITAS = 82
PORT_SERVICIO_USUARIOS = 83


## keys DB

DB_HOST = 127.0.0.1

DB_PORT = 3306

DB_NAME = clinica

DB_USER = admin_clinica

DB_PASSWORD = 1234

PROD = false