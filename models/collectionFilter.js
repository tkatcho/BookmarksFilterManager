export default class CollectionFilter {
  constructor(objects, params, model) {
    this.objects = objects; //List d'objets, on veut renvoyer la list filtrer apres l'appel get.
    this.params = params; //Param qui contient la query string. On veut defaire la requete et filtrer selon la demande.
    this.model = model; //IsMemeber sert a savoir si le champ contient se qu'on cherche...: sort=name => si pas de name, sa renvoie false et on envoie rien
  }

  get() {
    let limit = 0;
    let offset = 0;
    for (let key in this.params) {
      switch (key.toLowerCase()) {
        case "sort":
          let paramKey = this.params[key];
          let reverse = false;
          if (paramKey.includes(",desc")) {
            reverse = true;
            paramKey = paramKey.replace(",desc", "");
          }

          if (this.model.isMember(paramKey)) {
            this.objects.sort((a, b) => {
              if (!isNaN(a[paramKey]) && !isNaN(b[paramKey])) {
                return a[paramKey] - b[paramKey];
              }
              const propA = a[paramKey].toUpperCase();
              const propB = b[paramKey].toUpperCase();
              if (propA < propB) {
                return -1;
              }
              if (propA > propB) {
                return 1;
              }
              return 0;
            });
            if (reverse) this.objects = this.objects.reverse();
            break;
          }
          return null;
        case "name":
          let name = this.params["Name"];
          if (name[0] == "*" && name[name.length - 1] == "*") {
            this.objects = this.objects.filter((e) =>
              e["Title"].includes(name.slice(1, -1))
            );
          } else if (name[name.length - 1] == "*") {
            this.objects = this.objects.filter((e) =>
              e["Title"].startsWith(name.slice(1))
            );
          } else if (name[0] == "*") {
            this.objects = this.objects.filter((e) =>
              e["Title"].endsWith(name.slice(0, -1))
            );
          } else {
            this.objects = this.objects.filter((e) => e["Title"]);
          }
          break;
        case "category":
          this.objects = this.objects.filter(
            (e) => e["Category"] == this.params["Category"]
          );
          break;
        case "field": //ajouter le IsModel
          this.objects = this.objects.filter(
            (v, i, a) =>
              a.findIndex(
                (v2) => v2[this.params["field"]] === v[this.params["field"]]
              ) === i
          );
          break;
        case "limit":
          limit = this.params["limit"];
          break;
        case "offset":
          offset = this.params["offset"];
          break;
      }
    }
    if (!isNaN(limit) && !isNaN(offset)) {
      if (limit != 0) {
        if (offset != 0) {
          return this.objects.slice(
            parseInt(offset),
            parseInt(limit) + parseInt(offset)
          );
        }
        return this.objects.slice(0, parseInt(limit));
      }
    }
    return this.objects;
  }
}
