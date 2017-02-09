const fs = require("fs");
const os = require("os");
const path = require('path');
const {shell} = require('electron');
const ws = require('windows-shortcuts');
const remote = require('electron').remote;
const octicons = require('octicons');

$(function(){
  $("#path").val(os.homedir()); // Make first directory the home directory
  $("#path").change(); // Load directory
});

var pathHistory = [];

function indexDirectory(directory) {
  let window = remote.getCurrentWindow();
  window.setTitle(directory.split(path.sep).slice(-1)[0]);
  fs.readdir(directory, function(err, files) { // Read the directory
    if(err) console.error(err); // Log errors
    else {
      let index = 0; // Declare index
      for (let file of files) { // Iterate over all files
        fs.stat(path.join(directory,file),function(err, stats) { //Find out stuff about item
          if(err) console.error(err); // Log errors
          else {
            index += 1; // Increase index

            $("#files").append(`<div class="fileListElement">${file}</div>`); // Add item to list
            let item = $("#files").children().last(); // Store item in variable for ease of use
            item.wrap( "<a href='#'></a>" ); // Make clickable

            if (stats.isDirectory()) { // If item is a folder
              item.prepend(`${octicons['file-directory'].toSVG({ "class": "folder", "width": 16, "height": 16 })}`); // Add folder icon
              item.click(function(){ // On click
                $("#path").val(`${directory}/${file}`); // Go to directory
                $("#path").change(); // reload
              });
            } else
            if (stats.isFile()) { // If item is a file
              let extension = file.split(".").slice(-1)[0].toLowerCase();
              if (extension === "lnk") {
                ws.query(path.join(directory,file),function(error,options){
                  if (error) console.error(error);
                  else {
                    item.click(function(){
                      $("#path").val(options.expanded.target);
                      $("#path").change();
                    });
                  }
                });
              } else {
                item.click(function(){
                  shell.openItem(path.join(directory,file));
                });
              }
              item.prepend(`${octicons.file.toSVG({ "class": "file", "width": 16, "height": 16 })}`); // Add file icon
            }
            if (index % 2 === 1) { // If index is odd
              item.addClass("odd"); // Make odd
            }
          }
        });
      }
    }
  });
}

$("#path").change(function(){
  $("#path").val(path.normalize($("#path").val().split(/[\\/]/).join(path.sep))); // Change all slashes to be forward slashes
  pathHistory.push($("#path").val());
  $("#files").html(""); // Clear file list
  indexDirectory($("#path").val());
});

$("#back").click(function(){
  if (pathHistory.length <= 1) {
    return;
  } else {
    pathHistory.pop();
    $("#path").val(pathHistory[pathHistory.length-1]);
    pathHistory.pop();
    $("#path").change();
  }
});