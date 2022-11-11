

const products = document.querySelector('.products-container');
const buttonContainer = document.querySelector('.button-container')

/* utilizamos el objeto Date para obtener un generador de numero de referecia*/
let date = new Date
let referenceCode = date.getTime()

/*guardamos en una variable los datos que vamos a necesitar para que PayU procese el pago, estos datos se seben traer de una base de datos*/

const payuData ={
  merchantId: 508029,
  ApiKey: '4Vj8eK4rloUd272L48hsrarnUA',
  referenceCode: referenceCode,
  currency: 'COP',
  accountId: 512321
}

/* los datos del usuario para procesar el pago tambien deben ser traidos del backend */
const userData = {
  name: null,
  email: 'eduardbarrios0903@gmail.com',
}


/* cuando las personas agregren sus productos a un carrito de compras el cual sera guardado en el backend, estos se traeran de vuelta al backend en forma de un objeto o array para luego ser renderizado en el carrito de compras frontend*/
/* este array representa productos genericos que fueron traidos del backend y guardados en un array*/
const productsAdd =[
 {
  id:0,
  name: 'generic product',
  category: 'others',
  price:30000,
  amount: 1,
  imgUrl: 'https://picsum.photos/200/300'
 },
 {
  id:1,
  name: 'generic product 1',
  category: 'others',
  price:'35000',
  amount: 2,
  imgUrl: 'https://picsum.photos/250/300'
 }
]
/* esta funcion es la encargada de tomar los productos traidos del carrito de compras backend y renderizarlos en el frontend*/
let result = null;

function renderProducts(){
 const view = `${productsAdd.map(productsAdd=>`
   <div class="product">
   <img class="product-img" src="${productsAdd.imgUrl}" alt="${productsAdd.name}">
   <div class="product-name">${productsAdd.name}</div>
   <div class="price">${productsAdd.price}</div>
   <div class="amount">${productsAdd.amount}</div>
   <div class="subtotal">${productsAdd.price*productsAdd.amount}</div>
   <div>
    <button class="delete">
     <i class="fa-solid fa-trash-can"></i></i>
    </button>
   </div>
  </div>
 `)}
 `;
 products.innerHTML=view;
 
}
renderProducts()

/* hago uso de un ciclo para calcular el valor total de la compra y se guarda en la variable result*/

productsAdd.forEach(element => {
  result += element.price*element.amount;
  return result
});

const stringEncrip = `${payuData.ApiKey}~${payuData.merchantId}~${payuData.referenceCode}~${result}~${payuData.currency}`;
let signature = CryptoJS.MD5(stringEncrip).toString();

function payButtonAdd(){
  const button = `
  <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
  <input name="merchantId"      type="hidden"  value="${payuData.merchantId}"   >
  <input name="accountId"       type="hidden"  value="${payuData.accountId}" >
  <input name="description"     type="hidden"  value="pagomultiproduco">
  <input name="referenceCode"   type="hidden"  value="${payuData.referenceCode}" >
  <input name="amount"          type="hidden"  value="${result}"   >
  <input name="tax"             type="hidden"  value="0"  >
  <input name="taxReturnBase"   type="hidden"  value="0" >
  <input name="currency"        type="hidden"  value="${payuData.currency}" >
  <input name="signature"       type="hidden"  value="${signature}"  >
  <input name="test"            type="hidden"  value="1" >
  <input name="buyerEmail"      type="hidden"  value="${userData.email}" >
  <input name="responseUrl"     type="hidden"  value="http://www.test.com/response" >
  <input name="confirmationUrl" type="hidden"  value="http://www.test.com/confirmation" >
  <button name="submit" type="submit" class="pay"><i class="fa-solid fa-circle-dollar-to-slot dollar"></i><span class="text">pagar</span></button>
</form>
  `;
buttonContainer.innerHTML = button;
}
payButtonAdd()