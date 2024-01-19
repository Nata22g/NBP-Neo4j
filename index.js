import express from 'express'
import cors from 'cors'
import { driver as _driver, auth } from 'neo4j-driver'
import { dodajPrijatelja, dodajRadnika, dodajRadnikaUTim, izmeniRadnika, obrisiRadnika, postaviSefaZaSektor, predloziPrijatelja, prikaziSveRadnike, prikaziSveRadnikeSektora } from './radnik.js'
import { dodajSektor, obrisiSektor, prikaziSveSektore } from './sektor.js'
import { dodajProjekat, izmeniProjekat, obrisiProjekat, prikaziSveProjekte } from './projekat.js'
import { dodajTim, izmeniTim, obrisiTim, preporuciTimoveSaradnika, preporuciTimoveSektora, prikaziSveTimove } from './tim.js'


const app = express()
app.use(express.json())
app.use(cors());

const driver = _driver('bolt://127.0.0.1:7687', auth.basic('neo4j', 'neo4jneo4j')) //NataSekiVasa
export const session = driver.session({ database: 'neo4j' })

app.get('/', (req, res) => {
    //res.send('It works!')
})

//radnik
app.get('/prikazisveradnike', prikaziSveRadnike)
app.post('/prikaziradnikesektora', prikaziSveRadnikeSektora)
app.post('/dodajradnika', dodajRadnika)
app.post('/postavisefazasektor', postaviSefaZaSektor)
app.post('/dodajradnikautim', dodajRadnikaUTim)
app.delete('/obrisiradnika', obrisiRadnika)
app.put('/izmeniradnika', izmeniRadnika)
app.put('/dodajprijatelja', dodajPrijatelja)
app.put('/predloziprijatelja', predloziPrijatelja)

//sektor
app.get('/prikazisvesektore', prikaziSveSektore)
app.post('/dodajsektor', dodajSektor)
app.delete('/obrisisektor', obrisiSektor)

//tim
app.get('/prikazisvetimove', prikaziSveTimove)
app.get('/preporucitimovesaradnika', preporuciTimoveSaradnika)
app.get('/preporucitimovesektora', preporuciTimoveSektora)
app.post('/dodajtim', dodajTim)
app.delete('/obrisitim', obrisiTim)
app.put('/izmenitim', izmeniTim)

//projekat
app.get('/prikazisveprojekte', prikaziSveProjekte)
app.post('/dodajprojekat', dodajProjekat)
app.delete('/obrisiprojekat', obrisiProjekat)
app.put('/izmeniprojekat', izmeniProjekat)

app.listen('8080', () => {
    console.log('backend server is running')
})


