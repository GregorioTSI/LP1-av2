import { coinEmitter } from './emitters/coin_emitter.js'
import { openDB } from './db.js'
import { CREATE_TABLE_BTC_VALUE, INSERT_BTC_READ, SELECT_AVG_PRICE } from './queries.js'

console.log('Iniciando leituras...')

const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'usd',
})

coinEmitter.on('btc_read', async (price) => {
  const time = new Date().toISOString()
  const formattedPrice = moneyFormatter.format(price)
  console.log(`Preço do Bitcoin em ${time} -> U$ ${formattedPrice}`)

  try {
    const db = await openDB()

    // Cria a tabela btc_value se ela não existir
    await db.exec(CREATE_TABLE_BTC_VALUE)

    // Insere o novo preço lido na tabela btc_value
    await db.run(INSERT_BTC_READ, [time, price])

    // Executa a consulta para obter o valor médio do Bitcoin
    const result = await db.get(SELECT_AVG_PRICE)

    console.log(`Valor médio do Bitcoin desde a primeira leitura -> U$ ${result.avg_price}`)
  } catch (error) {
    console.error('Erro ao salvar o preço do Bitcoin:', error)
  }
})
