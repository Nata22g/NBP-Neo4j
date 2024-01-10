import { session } from './index.js'

//prikazi radnike - GET
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
}

//dodaj radnika - POST
export const dodajProjekat = async(req, res) => {
    try {
        let dodatiProj = null
        let projPostoji = false
        const query = `MATCH (p:Projekat {Naziv: '${req.body.naziv}'}) RETURN p`

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
                                Naziv: '${req.body.naziv}', 
                                Status: '${req.body.status}', 
                                Budzet: '${req.body.budzet}', 
                                Datum_pocetka: ${req.body.datum_pocetka},   //dal je ovo string il ne
                                Rok_izrade: '${req.body.rok_izrade}',       // i ovo
                            }) 
                            RETURN p`

            await session
                    .run(query1)
                    .then(result => {
                        dodatiProj = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json(dodatiProj)
        } else {
            return res.status(400).json('Projekat sa unetim nazivom vec postoji!')
        }
        

    } catch(err) {
        return res.status(500).json(err)
    }
}

//obrisi radnika - DELETE
export const obrisiProjekat = async(req, res) => {
    try {
        let projPostoji = false
        const query = `MATCH (p:Projekat {Naziv: '${req.body.naziv}'}) RETURN p`

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
            const query1 = `MATCH (p:Projekat {Naziv: '${req.body.naziv}'}) DETACH DELETE p`
            await session
                    .run(query1)
                    .then(result => {
                        console.log(result)
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
}

//izmeni radnika - PUT
export const izmeniProjekat = async(req, res) => {
    try {
        let projPostoji = false
        const query = `MATCH (p:Projekat {Naziv: '${req.body.naziv}'}) RETURN p`

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
            const query1 = `MATCH (p:Projekat {Naziv: '${req.body.naziv}'}) SET p.Status = '${req.body.status}' RETURN p`
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
}
