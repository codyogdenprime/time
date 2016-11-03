var express = require('express');
var path = require('path');
var pg = require('pg');
var dataChecker = express();

dataChecker.checkDataType = function(type, arrayIn){
  console.log('type logged in checkDataType module',type);
  console.log('args logged in checkDataType module', arrayIn);
  for (var i = 0; i < arrayIn.length; i++)
    if( typeof(arrayIn[i]) !== type){
      console.log( 'error!'+arrayIn[i]+' is not a '+type+'!');
      return false;
  }else{
    console.log(arrayIn[i]+' is a '+type+'!');
    return true;
  }
};
module.exports = dataChecker;
