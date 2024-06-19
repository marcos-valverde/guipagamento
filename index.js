const express = require('express');
const mercadopago = require('mercadopago');
const app = express();

mercadopago.MercadoPagoConfig({
    sandbox: true,
    access_token: 'TEST-636638545567788-051122-d6116aa8c855cb0347cd54a538a7e9c8-1807429787'
});

app.get("/", (req, res) => {
    res.send("Olá Mundo!");
});

app.get("/pagar", async (req, res) => {
    var id = "" + Date.now();
    var emailDoPagador = "marcos@gmail.com";

    var dados = {
        items: [
            item = {
                id: id,
                title: "2x video; 3x camisas",
                quantity: 1,
                currency_id: "BRL",
                unit_price: parseFloat(150)
            }
        ],
        payer: {
            email: emailDoPagador
        },
        external_reference: id
    }

    try {
        var pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
        banco.salvarPagamento({ id: id, email: emailDoPagador });
        return res.redirect(pagamento.body.init_point)    
    } catch (err) {
        return res.sender(err.message);
    }
});

app.post("/not", (req,res) => {
    var id = req.query.id;

    setTimeout(() => {
        var  filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(data => {
            var pagamento = data.body.results[0];
            
            if (pagamento != undefined) {
                console.log(pagamento);
            } else {
                console.log("Pagamento não existe!"); 
            }
        }).catch(err => { 
            console.log(err);
        });

    }, 20000);
    res.send("OK");
});

app.listen(3000, (req,res) => {
    console.log('Servidor Rodando...!');
});