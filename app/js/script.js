const fs = require("fs");                  // Oh
const os = require("os");                  // God
const path = require('path');              // So
const {shell} = require('electron');       // Many
const remote = require('electron').remote; // Requrires
const ws = require('windows-shortcuts');
const octicons = require('octicons');
const colors = require( "./colors.json" );

var pathHistory = []; // This variable stores the history for the "back" button

$(function(){                   // On startup
  $("#path").val(os.homedir()); // Make first directory the home directory
  $("#path").change();          // And load directory
});


function indexDirectory(directory) { // Guess what this does!

  let window = remote.getCurrentWindow();                  // Get the window
  window.setTitle(directory.split(path.sep).slice(-1)[0]); // And change the title to the current directory

  fs.readdir(directory, (err, files) => { // Read the directory
    if(err) console.error(err);           // And log any errors

    else {
      for (let file of files) {                              // Iterate over every files
        fs.stat(path.join(directory,file), (err, stats) => { // And find out stuff about every file
          if(err) console.error(err); // Log errors
          else {

            $("#files").append(`<div class="fileListElement">${file}</div>`); // Add item to list
            let item = $("#files").children().last();                         // Store item in variable for ease of use

            if (stats.isDirectory()) { // If the item is a folder
              item.prepend(`
                ${octicons['file-directory'].toSVG({
                  "class": "folder",
                  "width": 16,
                  "height": 16
                })}
              `); // Add folder icon

              item.click(function(){                    // On click
                $("#path").val(`${directory}/${file}`); // Go to directory
                $("#path").change();                    // And reload
              });
            } else

            if (stats.isFile()) { // If the item is a file

              let extension = path.extname(file).toLowerCase(); // Get the extension as a variable

              if (extension === ".lnk") {                               // If the file is a shorcut
                ws.query(path.join(directory,file),(error,options) => { // Then analize the shorcut
                  if (error) console.error(error); // Log errors
                  else {

                    fs.stat(options.expanded.target,(err,stats) =>{ // Analize the target of the shorcut
                      if (err) { // If the target is invalid

                        item.prepend(`
                          ${octicons["file-symlink-file"].toSVG({
                            "width": 16,
                            "height": 16
                          })}
                        `).css("fill","#f55"); // Show a "broken link" icon
                        console.error(err);    // And log the error

                      } else
                      if (stats.isDirectory()) { // If the target is a folder
                        item.prepend(`
                          ${octicons["file-symlink-directory"].toSVG({
                            "width": 16,
                            "height": 16
                          })}
                        `).css("fill","#e5e589"); // Then add a "folder shorcut" icon

                        item.click(function(){ // And on click go to the target folder
                          $("#path").val(options.expanded.target);
                          $("#path").change();
                        });

                      } else { // If the target is a file

                        item.click(function(){ // Then open the file on click
                          shell.openItem(options.expanded.target);
                        });

                        item.prepend(`
                          ${octicons["file-symlink-file"].toSVG({
                            "width": 16,
                            "height": 16
                          })}
                        `).css("fill","#aaaaaa"); // And add a shorcut icon

                      }
                    });
                  }
                });
              } else { // If it isnt a shorcut or directory

                item.click(function(){  // On click open the file
                  shell.openItem(path.join(directory,file));
                });

                for (let config in colors) { // Iterate over the icon list
                  if (colors[config].matches.includes(extension)) { // If the file extension is in the list
                    item.prepend(octicons[colors[config].icon].toSVG({
                      "width": 16,
                      "height": 16
                    })).css("fill",colors[config].color); // Then add that icon and color
                    return;
                  }
                } // If it isnt on the list
                item.prepend(`
                  ${octicons.file.toSVG({
                    "width": 16,
                    "height": 16
                  })}
                `); // Add a default file icon
              }
            } // This
          }  // Is
        }); // A
      }    // Lot
    }     // Of
  });    // Indentation
}

$("#path").change(function(){ // When the path changes

  $("#path").val( // Make sure the separators are correct
    path.normalize($("#path").val()
    .split(/[\\/]/)
    .join(path.sep))
  );

  pathHistory.push($("#path").val()); // Add the path to the directory
  $("#files").html("");               // Then clear the file list
  indexDirectory($("#path").val());   // And index the new path

});

$("#back").click(function(){ // When you click the back button

  if (pathHistory.length <= 1) { // If the history is basicly empty
    return;                      // Then do nothing
  }
  else {                                               // If there is stuff on the history
    pathHistory.pop();                                 // Remove the last element
    $("#path").val(pathHistory[pathHistory.length-1]); // Set the path to the one before
    pathHistory.pop();                                 // Remove this path (because its added again later)
    $("#path").change();                               // And trigger a change in the path
  }

});