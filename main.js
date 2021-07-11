
const path = require('path')
const url = require('url') // Для разрешения и разбора URL
const {google} = require( 'googleapis' )
const fs = require( 'fs' )
const keys = require( './keys1.json' )
const express = require( 'express' )
// const {sync} = require( 'rimraf' )
// const {json} = require( 'express' )
const Router = express.Router();


// const __dirname = path.resolve();
const PORT = process.env.PORT ?? 80;
const app = express();
let dataArr = [];

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    [ 'https://www.googleapis.com/auth/spreadsheets' ]
)
async function gsrun( cl ) {

    const gsapi = google.sheets( {version: 'v4', auth: cl} )
    const opt = {
        spreadsheetId: '16geEo4qg1I8BEKnTEPtjil36sNTB5m0UmV4OVlb0ndU',
        range: 'One'
    }
    let data = await gsapi.spreadsheets.values.get( opt )
    // let datass = await gsapi.spreadsheets.values.get({spreadsheetId: '16geEo4qg1I8BEKnTEPtjil36sNTB5m0UmV4OVlb0ndU'})
    // setdatas(data.data.values)
    const datas = data.data.values
    console.log(data)
    console.log( dataArr )
    let firstItem = [];
    dataArr = datas.map( ( item, index ) => {
        // for(let i = 0; i <= item.length; i++){
            //     return firstItem[i] = ;
            // }
        if( index === 0 ){
            firstItem = item.map(items => {return items})
            console.log(item.length);
        }
        if( index >= 1 ) {
            console.log(item)
            // return firstItem.map((el, index) => {
            //     if(index === 0){
            //     return (el + ":" + item[index]).toString()
            //     } else{
            //     return (el + ":" + (item[index].length > 2) ? item[index] : item[index])
            //     }
            // })
            return {id: `${item[ 0 ]}`, Autor: `${item[ 1 ]}`, name: `${item[ 2 ]}`}
        } 
    } 
    )
    

    console.log("v" )
    // let datas = JSON.stringify( dataArr )
    // fs.writeFileSync( 'src/man.json', `{"data": ${datas}}` )
}

app.get('/', (req, res) => {
const filePath = path.basename(req.url) || path.join(__dirname, '../build',  'index.html');
    fs.readFile(filePath, (err, content) => {
    if (err) return;
    res.end(content);
  })
    if(req.method === 'GET'){
        res.writeHead(200, {"Content-Type": "text/html"})
    }
    else{
        console.log("Ошибка:",res)
    }
})
// app.use(router);
app.use(Router.get( '/gsApi/Test', ( req, res ) => {
    client.authorize( ( err, tokens ) => {
        if( err ) {
            console.log( err )
            return
        } else {
            console.log( 'Connected' )
           gsrun( client ).then(()=> dataArr = dataArr.filter(item => item != null)).then(()=> res.json( dataArr ))
           
        }
    } ) 
     
        
    
} ))

app.listen( PORT , ()=>{
    console.log("test", PORT);
    
})