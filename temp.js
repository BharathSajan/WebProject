const {myCommunities,getuid} = require('./dbfunctions')

myCommunities(2, (errs, result)=>{
    if(errs){
      console.log(errs);
    }
    else{
      console.log(result);
    }
  });

  getuid('anand_b200763cs@nitc.ac.in', (err,row)=>{
    if(err){
      console.log(err);
    }
    else{
        console.log(row);
      }
  });