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
import { dodajRadnika, izmeniRadnika, obrisiRadnika, prikaziSveRadnike } from './radnik.js'

const app = express()
app.use(express.json())

const driver = _driver('bolt://127.0.0.1:7687', auth.basic('neo4j', 'NataSekiVasa'))
export const session = driver.session({ database: 'neo4j' })

app.get('/', (req, res) => {
    res.send('It works!')
})

app.get('/prikazisveradnike', prikaziSveRadnike)
app.post('/dodajradnika', dodajRadnika)
app.delete('/obrisiradnika', obrisiRadnika)
app.put('/izmeniradnika', izmeniRadnika)

app.listen('8080', () => {
    console.log('backend server is running')
})

