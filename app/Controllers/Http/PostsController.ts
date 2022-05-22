import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from '@ioc:Adonis/Lucid/Database'

import Post from "App/Models/Post";
import FilterPosts from "App/Helpers/FilterPosts";

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

import Logger from '@ioc:Adonis/Core/Logger'


export default class PostsController {

  protected FilterPosts = new FilterPosts();

  protected stateConnection = this.stateDatabase();
  
  public index({ response }: HttpContextContract) {
    response.status(200).json({
      statusCode: response.getStatus(),
      api: "apiPosts",
      version: "v1",
      state: "activa",
      fecha: new Date().toISOString(),
    });
  }

  public async savePost  ({ response, request }: HttpContextContract) {
    try {
      const post =  new Post();

      const { nombrePost = "N/A", descripcion = "N/A" } = request.only([
        "nombrePost",
        "descripcion",
      ]);

      post.nombre = nombrePost;
      post.descripcion = descripcion;

      await post.save();

      response.status(201).json({
          status: response.getStatus(),
          ok: post.$isPersisted,
          message: 'Post save successfull'
      });
    } catch (err) {
      throw err;
    }
  }

  public async listPosts ({response, request}:HttpContextContract){
      try {

          let posts : Array<object>;

          const queryString : object = request.qs();

          if(Object.keys(queryString)?.length === 0){

             posts = await Post.query();

          }else{
            
            const {sql, values} = await this.FilterPosts.Filtro(queryString);
           
            const [ rows ] = await Database.rawQuery(sql, values)

            posts = rows
            
          }

          response.status(200).json({
              status: response.getStatus(),
              ok: true,
              data: posts,
              message: "Posts list successfull"
          })

      } catch (error) {
          throw error
      }
  }

  public async getPost ({response,params}: HttpContextContract) {
      try {
          const onePost : object | null = await Post.find(params.id)
          
          response.status(200).json({
            status: response.getStatus(),
            ok: true,
            data: [ onePost ],
            message: "Posts list successfull"
          })

      } catch (error) {
          throw error
      }
  }

  public async updatePost ({ response, request }: HttpContextContract){
    
    const {id,nombrePost,descripcion} = request.only(["id", "nombrePost", "descripcion"]);

    const post  = await Post.find(id);

    if(!post){
      return response.status(404).notFound({
        status: response.getStatus(),
        ok: false,
        message: "Not found."
      })
    }

      post.nombre = nombrePost
      post.descripcion = descripcion;

      await post.save();


     response.status(201).json({
        status: response.getStatus(),
        ok: post?.$isPersisted,
        message: `Post update successfull`
     })
  }

  private async stateDatabase () : Promise<boolean> {

      try {
        
        const { report  }  = await HealthCheck.getReport()

        const [ infoDatabase ] = report.lucid.meta
        
        const { healthy } = report.lucid.health
  
        Logger.info(`Database ${infoDatabase.connection} state is: ${infoDatabase.message}`)
  
        return healthy

      } catch (error) {
         throw error
      }
  }
}
