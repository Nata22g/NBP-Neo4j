import { session } from './index.js'

//prikazi sektore - GET
export const prikaziSveSektore = async(req, res) => {
    try {
        let sektori = []
        const query = 'MATCH (n:Sektor) RETURN n'
        await session
                .run(query)
                .then(result => {
                    result.records.forEach(record => {
                        sektori.push(record._fields[0].properties)
                    });
                })
                .catch(err => {
                    console.log(err)
                })

        return res.status(200).json(sektori)

    } catch(err) {
        return res.status(500).json(err)
    }
}

//dodaj sektor - POST
export const dodajSektor = async(req, res) => {
    try {
        let dodatiSektor = null
        let sektorPostoji = false
        const query0 = `MATCH (n:Sektor {Naziv: '${req.body.Naziv}'}) RETURN n`

        await session
                .run(query0)
                .then(result => {
                    if(result.records.length !== 0) {
                        sektorPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        if (!sektorPostoji) {
            const query = `CREATE (r:Sektor 
                            {
                                Naziv: '${req.body.Naziv}', 
                                Broj_zaposlenih: ${0}
                            }) 
                            RETURN r`

            await session
                    .run(query)
                    .then(result => {
                        dodatiSektor = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json(dodatiSektor)

        } else {
            return res.status(400).json('Sektor sa unetim nazivom vec postoji!')
        }

    } catch(err) {
        return res.status(500).json(err)
    }
}

//obrisi sektor - DELETE
export const obrisiSektor = async(req, res) => {
    try {
        let sektorPostoji = false
        const query0 = `MATCH (n:Sektor {Naziv: '${req.body.Naziv}'}) RETURN n`

        await session
                .run(query0)
                .then(result => {
                    if(result.records.length !== 0) {
                        sektorPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })


        if (sektorPostoji) {
            const query = `MATCH (n:Sektor {Naziv: '${req.body.Naziv}'}) DETACH DELETE n`
            await session
                    .run(query)
                    .then(result => {
                        //console.log(result)
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json('Sektor uspesno obrisan')
        } else {
            return res.status(404).json('Sektor sa unetim nazivom ne postoji!')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

//izmeni sektor - PUT
// export const izmeniSektor = async(req, res) => {
//     try {
        
//     } catch (err) {
//         return res.status(500).json(err)
//     }
// }
