export class Product {
  id = 0;
  name = '';
  category = '';
  code = '';
  price = 0;
  details: Details[] | undefined;
}

export class Details {
  key = '';
  value = '';
  productId = 0;
}

