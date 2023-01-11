# terceraEntregaProyectoFinalBackend
credenciales admin para poder cargar productos nuevos nombre:admin correo: admin@admin  password: admin
para las demas funcionalidades registrar un usuario nuevo

-al registrar un usuario nuevo se le asigna un id de carrito que se mantiene hasta que finaliza la compra o elimina el carrito
-al loguearse un usuario previamente registrado busca en sus carritos. si tiene alguno activo se le envia el id al front. de lo contrario se crea uno nuevo 
-se mantuvieron las funciones CRUD a traves de request a /api/.... por lo que tambien se pueden hacer las pruebas a traves de postman o similar (la idea es despues asignarle un front externo)
-el envio de mail y mensajes es simulado (console.log) la funcion que los envia esta comentada (no se puede probar en entorno real )
-los logs warn y error se almacenan en respectivos archivos en la carpeta logs 
-las imagenes seleccionadas al registrarse se guardan en la carpeta pubic/perfiles. si no se selecciona ninguna se utiliza una por default (solo por api. por el front esta como required)
para usar en modo local hacer npm i y node main(por defecto usa puerto 8081)