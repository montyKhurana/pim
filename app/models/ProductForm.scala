package models

import play.api.libs.json.{Json, OFormat}

case class ProductForm(id: Long, name: String, category: String, code: String, price: Option[Double], details: List[Details])

object ProductForm {
  implicit val productFormat: OFormat[ProductForm] = Json.format[ProductForm]
}