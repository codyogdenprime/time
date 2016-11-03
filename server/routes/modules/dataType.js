
//checks data type with 2 paramaters, type and array of data to check
var checkDataType = function(type, arrayIn){
  console.log('arrayIn',arrayIn);

  for (var i = 0; i < arrayIn.length; i++){
    //in case a number comes in as a string
    if(type == 'number'){
      arrayIn[i] = Number(arrayIn[i]);
      console.log('arrayIn[i]',arrayIn[i]);
      if(isNaN(arrayIn[i])){
        arrayIn[i]='not a number, yo';
      }//if statement
    }//if type =='number'

    if( typeof(arrayIn[i]) !== type){
      console.log( 'error in checkDataType! '+arrayIn[i]+' is not a '+type+'!');
      return false;
    }else{
      return true;
    }//else statement
  }//for loop
};//

module.exports = checkDataType;
