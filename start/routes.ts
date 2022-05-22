/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";
//import Database from "@ioc:Adonis/Lucid/Database";

Route.group(() => {
  Route.group(() => {
    Route.get("/", "PostsController.index");

    // Route group postes
    Route.group(() => {

      Route.post("/", 'PostsController.savePost')
      Route.put("/:id?", 'PostsController.updatePost')
      Route.patch("/:id?", "PostsController.deletePost")
      Route.get("/", "PostsController.listPosts")
      Route.get("/:id", "PostsController.getPost")

    }).prefix("/posts");

  }).prefix("/v1");
}).prefix("/api");
