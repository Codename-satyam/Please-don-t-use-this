import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Finds every image in public/images/memories (any name, jpg/png/webp/gif/avif) and hands the list to src/data/memories.js.
// Add or remove a photo and the page reloads by itself.
const DIR='public/images/memories',ID='virtual:memory-files',RID='\0'+ID,IMG=/\.(jpe?g|jfif|png|webp|gif|avif)$/i;
const memoryFiles=()=>({
  name:'memory-files',
  resolveId:id=>id===ID?RID:null,
  load(id){
    if(id!==RID)return;
    let f=[];
    try{f=fs.readdirSync(path.resolve(DIR)).filter(n=>IMG.test(n)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}))}catch{}
    return `export default ${JSON.stringify(f.map(n=>'/images/memories/'+encodeURIComponent(n)))}`;
  },
  configureServer(s){
    const dir=path.resolve(DIR);s.watcher.add(dir);
    const hit=f=>{if(path.dirname(path.resolve(f))===dir&&IMG.test(f)){const m=s.moduleGraph.getModuleById(RID);m&&s.moduleGraph.invalidateModule(m);s.ws.send({type:'full-reload'})}};
    s.watcher.on('add',hit);s.watcher.on('unlink',hit);
  }
});
export default defineConfig({plugins:[react(),memoryFiles()]});
