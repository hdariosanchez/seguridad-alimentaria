CREATE DATABASE proyectoSeguridad;

USE proyectoSeguridad;

--CREACIÓN DE TABLAS

CREATE OR REPLACE TABLE grupo (
    id_grupo varchar(3) PRIMARY KEY NOT NULL,
    num_grupo varchar(10) UNIQUE KEY NOT NULL,
    desc_grupo varchar(50)
    ) engine = InnoDB;

CREATE OR REPLACE TABLE producto (
    id_producto int(11) NOT NULL AUTO_INCREMENT,
    id_grupo varchar(3) NOT NULL,
    desc_producto varchar(30) DEFAULT NULL,
    PRIMARY KEY(id_producto),
    CONSTRAINT fk_producto_grupo
        FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ) engine=InnoDB;

--INGRESO DE DATOS

INSERT INTO grupo VALUES
('G01', 'GRUPO 1', 'CARNES Y PRODUCTOS CARNICOS/EMBUTIDOS'),
('G02', 'GRUPO 2', 'PESCADO Y PRODUCTOS DEL MAR'),
('G03', 'GRUPO 3', 'LECHE Y DERIVADOS'),
('G04', 'GRUPO 4', 'CEREALES Y DERIVADOS'),
('G05', 'GRUPO 5', 'PANES Y PASTAS'),
('G06', 'GRUPO 6', 'AZÚCAR Y DULCES'),
('G07', 'GRUPO 7', 'GRASA VEGETAL'),
('G08', 'GRUPO 8', 'GRASA ANIMAL'),
('G09', 'GRUPO 9', ''),
('G10', 'GRUPO 10', 'LEGUMINOSAS Y OLEAGINOSAS'),
('G11', 'GRUPO 11', 'FRUTAS CITRICAS '),
('G12', 'GRUPO 12', 'FRUTAS NO CÍTRICAS'),
('G13', 'GRUPO 13', 'RAÍCES Y TUBERCULOS'),
('G14', 'GRUPO 14', 'VEGETALES DE HOJAS'),
('G15', 'GRUPO 15', 'OTROS VEGETALES ');

--INSERT INTO producto (id_producto, id_grupo, desc_producto) VALUES(NULL, 'G01', 'Borrego');
--INSERT INTO producto VALUES (NULL, 'G01', 'Cerdo');
INSERT INTO producto (id_grupo, desc_producto) VALUES
('G01', 'Borrego'),
('G01', 'Cerdo'),
('G01', 'Conejo/Cuy'),
('G01', 'Gallina'),
('G01', 'Res'),
('G01', 'Chorizo'),
('G01', 'Mortadela'),
('G01', 'Salchicha'),
('G01', 'Morcilla'),
('G01', 'Vísceras'),
('G01', 'Hígado'),
('G01', 'Otros');

-- CONSULTAS

SELECT id_producto, desc_producto, num_grupo
FROM producto
INNER JOIN grupo
ON producto.id_grupo = grupo.id_grupo
ORDER BY id_producto;


