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
} //uradjeno

export const preporuciTimoveSaradnika = async(req, res) => {
    try {
            let timovi = []
            const queryTimovi = `MATCH (r1:Radnik {JMBG: '${req.body.JMBG}'}), (t:Tim {Naziv: '${req.body.Naziv}'})-[:SADRZI_CLANA]->(r:Radnik)-[:JE_CLAN]->(t1:Tim)
            WHERE t <> t1
            AND NOT (r1)-[:JE_CLAN]->(t1)
            RETURN t1 AS recommended_team`
            await session
                    .run(queryTimovi)
                    .then(result => {
                        result.records.forEach(record => {
                            timovi.push(record._fields[0].properties)})
                    })
                    .catch(err => {
                        console.log(err)
                    })

        if(timovi.length > 0)
            return res.status(200).json(timovi)
        else
            return res.status(404).json("Već ste član svih timova u kojima su vaši saradnici.")

    } catch(err) {
        return res.status(500).json(err)
    }
} //uradjeno

export const preporuciTimoveSektora = async(req, res) => {
    try {
            let timovi = []
            const queryTimovi = `MATCH (r:Radnik {JMBG: '${req.body.JMBG}'})-[:RADI_U]->(s:Sektor), (p:Projekat)-[:CILJANI_SEKTOR]-(s)
            WHERE NOT (r)-[:JE_CLAN]->(:Tim)-[:RADI_NA]->(p)
            MATCH (p)<-[:RADI_NA]-(t:Tim)
            RETURN t AS recommended_team`
            await session
                    .run(queryTimovi)
                    .then(result => {
                        result.records.forEach(record => {
                            timovi.push(record._fields[0].properties)})
                    })
                    .catch(err => {
                        console.log(err)
                    })

        if(timovi.length > 0)
            return res.status(200).json(timovi)
        else
            return res.status(404).json("Već ste član svih timova koji rade na projektima iz vašeg sektora.")

    } catch(err) {
        return res.status(500).json(err)
    }
} //uradjeno

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
} //tim se dodaje dodavanjem projekta, ne postoji posebna forma za to

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
} //uradjeno

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
} //uradjeno
