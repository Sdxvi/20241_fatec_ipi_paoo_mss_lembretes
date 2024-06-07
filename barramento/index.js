require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
//aplicando um middleware
app.use(express.json())

const eventos = []

//aqui recebemos todos os eventos
//e repassamos para todos os mss
app.post('/eventos', async (req, res) => {
  //aqui pegamos o evento
  const evento = req.body
  eventos.push(evento)
  console.log(evento)
  try {
    // Repassar eventos para os microsserviços interessados
    if (evento.type === 'ObservacaoClassificada') {
      await axios.post('http://localhost:5000/eventos', evento) // mss de observações
    }
    if (evento.type !== 'ObservacaoClassificada') {
      await axios.post('http://localhost:6000/eventos', evento) // mss de consulta
    }
    if (evento.type === 'ObservacaoCriada') {
      await axios.post('http://localhost:7000/eventos', evento) // mss de classificação
    }
  } catch (e) {
    console.error(e.message)
  }

  res.status(200).end()
})


app.get('/eventos', (req, res) => {
  res.status(200).json(eventos)
})

app.listen(
  process.env.PORT, 
  () => console.log(`Barramento: ${process.env.PORT}`)
)