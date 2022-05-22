/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {

  protected statusPages = {
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  constructor () {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send(error.messages)
    }

    if(error.code === 'ER_NO_SUCH_TABLE'){
      return ctx.response.status(ctx.response.getStatus()).json({
        status: ctx.response.getStatus(),
        ok: false,
        message: "Error en la consulta, vuelva a intentarlo."
      })
    }
    if(error.code === 'E_ROUTE_NOT_FOUND'){
      return ctx.response.status(ctx.response.getStatus()).json({
        status: ctx.response.getStatus(),
        ok: false,
        message: "Not found."
      })
    }

    /**
     * Forward rest of the exceptions to the parent class
     */

    return super.handle(error, ctx)
  }
}
