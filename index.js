// import { driver as _driver, auth } from 'neo4j-driver'
// const driver = _driver('bolt://127.0.0.1:7687', auth.basic('neo4j', 'NataSekiVasa'))
// const session = driver.session({database:'neo4j'})

// const query = "CREATE (a:Sektor {Naziv: 'Kontinjeri'}) RETURN a"


// session.run(query).then(result => {
//     console.log('uspelo je')
//     session.close()
//     driver.close()
// })


// import { driver as _driver, auth } from 'neo4j-driver';

// const driver = _driver('bolt://127.0.0.1:7687', auth.basic('neo4j', 'NataSekiVasa'));
// const session = driver.session({ database: 'neo4j' });

// async function runQuery(query) {
//   try {
//     const result = await session.run(query);
//     console.log('uspesno');
//   } finally {
//     await session.close();
//   }

//   await driver.close();
// }

// const query = "CREATE (a:Sektor {Naziv: 'Kontinjeri'}) RETURN a";
// const query2 = "MATCH (a:Radnik {Ime: 'Natalija'}), (b:Sektor {Naziv: 'Backend'}) CREATE (a)-[:RADI_U]->(b) RETURN a, b"

// runQuery(query2);

import express from 'express'
import { driver as _driver, auth } from 'neo4j-driver'
import { dodajPrijatelja, dodajRadnika, dodajRadnikaUTim, izmeniRadnika, obrisiRadnika, postaviSefaZaSektor, prikaziSveRadnike, prikaziSveRadnikeSektora } from './radnik.js'
import { dodajSektor, obrisiSektor, prikaziSveSektore } from './sektor.js'
import { dodajProjekat, izmeniProjekat, obrisiProjekat, prikaziSveProjekte } from './projekat.js'
import { dodajTim, izmeniTim, obrisiTim, preporuciTimoveSaradnika, preporuciTimoveSektora, prikaziSveTimove } from './tim.js'

const app = express()
app.use(express.json())

const driver = _driver('bolt://127.0.0.1:7687', auth.basic('neo4j', 'NataSekiVasa'))
export const session = driver.session({ database: 'neo4j' })

app.get('/', (req, res) => {
    res.send('It works!')
})

//radnik
app.get('/prikazisveradnike', prikaziSveRadnike)
app.get('/prikaziradnikesektora', prikaziSveRadnikeSektora)
app.post('/dodajradnika', dodajRadnika)
app.post('/postavisefazasektor', postaviSefaZaSektor)
app.post('/dodajradnikautim', dodajRadnikaUTim)
app.delete('/obrisiradnika', obrisiRadnika)
app.put('/izmeniradnika', izmeniRadnika)
app.put('/dodajprijatelja', dodajPrijatelja)

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

