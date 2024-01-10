import { session } from './index.js'

//prikazi projekte - GET
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

//dodaj projekat - POST
export const dodajProjekat = async(req, res) => {
    try {
        let dodatiProj = null
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

        if (!projPostoji) {
            const query1 = `CREATE (p:Projekat 
                            {
                                Naziv: '${req.body.Naziv}', 
                                Status: '${req.body.Status}', 
                                Budzet: '${req.body.Budzet}', 
                                Datum_pocetka: '${req.body.Datum_pocetka}',
                                Rok_izrade: '${req.body.Rok_izrade}'
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
}

//izmeni radnika - PUT
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
}
