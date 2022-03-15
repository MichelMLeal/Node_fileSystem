const express = require('express')
const router = express.Router()
const { randomUUID } = require('crypto')
const fs = require('fs')

let produts = []

function productFile() {
  fs.writeFile('Produt.json', JSON.stringify(produts), err => {
    if (err) throw err
  })
}

fs.readFile('Produt.json', 'utf-8', (err, data) => {
  if (err) throw err
  produts = JSON.parse(data)
})

router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.post('/produts', (req, res) => {
  const { name, price } = req.body

  if (!name || !price) {
    throw new Error('Name and price are required')
  }

  const product = {
    name,
    price,
    id: randomUUID()
  }

  produts.push(product)

  productFile()

  res.status(201).json(`Produt created with success!`)
})

router.get('/produts', (req, res) => {
  try {
    res.json(produts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/produts/:id', (req, res) => {
  try {
    const id = req.params.id

    const product = produts.find(produt => produt.id === id)

    if (!product) {
      throw new Error('Produt not found!')
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/product/:id', (req, res) => {
  try {
    const id = req.params.id

    const product = produts.find(produt => produt.id === id)

    if (!product) {
      throw new Error('Produt not found!')
    }

    const { name, price } = req.body

    product.name = name
    product.price = price

    productFile()

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/produts/:id', (req, res) => {
  try {
    const id = req.params.id

    const product = produts.find(produt => produt.id === id)

    if (!product) {
      throw new Error('Produt not found!')
    }

    produts = produts.filter(produt => produt.id !== id)

    productFile()

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
