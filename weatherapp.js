const http= require('http');
const dotenv= require('dotenv');
const url= require('url');
const https=require('https');

dotenv.config();

const server= http.createServer((req,res)=>{
    
    const parsed= url.parse(req.url, true)
    

     if(req.method==='GET' && parsed.pathname==='/'){
        res.writeHead(200, {'Content-Type':'application/json'})
        res.write(JSON.stringify({message:"Welcome to the Weather API"}))
        res.end();
        return;
     }

    if(req.method==='GET' && parsed.pathname==='/weather'){
       
        const city= parsed.query.city;

        if(!city){
            res.writeHead(400, {'Content-Type':'application/json'})
            res.write(JSON.stringify({error:"City details are required for weather updates"}))
            res.end();
            return;
        }
   
        const apikey = process.env.WEATHER_API_KEY;
        const apiurl= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`

       const apiuse= 
        https.get(apiurl,(apires)=>{
            let body='';
            apires.on('data',(chunk)=>{
               body+=chunk;
            })

            apires.on('end',()=>{
                try{
                    const weather= JSON.parse(body)

                   if(weather.cod!==200){
                    res.writeHead(404, {'Content-Type': 'application/json'})
                    res.end(JSON.stringify({error: weather.message}))
                    return;
                   }

                   const result={
                    city: weather.name,
                    temperature: weather.main.temp,
                    humidity: weather.main.humidity,
                    windspeed: weather.wind.speed,
                    

                   }
                   res.writeHead(200,{'Content-Type':'application/json'})
                   res.end(JSON.stringify(result));
                }
                catch(err){
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Weather data not found" }));
                } 
            })

        })

        apiuse.on('error', (err)=>{
             res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Error calling API" }));
        })

        
    }
    else{

        res.writeHead(404, {'Content-Type': 'application/JSON'})
        res.write(JSON.stringify({error:'Not Found'}));

        res.end();
    }   
    
})



const PORT=3001;

server.listen(PORT,()=>{
 console.log(`server running at http://localhost:${PORT}`)
})
