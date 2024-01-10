import { session } from './index.js'

//prikazi radnike - GET
export const prikaziSveRadnike = async(req, res) => {
    try {
        let radnici = []
        const query = 'MATCH (n:Radnik) RETURN n'
        await session
                .run(query)
                .then(result => {
                    result.records.forEach(record => {
                        radnici.push(record._fields[0].properties)
                    });
                })
                .catch(err => {
                    console.log(err)
                })

        return res.status(200).json(radnici)

    } catch(err) {
        return res.status(500).json(err)
    }
}

//dodaj radnika - POST
export const dodajRadnika = async(req, res) => {
    try {
        let dodatiRadnik = null
        let radnikPostoji = false
        const query0 = `MATCH (n:Radnik {JMBG: '${req.body.JMBG}'}) RETURN n`

        await session
                .run(query0)
                .then(result => {
                    if(result.records.length !== 0) {
                        radnikPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        if (!radnikPostoji) {
            const query = `CREATE (r:Radnik 
                            {
                                Ime: '${req.body.Ime}', 
                                Prezime: '${req.body.Prezime}', 
                                JMBG: '${req.body.JMBG}', 
                                Godina_rodjenja: ${req.body.Godina_rođenja},
                                Email: '${req.body.Email}',
                                Broj_telefona: '${req.body.Broj_telefona}'
                            }) 
                            RETURN r`

            await session
                    .run(query)
                    .then(result => {
                        dodatiRadnik = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            await session
                    .run(`MATCH (s:Sektor {Naziv: '${req.body.Sektor}'})
                            SET s.Broj_zaposlenih = coalesce(s.Broj_zaposlenih, 0) + 1
                            RETURN s.Broj_zaposlenih`)
                    .then(result => {
                        //console.log(`Broj zaposlenih u sektoru '${req.body.Sektor}': ${result.records[0]._fields[0]}`);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            
            const query2 = `MATCH (a:Radnik {Ime: '${req.body.Ime}'}), (b:Sektor {Naziv: '${req.body.Sektor}'}) CREATE (a)-[:RADI_U]->(b) RETURN a, b`
            
            await session
                    .run(query2)
                    .then(result => {
                        //console.log(`Broj zaposlenih u sektoru '${req.body.Sektor}': ${result.records[0]._fields[0]}`);
                    })
                    .catch(err => {
                        console.log(err);
                    });            
            
            return res.status(200).json(dodatiRadnik)
            
        } else {
            return res.status(400).json('Radnik sa unetim JMBG-om vec postoji!')
        }
        

    } catch(err) {
        return res.status(500).json(err)
    }
}

//obrisi radnika - DELETE
export const obrisiRadnika = async(req, res) => {
    try {
        let radnikPostoji = false
        const query0 = `MATCH (n:Radnik {JMBG: '${req.body.JMBG}'}) RETURN n`

        await session
                .run(query0)
                .then(result => {
                    if(result.records.length !== 0) {
                        radnikPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })


        if (radnikPostoji) {
            const query = `MATCH (n:Radnik {JMBG: '${req.body.JMBG}'}) DETACH DELETE n`
            await session
                    .run(query)
                    .then(result => {
                        //console.log(result)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            
            await session
                    .run(`MATCH (s:Sektor {Naziv: '${req.body.Sektor}'})
                            SET s.Broj_zaposlenih = coalesce(s.Broj_zaposlenih, 0) - 1
                            RETURN s.Broj_zaposlenih`)
                    .then(result => {
                        //console.log(`Broj zaposlenih u sektoru '${req.body.Sektor}': ${result.records[0]._fields[0]}`);
                    })
                    .catch(err => {
                        console.log(err);
                    });

            return res.status(200).json('Radnik uspesno obrisan')
        } else {
            return res.status(404).json('Radnik sa unetim JMBG-om ne postoji!')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

//izmeni radnika - PUT
export const izmeniRadnika = async(req, res) => {
    try {
        let radnikPostoji = false
        const query0 = `MATCH (n:Radnik {JMBG: '${req.body.JMBG}'}) RETURN n`

        await session
                .run(query0)
                .then(result => {
                    if(result.records.length !== 0) {
                        radnikPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })


        if (radnikPostoji) {
            let izmenjeniRadnik = null
            const query = `MATCH (r:Radnik {JMBG: '${req.body.JMBG}'}) SET r.Broj_telefona = '${req.body.Broj_telefona}', r.Email = '${req.body.Email}' RETURN r`
            await session
                    .run(query)
                    .then(result => {
                        izmenjeniRadnik = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json(izmenjeniRadnik)
        } else {
            return res.status(404).json('Radnik sa unetim JMBG-om ne postoji!')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}
