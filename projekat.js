import { session } from './index.js'

// GET
export const prikaziSveProjekte = async(req, res) => {
    try {
        let projekti = []
        const query = 'MATCH (p:Projekat) RETURN p'
        await session
                .run(query)
                .then(result => {
                    result.records.forEach(record => {
                        projekti.push(record._fields[0].properties)
                    });
                })
                .catch(err => {
                    console.log(err)
                })

        return res.status(200).json(projekti)

    } catch(err) {
        return res.status(500).json(err)
    }
} //uradjeno

// POST
export const dodajProjekat = async(req, res) => {
    try {
        let dodatiProj = null
        let projPostoji = false
        const query = `MATCH (p:Projekat {Naziv: '${req.body.Naziv_projekta}'}) RETURN p`

        await session
            .run(query)
            .then(result => {
                if(result.records.length !== 0) {
                    projPostoji = true
                }
            })
            .catch(err => {
                console.log(err)
            })

        if (!projPostoji) {
            const query1 = `CREATE (p:Projekat 
                            {
                                Naziv: '${req.body.Naziv_projekta}', 
                                Status: '${req.body.Status_projekta}', 
                                Budzet: '${req.body.Budzet}', 
                                Datum_pocetka: '${req.body.Datum_pocetka}',
                                Rok_izrade: '${req.body.Rok_izrade}'
                            }) 
                            RETURN p`

            const queryTim = `CREATE (t:Tim {
                                                Naziv: '${req.body.Naziv_projekta} tim',
                                                Status: 'INACTIVE'
                                            }) 
                                    RETURN t`

            await session
                    .run(queryTim)
                    .then(result => {
                        //dodatiProj = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            await session
                    .run(query1)
                    .then(result => {
                        dodatiProj = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            const queryVeza = `MATCH (a:Tim {Naziv: '${req.body.Naziv_projekta} tim'}), (b:Projekat {Naziv: '${req.body.Naziv_projekta}'}) CREATE (a)-[:RADI_NA]->(b) RETURN a, b`
            await session
                    .run(queryVeza)
                    .then(result => {
                        //dodatiProj = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            const vezaCiljaniSektor = `MATCH (p:Projekat {Naziv: '${req.body.Naziv_projekta}'}), (s:Sektor {Naziv: '${req.body.Naziv_sektora}'})
                                        CREATE (p)-[:CILJANI_SEKTOR]->(s)`
            
            await session
                    .run(vezaCiljaniSektor)
                    .then(result => {
                        //dodatiProj = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json("Projekat uspesno dodat i povezan sa timom")
        } else {
            return res.status(400).json('Projekat sa unetim nazivom vec postoji!')
        }
        

    } catch(err) {
        return res.status(500).json(err)
    }
} //uradjeno

// DELETE
export const obrisiProjekat = async(req, res) => {
    try {
        let projPostoji = false
        const query = `MATCH (p:Projekat {Naziv: '${req.body.Naziv}'}) RETURN p`

        await session
                .run(query)
                .then(result => {
                    if(result.records.length !== 0) {
                        projPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })


        if (projPostoji) {
            const query1 = `MATCH (p:Projekat {Naziv: '${req.body.Naziv}'}) DETACH DELETE p`
            await session
                    .run(query1)
                    .then(result => {
                        //console.log(result)
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json('Projekat uspesno obrisan')
        } else {
            return res.status(404).json('Projekat sa unetim nazivom ne postoji!')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
} //uradjeno

// PUT
export const izmeniProjekat = async(req, res) => {
    try {
        let projPostoji = false
        const query = `MATCH (p:Projekat {Naziv: '${req.body.Naziv}'}) RETURN p`

        await session
                .run(query)
                .then(result => {
                    if(result.records.length !== 0) {
                        projPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })


        if (projPostoji) {
            let izmenjeniProj = null
            const query1 = `MATCH (p:Projekat {Naziv: '${req.body.Naziv}'}) SET p.Status = '${req.body.Status}' RETURN p`
            await session
                    .run(query1)
                    .then(result => {
                        izmenjeniProj = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json(izmenjeniProj)
        } else {
            return res.status(404).json('Projekat sa unetim nazivom ne postoji!')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
} //uradjeno
