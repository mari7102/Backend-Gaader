const express = require('express')
const router = express.Router()
const Bruger = require('../models/bruger.model')


//Getting all
router.get('/', async (req, res) => {
   try {
       const brugere = await Bruger.find()
       res.json(brugere)
   } catch (err) {
       res.status(500).json({ message: err.message})
   }
})


//Getting one
router.get('/:id', getBrugere, (req, res) => {
   res.json(res.bruger)
})



//Creating one 
router.post('/', async (req, res) => {
    const bruger = new Bruger ({
        brugerName: req.body.brugerName,
        brugerEmail: req.body.brugerEmail,
        brugerPassword: req.body.brugerPassword
    })

    try {
        const newBruger = await bruger.save()
        res.status(201).json(newBruger)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})


//Updating one
router.patch('/:id', getBrugere, async (req, res) => {
    if (req.body.brugerName != null){
        res.bruger.brugerName = req.body.brugerName
    }
    if (req.body.brugerEmail != null){
        res.bruger.brugerEmail = req.body.brugerEmail
    }
    if(req.body.brugerPassword != null){
        res.bruger.brugerPassword = req.body.brugerPassword
    }
    try {
        const updatedBruger = await res.bruger.save()
        res.json(updatedBruger)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


//Deleting one 
router.delete('/:id', getBrugere, async (req, res) => {
  try {
      await res.bruger.remove()
      res.json({ message : 'Deleted Bruger' })
  } catch (err) {
      res.status(500).json({ message: err. message})
  }
})


async function getBrugere(req, res, next){
    let bruger
    try {
        bruger = await Bruger.findById(req.params.id)
        if (bruger == null){
            return res.status(404).json({ message: 'Cannot find the bruger' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.bruger = bruger
    next()
}

module.exports = router