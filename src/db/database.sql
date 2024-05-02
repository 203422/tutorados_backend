CREATE DATABASE IF NOT EXISTS tutorados_db; 

USE tutorados_db;

CREATE TABLE IF NOT EXISTS rol (
    rol_id INT NOT NULL AUTO_INCREMENT,
    rol_nombre VARCHAR(25) NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    PRIMARY KEY(rol_id)
);

INSERT INTO rol (rol_nombre, descripcion)
VALUES
('Administrador', 'Rol para acceso administrador'),
('Tutor', 'Rol de tutor'),
('Alumno', 'Rol de alumno');

CREATE TABLE IF NOT EXISTS usuario (
    usuario_id VARCHAR(20) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(60) NOT NULL,
    correo VARCHAR(60) NOT NULL UNIQUE,
    contrasena VARCHAR(60) NOT NULL,
    creacion TIMESTAMP NOT NULL DEFAULT (NOW()),
    rol INT NOT NULL, 
    PRIMARY KEY(usuario_id),
    FOREIGN KEY(rol) REFERENCES rol(rol_id)
);

CREATE TABLE IF NOT EXISTS tutor (
    usuario_id VARCHAR(20) NOT NULL,
    PRIMARY KEY(usuario_id),
    FOREIGN KEY(usuario_id) REFERENCES usuario(usuario_id)
);

CREATE TABLE IF NOT EXISTS alumno (
    usuario_id VARCHAR(20) NOT NULL,
    carrera VARCHAR(60) NOT NULL,
    genero VARCHAR(20) NOT NULL,
    tutor_padre VARCHAR(60),
    fechaNac DATE,
    edad INT,
    lugarNac VARCHAR(80),
    religion VARCHAR(25), 
    actividad VARCHAR(50),
    PRIMARY KEY(usuario_id),
    FOREIGN KEY(usuario_id) REFERENCES usuario(usuario_id)
);

CREATE TABLE IF NOT EXISTS contacto (
    usuario_id VARCHAR(20) NOT NULL,
    domicilio_actual VARCHAR(80),
    domicilio_familiar VARCHAR(80),
    celular VARCHAR(20),
    tel_casa VARCHAR(20),
    correo VARCHAR(60),
    correo_tutor VARCHAR(60),
    PRIMARY KEY(usuario_id),
    FOREIGN KEY(usuario_id) REFERENCES alumno(usuario_id)
);

CREATE TABLE IF NOT EXISTS datos_medicos (
    usuario_id VARCHAR(20) NOT NULL,
    num_seguro VARCHAR(20) NOT NULL,
    tipo_sangre VARCHAR(10) NOT NULL, 
    enfermedad VARCHAR(60) NOT NULL,
    discapacidad VARCHAR(60) NOT NULL, 
    alergia VARCHAR(60) NOT NULL,
    sustancias_toxicas VARCHAR (60) NOT NULL,
    PRIMARY KEY(usuario_id),
    FOREIGN KEY(usuario_id) REFERENCES alumno(usuario_id)
);

CREATE TABLE IF NOT EXISTS datos_academicos(
    usuario_id VARCHAR(20) NOT NULL,
    preparatoria VARCHAR(60) NOT NULL,
    promedio FLOAT NOT NULL,
    puntuacion_ceneval FLOAT NOT NULL,
    PRIMARY KEY(usuario_id),
    FOREIGN KEY(usuario_id) REFERENCES alumno(usuario_id)
);

CREATE TABLE IF NOT EXISTS datos_socioeconomicos(
    usuario_id VARCHAR(20) NOT NULL,
    trabajo VARCHAR(60) NOT NULL,
    apoyo_economico VARCHAR(5),
    convivencia VARCHAR(20),
    PRIMARY KEY(usuario_id),
    FOREIGN KEY(usuario_id) REFERENCES alumno(usuario_id)
);

CREATE TABLE IF NOT EXISTS tutor_alumno(
    tutor_id VARCHAR(20) NOT NULL, 
    alumno_id VARCHAR(20) NOT NULL,
    PRIMARY KEY(tutor_id, alumno_id),
    FOREIGN KEY(tutor_id) REFERENCES tutor(usuario_id),
    FOREIGN KEY(alumno_id) REFERENCES alumno(usuario_id)
);

CREATE TABLE IF NOT EXISTS imagen(
    usuario_id VARCHAR(20) NOT NULL,
    imagen VARCHAR(200),
    PRIMARY KEY(usuario_id),
    FOREIGN KEY(usuario_id) REFERENCES usuario(usuario_id)
);

CREATE TABLE IF NOT EXISTS codigo_registro (
    codigo VARCHAR(20) NOT NULL PRIMARY KEY,
    tutor_nombre VARCHAR(60) NOT NULL,
    tutor_apellido VARCHAR(60) NOT NULL
);
