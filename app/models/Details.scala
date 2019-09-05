package models

import play.api.libs.json.{Json, OFormat}

case class Details(key: String, value: String, productId: Long)

object Details {
  implicit val productFormat: OFormat[Details] = Json.format[Details]
}
