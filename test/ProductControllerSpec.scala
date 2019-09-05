import controllers.ProductController
import models.{Details, Product, ProductForm, ProductRepository}
import org.mockito.Mockito._
import org.scalatest.mockito.MockitoSugar
import org.scalatestplus.play._
import org.scalatestplus.play.guice._
import play.api.libs.json.Json
import play.api.mvc.Result
import play.api.test._
import play.api.test.Helpers._
import play.test.WithApplication

import scala.concurrent.{Future}

/**
  * Add your spec here.
  * You can mock out a whole application including requests, plugins etc.
  *
  * For more information, see https://www.playframework.com/documentation/latest/ScalaTestingWithScalaTest
  */
class ProductControllerSpec extends PlaySpec with GuiceOneAppPerTest with Injecting with MockitoSugar {

  implicit val mockedRepo: ProductRepository = mock[ProductRepository]
  implicit val executor = scala.concurrent.ExecutionContext.global


  "ProductController " should {

    "create a product" in new WithProductApplication() {
      val details = List(Details("key 1", "value 1", 0), Details("key 2", "value 2", 0))
      val productForm = ProductForm(0, "name", "category", "code", Some(1), details)
      when(mockedRepo.addProduct(productForm)) thenReturn Future.successful(12: Long)
      val result: Future[Result] = productController.addProduct().apply(FakeRequest().withBody(Json.toJson(productForm)))
      val resultAsString: String = contentAsString(result)
      resultAsString must equal("""{"id":12}""")
    }

    "update a product" in new WithProductApplication() {

      val details = List(Details("key 1", "value 1", 0), Details("key 2", "value 2", 0))
      val productForm = ProductForm(13, "name", "category", "code", Some(1), details)
      when(mockedRepo.updateProduct(13: Long, productForm)) thenReturn Future.successful(1)
      val result: Future[Result] = productController.updateProduct(13: Long).apply(FakeRequest().withBody(Json.toJson(productForm)))
      val resultAsString = contentAsString(result)
      resultAsString must equal("""{"noOfRowsUpdated":1}""")
    }

    "delete a product" in new WithProductApplication() {
      when(mockedRepo.deleteProduct(1)) thenReturn Future.successful(1)
      val result = productController.deleteProduct(1).apply(FakeRequest())
      val resultAsString = contentAsString(result)
      resultAsString must equal("""{"noOfRowsDeleted":1}""")
    }

    "get list of all products" in new WithProductApplication() {
      val product = Product(1, "randomName", "randomCategory", "randomCode", 2)
      when(mockedRepo.listAllProducts()) thenReturn Future.successful(List(product))
      val result: Future[Result] = productController.getProducts().apply(FakeRequest())
      val resultAsString = contentAsString(result)
      resultAsString must equal("""[{"id":1,"name":"randomName","category":"randomCategory","code":"randomCode","price":2}]""")
    }

    "render the products api resource from the router" in {
      val request = FakeRequest(GET, "/products")
      val products = route(app, request).get
      status(products) mustBe OK
    }
  }

  class WithProductApplication()(implicit mockedRepo: ProductRepository) extends WithApplication {
    implicit val executor = scala.concurrent.ExecutionContext.global
    val productController = new ProductController(stubControllerComponents(), mockedRepo)
  }
}