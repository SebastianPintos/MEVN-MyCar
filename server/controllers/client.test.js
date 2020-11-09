//REVISAR

const client = require ("./client");

const Cliente = new Client{(
    Name: "Oscar",
    LastName: "Wilde",
    Phone: "1540388922",
    Email: "oscarwilde@gmail.com",
    Vehicle: [{null
    }],
    Status: "ACTIVE",
    DNI: "45038291",
    CUIT: "23450382915",
    CompanyName: "Librería SA",
    Nationality: "Inglés",
    TaxCategory: "A",
    ChangeStatus: [{
        Motive: "Buen comportamiento",
        EmployerID: {type: Schema.Types.ObjectId, required: true}
    },{timestamps: true}]
    )
}
test ("Properly creates a client", () =>{
    expect (client.index(Cliente,res))
    .toBe(client.create(Cliente,res))
})