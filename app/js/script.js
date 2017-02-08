const fs = require("fs");
const os = require("os");
const remote = require('electron').remote;

$("#min-btn").click(function () {
  let window = remote.getCurrentWindow();
  window.minimize();
});

$("#max-btn").click(function () {
  var window = remote.getCurrentWindow();
  if (!window.isMaximized()) {
    $("max-btn").html("arrow_drop_down");
    window.maximize();
  } else {
    $("max-btn").html("arrow_drop_up");
    window.unmaximize();
  }
});

$("#close-btn").click(function () {
  var window = remote.getCurrentWindow();
  window.close();
});

$(function(){
  $("#path").val(os.homedir()); // Make first directory the home directory
  $("#path").change(); // Load directory
});

$("#path").change(function(){

  $("#path").val($("#path").val().split(/[\\/]/).join("\\")); // Change all slashes to be forward slashes
  $("#files").html(""); // Clear file list

  let directory = $("#path").val(); // Store directory in variable for ease of use
  fs.readdir(directory, function(err, files) { // Read the directory
    if(err) console.error(err); // Log errors
    else {
      let index = 0; // Declare index
      for (let file of files) { // Iterate over all files
        fs.stat(`${directory}/${file}`,function(err, stats) { //Find out stuff about item
          if(err) console.error(err); // Log errors
          else {
            index += 1; // Increase index

            $("#files").append(`<div class="fileListElement">${file}</div>`); // Add item to list
            let item = $("#files").children().last(); // Store item in variable for ease of use

            if (stats.isDirectory()) { // If item is a folder
              item.prepend('<span class="material-icons">folder</span>'); // Add folder icon
              item.wrap( "<a href='#'></a>" ); // Make clickable
              item.click(function(){ // On click
                $("#path").val(`${directory}/${file}`); // Go to directory
                $("#path").change(); // reload
              });
            } else
            if (stats.isFile()) { // If item is a file
              item.prepend('<span class="material-icons">insert_drive_file</span>'); // Add file icon
            }
            if (index % 2 === 1) { // If index is odd
              item.addClass("odd"); // Make odd
            }
          }
        });
      }
    }
  });
});

$("#back").click(function(){
  let separator = /[\\/]/;
  let path = $("#path").val().split(separator);
  $("#path").val(path.slice(0,-1).join("/"));
  $("#path").change();
});