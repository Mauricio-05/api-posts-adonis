CREATE DATABASE POSTS;

CREATE TABLE POSTS (
    idPost INT NOT NULL AUTO_INCREMENT,
    nombrePost VARCHAR(200) NOT NULL,
    descripcion VARCHAR(2000) NOT NULL,
    fechaPost TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idPost)
);