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

      const { nombrePost = "N/A", descripcion = "N/A", estado = 1 } = request.only([
        "nombrePost",
        "descripcion",
        "estado"
      ]);

      post.nombre = nombrePost;
      post.descripcion = descripcion;
      post.estado = estado

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

             posts = await Post.query().where("estado", "1");

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
      
   try{
     
    const {id,nombrePost,descripcion, estado = 1} = request.only(["id", "nombrePost", "descripcion", "estado"]);

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
      post.estado = estado;

      await post.save();


     response.status(201).json({
        status: response.getStatus(),
        ok: post?.$isPersisted,
        message: `Post update successfull`
     })
    }catch(err){
      throw err
    }
  }

  public async deletePost ({request,response}: HttpContextContract) {

    try{

    const { id , estado = 0 } = request.only(["id", "estado"]);

    const post  = await Post.find(id);

    if(!post){
      return response.status(404).notFound({
        status: response.getStatus(),
        ok: false,
        message: "Not found."
      })
    }

      post.estado = estado;

      await post.save();


     response.status(201).json({
        status: response.getStatus(),
        ok: post?.$isPersisted,
        message: `Post delete successfull`
     })

    }catch(err){
      throw err
    }
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
