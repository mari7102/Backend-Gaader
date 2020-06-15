const express = require('express');
const router = express.Router();
const Bruger = require('../models/bruger.model');


//GET htpp://localhost:6000/auth/login
router.post('/login', async (req, res) => {

    const { brugerEmail, brugerPassword } = req.body;

    //Find en bruger som matcher email - hvis der ikke er en, så throw error
    const bruger = await Bruger.findOne({ brugerEmail: brugerEmail });

    //Der blev IKKE fundet en bruger med email+en - afbryd ydeligere kode:
    if (!bruger) {
        return res.status(401).json({ message: "Email findes ikke i systemet" });
    }

    //Der belv fundet en bruger:
    bruger.comparePassword(brugerPassword, function (err, isMatch) {

        //Enten fik det ikke så godt = err (error)
        if (err) {
            throw err;
        }

        //Eller det gik godt - der var et match på password
        if (isMatch) {

            req.session.userId = bruger._id;
            res.status(200).json({ message: bruger.brugerName + "er nu logget ind!" });

            
        } else{

            //Hvis der ikke var et match
            res.status(401).json({ message: "Du blev ikke logget ind - password matchede ikke" })

        }
    })
});

//GET htpp://localhost:6000/auth/logout
router.get('/logout', async (req, res) => {

    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logud lykkedes ikke - prøv igen' })

        //SLET COOKIE
        res.clearCookie(process.env.SESSION_NAME).status(200).json({ message: 'Du er logget ud' })
    })

})


//GET htpp://localhost:6000/auth/loggedin
router.get('/loggedin', async (req, res) => {
    
    //Jeg gemmer userId i cookie - så derfor spørger jeg om den er der - logget ind
    if(req.session.userId){
        //Hvis der er logget ind
        return res.status(200).json({ message: 'Login er stadig aktiv' })
    } else {
        //Hvis der ikke er login/en session
        return res.status(401).json({ message: 'Login eksistere ikke eller er udløbet'})
    }

})

module.exports = router;