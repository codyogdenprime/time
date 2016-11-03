
//checks data type with 2 paramaters, type and array of data to check
var checkDataType = function(type, arrayIn){

  for (var i = 0; i < arrayIn.length; i++)
    if( typeof(arrayIn[i]) !== type){
      console.log( 'error in checkDataType!'+arrayIn[i]+' is not a '+type+'!');
      return false;
  }else{
    return true;
  }
};
module.exports = checkDataType;
