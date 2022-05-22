import { DateTime } from 'luxon'
import { BaseModel, column, } from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {

  public static table = 'posts'

  @column({ isPrimary: true, columnName: "idPost" })
  public idPost: number

  @column()
  public nombre: string

  @column()
  public descripcion: string

  @column.dateTime({autoCreate: true})
  public fecha: DateTime
}
