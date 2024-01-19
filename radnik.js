import { session } from './index.js'

// GET
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
} //uradjeno

export const prikaziSveRadnikeSektora = async(req, res) => {
    try {

        let sektorPostoji = false
        const query0 = `MATCH (s:Sektor {Naziv: '${req.body.Naziv}'}) RETURN s`

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
            let radnici = []
            const query = `MATCH (r:Radnik)-[:RADI_U]->(s:Sektor {Naziv: '${req.body.Naziv}'}) RETURN r`
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
        } else {
            return res.status(404).json('Sektor sa unetim nazivom ne postoji!')
        }
    } catch(err) {
        return res.status(500).json(err)
    }
} //uradjeno

// POST
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
                                Godina_rodjenja: ${parseInt(req.body.Godina_rodjenja)},
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
                    .run(`MATCH (s:Sektor {Naziv: '${req.body.Naziv}'})
                            SET s.Broj_zaposlenih = coalesce(s.Broj_zaposlenih, 0) + 1
                            RETURN s.Broj_zaposlenih`)
                    .then(result => {
                        //console.log(`Broj zaposlenih u sektoru '${req.body.Sektor}': ${result.records[0]._fields[0]}`);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            
            const query2 = `MATCH (a:Radnik {JMBG: '${req.body.JMBG}'}), (b:Sektor {Naziv: '${req.body.Naziv}'}) CREATE (a)-[:RADI_U]->(b) RETURN a, b`
            
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
} //uradjeno

export const postaviSefaZaSektor = async (req, res) => {
    try {
      const { JMBG, Naziv } = req.body
  
      // Provera da li sektor već ima vezu sa radnikom
      const proveriVezuQuery = `MATCH (s:Sektor {Naziv: '${Naziv}'})-[:IMA_SEFA]->(r:Radnik) RETURN r`
      const postojecaVezaResult = await session.run(proveriVezuQuery);
  
      if (postojecaVezaResult.records.length > 0) {
        return res.status(400).json('Sektor već ima šefa.')
      }
  
      // Kreiranje veze između sektora i radnika
      const kreirajVezuQuery = `
        MATCH (r:Radnik {JMBG: '${JMBG}'})
        MATCH (s:Sektor {Naziv: '${Naziv}'})
        CREATE (s)-[:IMA_SEFA]->(r)
        RETURN r, s
      `
  
      const rezultat = await session.run(kreirajVezuQuery)
  
      // Provera da li je veza uspešno kreirana
      if (rezultat.records.length === 0) {
        return res.status(500).json('Greška prilikom kreiranja veze.');
      }
  
      const kreiraniRadnik = rezultat.records[0].get('r').properties;
      const kreiraniSektor = rezultat.records[0].get('s').properties;
  
      return res.status(200).json({
        radnik: kreiraniRadnik,
        sektor: kreiraniSektor,
        poruka: 'Veza između sektora i radnika je uspešno kreirana.'
      });
    } catch (err) {
      return res.status(500).json(err);
    }
} //uradjeno
  
export const dodajRadnikaUTim = async(req, res) => {
    try { 

        const nasQuery = `MATCH (r:Radnik {JMBG: '${req.body.JMBG}'})-[:JE_CLAN]->(t:Tim {Naziv: '${req.body.Naziv}'}) RETURN r`
        const postojecaVezaResult = await session.run(nasQuery);
  
        if (postojecaVezaResult.records.length > 0) {
            return res.status(400).json('Radnik već pripada ovom timu!')
        }


        const kreirajVezuQuery = `MATCH (r:Radnik {JMBG: '${req.body.JMBG}'}), (t:Tim {Naziv: '${req.body.Naziv}'}) 
                                    CREATE (r)-[:JE_CLAN]->(t)
                                    CREATE (t)-[:SADRZI_CLANA]->(r)
                                    RETURN r, t`

        await session
                .run(kreirajVezuQuery)
                .then(result => {
                    //console.log(`Broj zaposlenih u sektoru '${req.body.Sektor}': ${result.records[0]._fields[0]}`);
                })
                .catch(err => {
                    console.log(err);
                });           
        
        return res.status(200).json('Radnik je dodat u tim')      

    } catch(err) {
        return res.status(500).json(err)
    }
} //uradjeno

export const predloziPrijatelja = async(req, res) => {
    try { 
        let moguciPrijatelji = []

        const query = `MATCH (r1:Radnik {JMBG: '${req.body.JMBG}'}), (r2: Radnik)
                                WHERE (r1)-[:JE_PRIJATELJ]-(r2)
                                MATCH (r3:Radnik)
                                WHERE (r2)-[:JE_PRIJATELJ]-(r3) AND r1<>r3 AND NOT (r1)-[:JE_PRIJATELJ]-(r3)
                                RETURN r3`

        const query2 = `MATCH (r1:Radnik {JMBG: '${req.body.JMBG}'})-[:JE_PRIJATELJ]-(r2:Radnik)-[:JE_PRIJATELJ]-(r3:Radnik)
        WHERE r1 <> r3 AND NOT (r1)-[:JE_PRIJATELJ]-(r3)
        RETURN DISTINCT r3`

        await session
                .run(query2)
                .then(result => {
                    result.records.forEach(record => {
                        moguciPrijatelji.push(record._fields[0].properties)
                    });
                })
                .catch(err => {
                    console.log(err);
                });

        if (moguciPrijatelji.length > 0)
            return res.status(200).json(moguciPrijatelji)
        else
            return res.status(404).json("Nema nijednog predloga")

    } catch(err) {
        return res.status(500).json(err)
    }
} //uradjeno

// DELETE
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
} //uradjeno

// PUT
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
} //uradjeno

export const dodajPrijatelja = async(req, res) => {
    try{
        let vecSuPrijatelji = false

        const queryProvera = `MATCH (r1:Radnik {JMBG: '${req.body.JMBG1}'}), (r2:Radnik {JMBG: '${req.body.JMBG2}'})
                                WHERE (r1)-[:JE_PRIJATELJ]-(r2)
                                RETURN r1, r2`

        await session
                .run(queryProvera)
                .then(result => {
                    if(result.records.length !== 0) {
                        vecSuPrijatelji = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        
        if(!vecSuPrijatelji){
            let radnici = []
            const query0 = `MATCH (r1:Radnik {JMBG: '${req.body.JMBG1}'}), (r2:Radnik {JMBG: '${req.body.JMBG2}'})
                            CREATE (r1)-[:JE_PRIJATELJ]->(r2)
                            RETURN r1, r2`

                await session
                        .run(query0)
                        .then(result => {
                            //console.log("blabla")
                            console.log(result.records._fields)
                            result.records.forEach(record => {
                                radnici.push(record._fields[0].properties)
                            });
                        })
                        .catch(err => {
                            console.log(err)
                        })

            return res.status(200).json(radnici)
        } else{
            return res.status(400).json("Već ste prijatelj sa odabranim korisnikom")
        }
    } catch(err){
        return res.status(500).json(err)
    }
} //uradjeno
