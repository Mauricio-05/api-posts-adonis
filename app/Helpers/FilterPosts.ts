export default class FilterPosts {
  private sql: string = "select * from posts where 1=1";

  private filterValueWhere: object = {
    Nombre: ` and UPPER(nombre) like ? `,
  };

  public async Filtro(queryString: object) {

    const queryStringWhere: object = queryString;

    type responseFiltro = {
      sql: string;
      values: Array<any>;
    };

    let arrayValues: Array<any> = [];

    for (const key in queryStringWhere) {
      if (Object.prototype.hasOwnProperty.call(queryStringWhere, key)) {
        let value: any = "";

        if (queryString[key]) {
          if (key === "Nombre") {
            value = `%${queryStringWhere[key]}%`;

            this.sql += this.filterValueWhere[key];

            arrayValues.push(value);
          }
        }
      }
    }

    const arrayResponse: responseFiltro = {
      sql: this.sql,
      values: arrayValues,
    };

    return arrayResponse;
  }
}
