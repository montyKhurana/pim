package models

import play.api.libs.json.{JsValue, Json, OFormat}

case class Product(id: Long, name: String, category: String, code: String, price: Double)

object Product {
  implicit val productFormat: OFormat[Product] = Json.format[Product]
}