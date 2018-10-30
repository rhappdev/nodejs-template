var pkg=require("../package.json");
var shelljs=require("shelljs");
var update=["sos-api"];
for (var key in pkg.dependencies){
  if (key.indexOf("fes-") === 0 ){
    update.push(key);
  }
}
console.log("Tobe updated: ",update);
update.forEach(function(upd){
  shelljs.exec("npm update "+upd);
})
console.log("Update template");
shelljs.exec("git fetch upstream");