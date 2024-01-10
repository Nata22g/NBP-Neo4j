import { session } from './index.js'

//prikazi timove - GET
export const prikaziSveTimove = async(req, res) => {
    try {
        let timovi = []
        const query = 'MATCH (t:Tim) RETURN t'
        await session
                .run(query)
                .then(result => {
                    result.records.forEach(record => {
                        timovi.push(record._fields[0].properties)
                    });
                })
                .catch(err => {
                    console.log(err)
                })

        return res.status(200).json(timovi)

    } catch(err) {
        return res.status(500).json(err)
    }
}

//dodaj tim - POST
export const dodajTim = async(req, res) => {
    try {
        let dodatiTim = null
        let timPostoji = false
        const query = `MATCH (t:Tim {Naziv: '${req.body.Naziv}'}) RETURN t`

        await session
                .run(query)
                .then(result => {
                    if(result.records.length !== 0) {
                        timPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        if (!timPostoji) {
            const query1 = `CREATE (t:Tim 
                            {
                                Naziv: '${req.body.Naziv}', 
                                Status: '${req.body.Status}'
                            }) 
                            RETURN t`

            await session
                    .run(query1)
                    .then(result => {
                        dodatiTim = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json(dodatiTim)
        } else {
            return res.status(400).json('Tim sa unetim nazivom vec postoji!')
        }
        

    } catch(err) {
        return res.status(500).json(err)
    }
}

//obrisi tim - DELETE
export const obrisiTim = async(req, res) => {
    try {
        let timPostoji = false
        const query = `MATCH (t:Tim {Naziv: '${req.body.Naziv}'}) RETURN t`

        await session
                .run(query)
                .then(result => {
                    if(result.records.length !== 0) {
                        timPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })


        if (timPostoji) {
            const query1 = `MATCH (t:Tim {Naziv: '${req.body.Naziv}'}) DETACH DELETE t`
            await session
                    .run(query1)
                    .then(result => {
                        console.log(result)
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json('Tim uspesno obrisan')
        } else {
            return res.status(404).json('Tim sa unetim nazivom ne postoji!')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

//izmeni tim - PUT
export const izmeniTim = async(req, res) => {
    try {
        let timPostoji = false
        const query = `MATCH (t:Tim {Naziv: '${req.body.Naziv}'}) RETURN t`

        await session
                .run(query)
                .then(result => {
                    if(result.records.length !== 0) {
                        timPostoji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })


        if (timPostoji) {
            let izmenjeniTim = null
            const query1 = `MATCH (t:Tim {Naziv: '${req.body.Naziv}'}) SET t.Status = '${req.body.Status}' RETURN t`
            await session
                    .run(query1)
                    .then(result => {
                        izmenjeniTim = result.records[0]._fields[0].properties
                    })
                    .catch(err => {
                        console.log(err)
                    })

            return res.status(200).json(izmenjeniTim)
        } else {
            return res.status(404).json('Tim sa unetim nazivom ne postoji!')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}
