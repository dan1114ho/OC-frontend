### Default

```js
const { default: paymentMethods } = require('../mocks/payment_methods');
<ContributePayment onChange={console.log} paymentMethods={paymentMethods} />;
```

### With Paypal

```js
const { default: paymentMethods } = require('../mocks/payment_methods');
<ContributePayment withPaypal onChange={console.log} paymentMethods={paymentMethods} />;
```
