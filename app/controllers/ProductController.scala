package controllers

import javax.inject._
import play.api.libs.json.{JsError, JsValue, Json, Writes}
import play.api.mvc._
import models.{ProductForm, ProductRepository}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
 class ProductController @Inject()(cc: ControllerComponents, productRepo: ProductRepository)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  /**
    * A REST endpoint that gets all the products as JSON.
    */
  def getProducts(): Action[AnyContent] = Action.async { implicit request =>
    productRepo.listAllProducts().map { product =>
      Ok(Json.toJson(product))
    }
  }

  /**
    * A REST endpoint for adding a product.
    */
  def addProduct: Action[JsValue] = Action.async(parse.json) { request =>
    request.body.validate[ProductForm].fold(error => Future.successful(BadRequest(JsError.toJson(error))), { productForm =>
      productRepo.addProduct(productForm).map { createdProductId =>
        productRepo.addProductDetails(createdProductId, productForm)
        Ok(Json.toJson(Map("id" -> createdProductId)))
      }
    })

  }

  /**
  * A REST endpoint for updating a product.
  */
  def updateProduct(id: Long): Action[JsValue] = Action.async(parse.json) { request =>
    request.body.validate[ProductForm].fold(error => Future.successful(BadRequest(JsError.toJson(error))), { productForm =>
      productRepo.updateProduct(id, productForm).map { noOfRowsUpdated =>
        println("lets see what we get... updatedProductId "+ noOfRowsUpdated)
        productRepo.deleteProductDetails(id);
        productRepo.addProductDetails(id, productForm)
        Ok(Json.toJson(Map("noOfRowsUpdated" -> noOfRowsUpdated)))
      }
    })
  }

  /**
    * A REST endpoint for deleting a product.
    */
  def deleteProduct(id: Long): Action[AnyContent] = Action.async { implicit request =>
    productRepo.deleteProduct(id) map { noOfRowsDeleted=> Ok(Json.toJson(Map("noOfRowsDeleted" -> noOfRowsDeleted))) }
  }


  /**
    * A REST endpoint for getting details for a product.
    */
  def getDetailsForProduct(id: Long): Action[AnyContent] = Action.async { request =>
    productRepo.getDetailsFromProduct(id).map { product =>
      Ok(Json.toJson(product))
    }
  }

}