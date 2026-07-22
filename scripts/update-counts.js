const fs=require('fs');
const path=require('path');
function replaceInDir(dir){
  const files=fs.readdirSync(dir);
  for(const file of files){
    const fullPath=path.join(dir,file);
    if(fs.statSync(fullPath).isDirectory()){
      replaceInDir(fullPath);
    }else if(fullPath.endsWith('.tsx')||fullPath.endsWith('.ts')){
      let content=fs.readFileSync(fullPath,'utf8');
      let changed=false;
      const map={
        '60 lessons':'102 lessons',
        '60 Lessons':'102 Lessons',
        '10 subjects':'15 subjects',
        '10 Subjects':'15 Subjects',
        "value: '60'":"value: '102'",
        "All 60":"All 102",
        "all 60":"all 102"
      };
      for(const [key,val] of Object.entries(map)){
        if(content.includes(key)){
          content=content.split(key).join(val);
          changed=true;
        }
      }
      if(changed){
        fs.writeFileSync(fullPath,content);
        console.log("Updated", fullPath);
      }
    }
  }
}
replaceInDir('src');
