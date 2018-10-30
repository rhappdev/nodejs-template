var pkg=require("../package.json");
var swagger=pkg.swaggerDefinition;
var path=require("path");
var fs=require("fs");
var filePath=path.join(__dirname,"../","node_modules/sos-api/build/swaggers/",swagger+".yaml");
var outpuPath=path.join(__dirname,"../","src/definition/swagger.yaml");
if (fs.existsSync(filePath)){
  fs.createReadStream(filePath).pipe(fs.createWriteStream(outpuPath));
}else{
  console.error("File not exists ",filePath);
}