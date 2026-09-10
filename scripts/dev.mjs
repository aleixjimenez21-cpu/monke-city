import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import './build.mjs';
const root=resolve('dist');const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
createServer(async(req,res)=>{try { const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}if(!(await stat(file)).isFile()){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(await readFile(file));}catch{res.writeHead(404).end();}}).listen(3000,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:3000'));
