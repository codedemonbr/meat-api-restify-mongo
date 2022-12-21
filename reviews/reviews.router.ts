import * as mongoose from "mongoose";
import * as restify from "restify";
import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<Review, Review>
  ): mongoose.DocumentQuery<Review, Review> {
    return query.populate("user", "name").populate("restaurant", "name");
  }

  envelope(document) {
    let resource = super.envelope(document);
    const restId = document.restaurant._id
      ? document.restaurant._id
      : document.restaurant;
    resource._links.restaurant = `/restaurants/${restId}`;
    return resource;
  }
  /**
   * sobrescrevendo o metodo na classe localhost
   * aqui a unica diferença é o populate.
   * primeiro parametro é o subitem a ser populado e os demais são os campos
   * se não passar nada, ele vai popular com tudo, inclusive o _v: ...
   */
  //   findById = (req, resp, next) => {
  //     this.model
  //       .findById(req.params.id)
  //       .populate("user", "name")
  //       .populate("restaurant", "name")
  //       .then(this.render(resp, next))
  //       .catch(next);
  //   };

  applyRoutes(application: restify.Server) {
    application.get(`${this.basePath}`, this.findAll);
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    application.post(`${this.basePath}`, this.save);
  }
}

export const reviewsRouter = new ReviewsRouter();
