const express = require('express')
const router = express.Router()
const Gaader = require('../models/gaade.model')


//Getting all
router.get('/', async (req, res) => {
    try {
        const gaader = await Gaader.find()
        res.json(gaader)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


//Getting one
router.get('/:id', getGaader, (req, res) => {

    console.log("HENT UDVALGT")

    res.json(res.gaader)
})



//Creating one 
router.post('/admin', async (req, res) => {
    const gaader = new Gaader({
        gaade: req.body.gaade,
        gaadeSvar: req.body.gaadeSvar,

    })

    try {
        const newGaader = await gaader.save()
        res.status(201).json(newGaader)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


//Updating one
router.patch('/admin/:id', getGaader, async (req, res) => {
    if (req.body.gaade != null) {
        res.gaader.gaade = req.body.gaade
    }
    if (req.body.gaadeSvar != null) {
        res.gaader.gaadeSvar = req.body.gaadeSvar
    }

    try {
        const updatedGaade = await res.gaader.save()
        res.json(updatedGaade)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//ADMIN
router.post('/', async (req, res) => {
    console.log("POST", req.body);

    const gaade = new Gaader(req.body);

    try{
        const nygaade = await gaade.save();
        res.status(201.json({message: Ny gaade er oprettet, nygaade: nygaade});
    } catch (error) {
        res.status(400.json({message: "Der er sket en fejl", error:error}))
    }
})


//Deleting one 
router.delete('/admin/:id', getGaader, async (req, res) => {
    try {
        await res.gaader.remove()
        res.json({ message: 'Deleted gaader' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getGaader(req, res, next) {
    let gaader
    try {
        gaader = await Gaader.findById(req.params.id)
        if (gaader == null) {
            return res.status(404).json({ message: 'Cannot find the gaader' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.gaader = gaader
    next()
}

module.exports = router