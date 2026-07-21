-- Se ejecuta una sola vez, al inicializar el volumen de MySQL.
-- Crea las 4 bases de datos (frontend + 3 microservicios) y da permisos
-- al usuario definido en MYSQL_USER.

CREATE DATABASE IF NOT EXISTS localeats
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS localeats_auth
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS localeats_product
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS localeats_support
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- El usuario de MYSQL_USER ya fue creado por la imagen oficial de MySQL.
GRANT ALL PRIVILEGES ON localeats.*         TO 'localeats'@'%';
GRANT ALL PRIVILEGES ON localeats_auth.*    TO 'localeats'@'%';
GRANT ALL PRIVILEGES ON localeats_product.* TO 'localeats'@'%';
GRANT ALL PRIVILEGES ON localeats_support.* TO 'localeats'@'%';
FLUSH PRIVILEGES;
