// script.js

const dodajRadnika = async (ime, prezime, jmbg, godinaRodjenja, email, brojTelefona, nazivSektora) => {
    try {

        const response = await fetch('http://localhost:8080/dodajradnika', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    Ime: ime,
                    Prezime: prezime,
                    JMBG: jmbg,
                    Godina_rodjenja: godinaRodjenja,
                    Email: email,
                    Broj_telefona: brojTelefona,
                    Naziv: nazivSektora
                }
            )
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Dodaj Radnika:', data);
        } else {
            console.error('Failed to add Radnik:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const obrisiRadnika = async (jmbg) => {
    try {
        const radnik = {
            JMBG: jmbg
        }

        const response = await fetch('http://localhost:8080/obrisiradnika', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(radnik),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Obrisi Radnika:', data);
            // Refresh the table after deletion
            prikaziSveRadnike();
        } else {
            console.error('Failed to delete Radnik:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const izmeniRadnika = async (jmbg, email, telefon) => {
    try {
        const response = await fetch('http://localhost:8080/izmeniradnika', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                JMBG: jmbg,
                Broj_telefona: telefon,
                Email: email
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Izmeni Radnika:', data);
        } else {
            console.error('Failed to update Radnik:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const prikaziSveRadnike = async () => {
    try {
        const existingTable = document.getElementById('workerTable');
        if (existingTable) {
            existingTable.remove();
        }

        const response = await fetch('http://localhost:8080/prikazisveradnike');
        if (response.ok) {
            const data = await response.json();

            const table = document.createElement('table');
            table.id = 'workerTable';
            table.border = '1';

            // Create the table header
            const thead = table.createTHead();
            const headerRow = thead.insertRow();
            ['Ime', 'Prezime', 'JMBG', 'Email', 'Broj telefona'].forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            // Create the table body and populate it with worker data
            const tbody = document.createElement('tbody');
            data.forEach(worker => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = worker.Ime;
                row.insertCell(1).textContent = worker.Prezime;
                row.insertCell(2).textContent = worker.JMBG;

                // Create email input field for editing
                const emailInput = document.createElement('input');
                emailInput.type = 'text';
                emailInput.value = worker.Email;

                // Create phone number input field for editing
                const brojTelefonaInput = document.createElement('input');
                brojTelefonaInput.type = 'text';
                brojTelefonaInput.value = worker['Broj_telefona'];

                // Create trash bin button for deleting a worker
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
                deleteButton.addEventListener('click', () => {
                    obrisiRadnika(worker.JMBG);
                });

                // Create pencil button for editing email and phone number fields
                const editButton = document.createElement('button');
                editButton.innerHTML = '<i class="bi bi-pencil"></i>';
                editButton.addEventListener('click', () => {
                    emailInput.disabled = false;
                    brojTelefonaInput.disabled = false;
                    saveButton.style.display = 'inline';
                });

                // Create save button for saving changes
                const saveButton = document.createElement('button');
                saveButton.innerHTML = 'Save';
                saveButton.style.display = 'none';
                saveButton.addEventListener('click', () => {
                    izmeniRadnika(
                        worker.JMBG,
                        emailInput.value,
                        brojTelefonaInput.value
                    );
                    emailInput.disabled = true;
                    brojTelefonaInput.disabled = true;
                    saveButton.style.display = 'none';
                });

                // Append elements to table row
                row.insertCell(3).appendChild(emailInput);
                row.insertCell(4).appendChild(brojTelefonaInput);
                const actionsCell = row.insertCell(5);
                actionsCell.appendChild(deleteButton);
                actionsCell.appendChild(editButton);
                actionsCell.appendChild(saveButton);

                // Initially disable the input fields and save button
                emailInput.disabled = true;
                brojTelefonaInput.disabled = true;
            });

            // Append the table to the body
            table.appendChild(thead);
            table.appendChild(tbody);

            const roditelj = document.querySelector('.radniciInfo')

            roditelj.appendChild(table);
        } else {
            console.error('Failed to fetch Radnici:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const prikaziSveSektore = async () => {
    try {
        const response = await fetch('http://localhost:8080/prikazisvesektore');
        if (response.ok) {
            const data = await response.json();
            console.log('Prikazi Sve Sektore:', data);

            // Get the container where you want to display the sectors
            const sectorsContainer = document.getElementById('sectorsContainer');

            // Check if the container already exists, remove it if it does
            const existingContainer = document.getElementById('sectorsContainer');
            if (existingContainer) {
                existingContainer.remove();
            }

            // Create a new container
            const newSectorsContainer = document.createElement('div');
            newSectorsContainer.id = 'sectorsContainer';

            const roditelj = document.querySelector('.divZaSektore')
            // Append the new container to the body
            roditelj.appendChild(newSectorsContainer);

            // Iterate over each sector and create a container for it
            data.forEach(sektor => {
                // Create a Bootstrap card for each sector
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3');

                // Create card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                cardBody.classList.add(`${sektor.Naziv}`)

                // Add sector attributes to card body
                const nazivElement = document.createElement('h5');
                nazivElement.classList.add('card-title', 'text-dark'); // Added text-dark class
                nazivElement.textContent = `Naziv: ${sektor.Naziv}`;

                const brojZaposlenihElement = document.createElement('p');
                brojZaposlenihElement.classList.add('card-text', 'text-dark'); // Added text-dark class
                brojZaposlenihElement.textContent = `Broj zaposlenih: ${sektor.Broj_zaposlenih.low}`;

                // Add delete button with trash can icon
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-danger', 'mx-2'); // Added Bootstrap button classes
                deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
                deleteButton.addEventListener('click', async (event) => {
                    event.preventDefault();
                    await obrisiSektor(sektor.Naziv);
                    // After deletion, refresh the displayed sectors
                    prikaziSveSektore();
                });

                const showWorkersButton = document.createElement('button');
                showWorkersButton.classList.add('btn', 'btn-info', 'mx-2'); // Added Bootstrap button classes
                showWorkersButton.innerHTML = '<i class="bi bi-people"></i>';
                showWorkersButton.addEventListener('click', async (event) => {
                    event.preventDefault();
                    await prikaziSveRadnikeSektora(sektor.Naziv);
                });

                // Append elements to card body
                cardBody.appendChild(nazivElement);
                cardBody.appendChild(brojZaposlenihElement);
                cardBody.appendChild(deleteButton);
                cardBody.appendChild(showWorkersButton);

                // Append card body to card
                card.appendChild(cardBody);

                // Append card to the new container
                newSectorsContainer.appendChild(card);
            });
        } else {
            console.error('Failed to fetch Sektori:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const dodajSektor = async (naziv) => {
    try {
        const response = await fetch('http://localhost:8080/dodajsektor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Naziv: naziv }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Dodaj Sektor:', data);
        } else {
            console.error('Failed to add Sektor:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const obrisiSektor = async (naziv) => {
    try {
        const sektor = {
            Naziv: naziv
        }


        const response = await fetch('http://localhost:8080/obrisisektor', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sektor),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Obrisi Sektor:', data);
        } else {
            console.error('Failed to delete Sektor:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const obrisiProjekat = async (naziv) => {
    try {
        console.log(naziv)
        const response = await fetch('http://localhost:8080/obrisiprojekat', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({Naziv: naziv}),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Obrisi projekat:', data);
            prikaziSveProjekte()
        } else {
            console.error('Failed to delete projekat:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const prikaziSveRadnikeSektora = async (naziv) => {
    try {
        const response = await fetch('http://localhost:8080/prikaziradnikesektora', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Naziv: naziv }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`Prikazi Radnike Sektora '${naziv}':`, data);
            let existingTable = document.getElementById(`radniciSektora${naziv}`);

            if (existingTable) {
                existingTable.remove();
            }
            // Create a table for displaying worker attributes
            const table = document.createElement('table');
            table.id = `radniciSektora${naziv}`
            table.border = '1';

            // Create the table header
            const thead = table.createTHead();
            const headerRow = thead.insertRow();
            ['Ime', 'Prezime', 'Email'].forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.classList.add('text-dark'); // Added text-dark class to the header cell
                headerRow.appendChild(th);
            });

            // Create the table body and populate it with worker data
            const tbody = document.createElement('tbody');
            data.forEach(worker => {
                const row = tbody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);

                // Set class for the cells
                cell1.classList.add('text-dark');
                cell2.classList.add('text-dark');
                cell3.classList.add('text-dark');

                cell1.textContent = worker.Ime;
                cell2.textContent = worker.Prezime;
                cell3.textContent = worker.Email;
            });

            // Append the table to the body
            table.appendChild(thead);
            table.appendChild(tbody);

            const roditelj = document.querySelector(`.${naziv}`)

            roditelj.appendChild(table);

        } else {
            console.error('Failed to fetch Radnici Sektora:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const populateSektorDropdown = async () => {
    const dropdown = document.getElementById('nazivSektoraMeni');
    
    try {
        const response = await fetch('http://localhost:8080/prikazisvesektore');
        if (response.ok) {
            const data = await response.json();

            // Clear existing options
            dropdown.innerHTML = '';

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.text = 'Izaberite sektor';
            defaultOption.value = '';
            dropdown.add(defaultOption);

            // Add options for each sector
            data.forEach(sektor => {
                const option = document.createElement('option');
                option.text = sektor.Naziv;
                option.value = sektor.Naziv;
                dropdown.add(option);
            });
        } else {
            console.error('Failed to fetch Sektori:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const populateSektorDropdown2 = async () => {
    const dropdown = document.getElementById('nazivSektoraZaProj');
    
    try {
        const response = await fetch('http://localhost:8080/prikazisvesektore');
        if (response.ok) {
            const data = await response.json();

            // Clear existing options
            dropdown.innerHTML = '';

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.text = 'Izaberite sektor';
            defaultOption.value = '';
            dropdown.add(defaultOption);

            // Add options for each sector
            data.forEach(sektor => {
                const option = document.createElement('option');
                option.text = sektor.Naziv;
                option.value = sektor.Naziv;
                dropdown.add(option);
            });
        } else {
            console.error('Failed to fetch Sektori:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust the format as needed
};

const izmeniProjekat = async (naziv, status) => {
    try {
        const response = await fetch('http://localhost:8080/izmeniprojekat', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Naziv: naziv,
                Status: status
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Izmeni projeakt:', data);
        } else {
            console.error('Failed to update projekat:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const prikaziSveProjekte = async () => {
    try {
        const existingTable = document.getElementById('projektiTable');
        if (existingTable) {
            existingTable.remove();
        }

        const response = await fetch('http://localhost:8080/prikazisveprojekte');
        if (response.ok) {
            const data = await response.json();
            // Create the table
            const table = document.createElement('table');
            table.id = 'projektiTable';
            table.border = '1';

            // Create the table header
            const thead = table.createTHead();
            const headerRow = thead.insertRow();
            ['Naziv_projekta', 'Status_projekta', 'Budzet', 'Datum_pocetka', 'Rok_izrade', 'Actions'].forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            // Create the table body and populate it with project data
            const tbody = document.createElement('tbody');
            data.forEach(projekat => {
                const row = tbody.insertRow();

                // Create phone number input field for editing
                const statusInput = document.createElement('input');
                statusInput.type = 'text';
                statusInput.value = projekat['Status'];

                row.insertCell(0).textContent = projekat.Naziv;
                row.insertCell(1).appendChild(statusInput);
                row.insertCell(2).textContent = projekat.Budzet;
                row.insertCell(3).textContent = formatDate(projekat.Datum_pocetka);
                row.insertCell(4).textContent = formatDate(projekat.Rok_izrade);

                // Add delete button with trash bin icon
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
                deleteButton.addEventListener('click', async () => {
                    obrisiProjekat(projekat.Naziv);
                    // After deletion, refresh the displayed projects
                    prikaziSveProjekte();
                });

                // Add edit button with pencil icon
                const editButton = document.createElement('button');
                editButton.innerHTML = '<i class="bi bi-pencil"></i>';
                editButton.addEventListener('click', () => {
                    statusInput.disabled = false;
                    saveButton.style.display = 'inline';
                });

                // Create save button for saving changes
                const saveButton = document.createElement('button');
                saveButton.innerHTML = 'Save';
                saveButton.style.display = 'none';
                saveButton.addEventListener('click', () => {
                    izmeniProjekat(
                        projekat.Naziv,
                        statusInput.value
                    );
                    statusInput.disabled = true;
                    saveButton.style.display = 'none';
                });

                // Create cell for actions
                const actionsCell = row.insertCell(5);
                actionsCell.appendChild(deleteButton);
                actionsCell.appendChild(editButton);
                actionsCell.appendChild(saveButton);

                statusInput.disabled = true;
            });

            // Append the table to the body
            table.appendChild(thead);
            table.appendChild(tbody);

            const roditelj = document.querySelector('.roditeljskaKlasaProjekti')

            roditelj.appendChild(table);
        } else {
            console.error('Failed to fetch Projekti:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};



// Create trash bin button for deleting a worker
const deleteButton = document.createElement('button');
deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
deleteButton.addEventListener('click', () => {
    obrisiRadnika(worker.JMBG);
});

// Create pencil button for editing email and phone number fields
const editButton = document.createElement('button');
editButton.innerHTML = '<i class="bi bi-pencil"></i>';
editButton.addEventListener('click', () => {
    emailInput.style.display = emailInput.style.display === 'none' ? 'block' : 'none';
    brojTelefonaInput.style.display = brojTelefonaInput.style.display === 'none' ? 'block' : 'none';
    saveButton.style.display = saveButton.style.display === 'none' ? 'inline' : 'none';
});

populateSektorDropdown()
populateSektorDropdown2()


const btnPrikaziRadnike = document.querySelector('.btnPrikaziRadnike')
const btnPrikaziSektore = document.querySelector('.btnPrikaziSektore')
const btnDodajSektor = document.querySelector('.btnDodajSektor')
const btnObrisiSektor = document.querySelector('.btnObrisiSektor')
const btnDodajRadnika = document.querySelector('.btnDodajRadnika')
const btnPrikaziProjekte = document.querySelector('.btnPrikaziProjekte')
const btnDodajProjekat = document.querySelector('.dodajProjekatBtn')

btnPrikaziRadnike.addEventListener('click', (event) => {
    event.preventDefault()

    prikaziSveRadnike()
})

btnPrikaziSektore.addEventListener('click', (event) => {
    event.preventDefault()

    prikaziSveSektore()
})

btnDodajSektor.addEventListener('click', (event) => {
    event.preventDefault()
    
    const nazivSektora = document.getElementById('emailAddressBelow').value;

    // Check if the input value is not empty
    if (nazivSektora.trim() !== '') {
        // Call dodajSektor with the input value as a parameter
        dodajSektor(nazivSektora);
    } else {
        // Alert or handle the case where the input is empty
        console.log('Please enter a valid Naziv sektora.');
    }
})

btnDodajRadnika.addEventListener('click', (event) => {
    event.preventDefault()

    const ime = document.getElementById('ime').value;
    const prezime = document.getElementById('prezime').value;
    const jmbg = document.getElementById('jmbg').value;
    const godinaRodjenja = document.getElementById('godinaRodjenja').value;
    const email = document.getElementById('email').value;
    const brojTelefona = document.getElementById('brojTelefona').value;
    const selectedSektor = document.getElementById('nazivSektoraMeni').value;

    // Call the dodajRadnika function with the obtained values
    dodajRadnika(ime, prezime, jmbg, godinaRodjenja, email, brojTelefona, selectedSektor);
})

btnPrikaziProjekte.addEventListener('click', (event) => {
    event.preventDefault()

    prikaziSveProjekte()
})

btnDodajProjekat.addEventListener('click', async (event) => {
    event.preventDefault()

    const nazivProjekta = document.getElementById('nazivProjekta').value;
    const statusProjekta = document.getElementById('statusProjekta').value;
    const budzet = document.getElementById('budzet').value;
    const datumPocetka = document.getElementById('datumPocetka').value;
    const rokIzrade = document.getElementById('rokIzrade').value;
    const nazivSektora = document.getElementById('nazivSektoraZaProj').value;

    const data = {
        Naziv_projekta: nazivProjekta,
        Status_projekta: statusProjekta,
        Budzet: budzet,
        Datum_pocetka: datumPocetka,
        Rok_izrade: rokIzrade,
        Naziv_sektora: nazivSektora
    };
    //console.log(data)
    const response = await fetch('http://localhost:8080/dodajprojekat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        // Project added successfully, you may want to handle the response
        console.log('Projekat uspesno dodat i povezan sa timom');
        // You can also refresh the displayed projects
        prikaziSveProjekte();
    } else {
        console.error('Failed to add Projekat:', response.statusText);
    }
})