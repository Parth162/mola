const {MongoClient} = require('mongodb');
const fs = require('fs');

//Connect to database
async function main(){
    const uri = "mongodb+srv://parthgoel:<password>@cluster0.zkbb6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri);
 
    try {
        await client.connect();
        await  dataCSV(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

//Get data and create a CSV file
async function dataCSV(client){
    data = await client.db("mola").collection('responses').find({}).toArray();
    headers = ["S.No.","Time Taken"];

    for(let i = 1; i<11;i++){
        headers.push("Question "+i.toString());
        headers.push("Answer "+i.toString());
    }

    fs.writeFileSync('./data.csv', headers.toString()+"\n", { flag: 'w' }, err => {});

    var index = 1;
    data.forEach(element => {
        var row = [index];
        row.push(element.timeTaken);
        for(let i = 0; i<10; i++){
            row.push("\""+element.questions[i]+"\"");
            row.push(element.answers[i]);
        }
        fs.writeFileSync('./data.csv', row.toString()+"\n", { flag: 'a' }, err => {});
        index++;
    });

};

main().catch(console.error);