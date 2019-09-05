package models

import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

/**
  * A repository for Product.
  *
  * @param dbConfigProvider The Play db config provider. Play will inject this for you.
  */
@Singleton
class ProductRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  // We want the JdbcProfile for this provider
  private val dbConfig = dbConfigProvider.get[JdbcProfile]

  // These imports are important, the first one brings db into scope, which will let you do the actual db operations.
  // The second one brings the Slick DSL into scope, which lets you define the table and other queries.

  import dbConfig._
  import profile.api._

  /**
    * Here we define the table for Product
    */
  private class ProductTable(tag: Tag) extends Table[Product](tag, "product") {

    /** The ID column, which is the primary key, and auto incremented */
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    /** The name column */
    def name = column[String]("name")

    /** The category column */
    def category = column[String]("category")

    /** The code column */
    def code = column[String]("code")

    /** The price column */
    def price = column[Double]("price")

    /**
      * This is the tables default "projection".
      *
      * It defines how the columns are converted to and from the Product object.
      */
    def * = (id, name, category, code, price) <> ((Product.apply _).tupled, Product.unapply)

  }

  private val products = TableQuery[ProductTable]

  /**
    * Here we define the table for Details
    */
  private class DetailsTable(tag: Tag) extends Table[Details](tag, "details") {

    /** The name column */
    def key = column[String]("key")

    /** The category column */
    def value = column[String]("value")

    def productId = column[Long]("product_id")

    def productFk = foreignKey("product_id_FK", productId, TableQuery[ProductTable])(_.id, ForeignKeyAction.Restrict, ForeignKeyAction.Cascade)

    /**
      * This is the tables default "projection".
      *
      * It defines how the columns are converted to and from the Details object.
      *
      * In this case, we are simply passing the id, name and page parameters to the Details case classes
      * apply and unapply methods.
      */
    def * = (key, value, productId) <> ((Details.apply _).tupled, Details.unapply)

  }

  private val details = TableQuery[DetailsTable]

  /**
    * The starting point for all queries on the Product and Details tables.
    */

  /**
    * add product based on id in the database.
    */
  def addProduct(productForm: ProductForm): Future[Long] = {
    db.run(products returning products.map(_.id) += Product(productForm.id, productForm.name, productForm.category, productForm.code, productForm.price.getOrElse(0)))
  }

  /**
    * add details for aproduct based on product id in the database.
    */
  def addProductDetails(id: Long, productForm: ProductForm): Unit = productForm.details.foreach(x => {
    db.run(details += Details(x.key, x.value, id))
  })

  /**
    * update product based on id in the database.
    */
  def updateProduct(id: Long, productForm: ProductForm): Future[Int] = db.run {
    products.filter(_.id === productForm.id).update(Product(productForm.id, productForm.name, productForm.category, productForm.code, productForm.price.getOrElse(0)))
  }

  /**
    * List all the products from the database.
    */
  def listAllProducts(): Future[Seq[Product]] = db.run {
    products.sortBy(_.id.desc).result
  }

  /**
    * Delete product based on id from the database.
    */
  def deleteProduct(id: Long): Future[Int] = {
    db.run(products.filter(_.id === id).delete)
  }

  /**
    * Delete product details based on product id from the database.
    */
  def deleteProductDetails(id: Long): Future[Int] = {
    db.run(details.filter(_.productId === id).delete)
  }

  /**
    * get details for a product based on product id from the database.
    */
  def getDetailsFromProduct(id: Long): Future[Seq[Details]] = db.run(details.filter(_.productId === id).result)

    /**
    * get product based on id from the database.
    * def get(id: Long): Future[Option[Product]] = {
    *db.run(products.filter(_.id === id).result.headOption)
    * } */


}
