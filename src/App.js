import axios from 'axios'
import React, {useState} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

let headers = ['MGLT',
  'cargo_capacity',
  'consumables',
  'cost_in_credits',
  'created',
  'crew',
  'edited',
  'films',
  'hyperdrive_rating',
  'length',
  'manufacturer',
  'max_atmosphering_speed',
  'model',
  'name',
  'passengers',
  'pilots',
  'starship_class',
  'url']

function App() {

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])

  async function getter(){
    if(!isLoading) return;
let request = await axios.get('https://swapi.dev/api/starships/')
let res = request.data.results
res = await Promise.all(res.map(async item=>{
  item.films = await Promise.all(item.films.map(async (filmUrl, i)=>{
  let film = await axios.get(filmUrl)
return i === 0? film.data.title: `, ${film.data.title}`}))

item.pilots = await Promise.all(item.pilots.map(async (pilotUrl, i)=>{
  let pilots = await axios.get(pilotUrl)
  console.log({pilots})
return i === 0? pilots.data.name: `, ${pilots.data.name}`}))

  return item
})
  )
setData(res)
setIsLoading(false)
  }
  
  getter()
  
  function capitalise(array){
    let capitalisedArray = array.map((str, i) =>str.charAt(0).toUpperCase() + str.slice(1))
    return capitalisedArray.map((string, i) => i === 0? string : ` ${string}` )
  }

  function createRows(){

    function parser(header,dataObj){
      
      if(header === "created" || header === "edited"){
        let data = dataObj[header]
        return <TableCell>{data.split("T")[0]}</TableCell>
      }
return <TableCell>{dataObj[header]}</TableCell>
    }

    function createCells(dataObj){
     return headers.map(header => parser(header,dataObj))
    }
    return data.map(dataObj=><TableRow>{createCells(dataObj)}</TableRow>)
  }

  return (
    <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow style={{backgroundColor:'#0010A3'}}>
            {headers.map(item=><TableCell style={{minWidth:200,color:'white'}}>{capitalise(item.split("_"))}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading?<TableCell colSpan={headers.length}>Loading</TableCell> :createRows()}
          </TableBody></Table></TableContainer>
    </div>
  );
}

export default App;
