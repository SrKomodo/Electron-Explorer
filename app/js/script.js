const fs = require("fs");                  // Oh
const os = require("os");                  // God
const path = require('path');              // So
const {shell} = require('electron');       // Many
const remote = require('electron').remote; // Requrires
const ws = require('windows-shortcuts');
const octicons = require('octicons');
const colors = require( "./colors.json" );

var pathHistory = []; // This variable stores the history for the "back" button

$(() => {                   // On startup
  $("#path").val(os.homedir()); // Make first directory the home directory
  $("#path").change();          // And load directory
  loadBookMarks();              // You dont really have to be a genius to guess what this does

  // These 5 lines set the intial icons for most buttons
  $("#min-btn").html(octicons['dash'].toSVG({ "width": 32, "height": 32}));
  $("#max-btn").html(octicons['chevron-up'].toSVG({ "width": 32, "height": 32}));
  $("#close-btn").html(octicons['x'].toSVG({ "width": 32, "height": 32}));
  $("#back").html(octicons["arrow-left"].toSVG({ "width": 32, "height": 32 }));
  $("#bookmark").html(octicons["pin"].toSVG({ "width": 16, "height": 16 }));

  let window = remote.getCurrentWindow();

  window.on("maximize", () => { // When the window is maximized then change the icon to minimize
    $("#max-btn").html(octicons['chevron-down'].toSVG({ "width": 32, "height": 32}));
  });

  window.on("unmaximize", () => { // The same as the last thingie but the opposite
    $("#max-btn").html(octicons['chevron-up'].toSVG({ "width": 32, "height": 32}));
  });
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

              item.click(() => {                    // On click
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
                        `).addClass("folder"); // Then add a "folder shorcut" icon

                        item.click(() => { // And on click go to the target folder
                          $("#path").val(options.expanded.target);
                          $("#path").change();
                        });

                      } else { // If the target is a file

                        item.click(() => { // Then open the file on click
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

                item.click(() => {  // On click open the file
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
            }  // This
          }  // Is
        });// A
      }  // Lot
    }  // Of
  });// Indentation
}

$("#path").change(() => { // When the path changes

  $("#path").val( // Make sure the separators are correct
    path.normalize($("#path").val()
    .split(/[\\/]/)
    .join(path.sep))
  );

  pathHistory.push($("#path").val()); // Add the path to the directory
  $("#files").html("");               // Then clear the file list
  indexDirectory($("#path").val());   // And index the new path

});

$("#back").click(() => { // When you click the back button

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

$("#min-btn").click(function () {         // When I click the minimize button
  let window = remote.getCurrentWindow(); // Guess what happens?
  window.minimize();                      // It minimizes!
});                                       // WHOA TECHNOLOGY

$("#close-btn").click(function () {       // And what happens when I click the close button ?
  let window = remote.getCurrentWindow(); // GUESS WHAT
  window.close();                         // IT CLOSES
});                                       // OH MY GOD !!!!!!!1!111!!!!oneoneone

$("#max-btn").click(function () {         // Ok this atleast actually does something
  let window = remote.getCurrentWindow(); // When you click the "resize" thing
  if (!window.isMaximized()) {            // If the window isnt maximized
    window.maximize();                    // It maximizes
  } else {                                // And if it is
    window.unmaximize();                  // Then unmaximize
  }
});

function loadBookMarks() {
  let bookmarks = JSON.parse(fs.readFileSync(__dirname + '\\bookmarks.json', 'utf8'));
  $("#bookmarks").html("");
  for (let bookmark in bookmarks) {
    $("#bookmarks").append(`<div class="bookmarkItem"><span>${bookmark}</span></div>`);
    let item = $("#bookmarks").children().last();
    item.prepend(octicons.bookmark.toSVG({ "width": 16, "height": 16 }));
    item.click(() => {
      $("#path").val(bookmarks[bookmark]);
      $("#path").change();
    });
  }
}

$("#bookmark").click(() => {
  let bookmarks = JSON.parse(fs.readFileSync(__dirname + '\\bookmarks.json', 'utf8'));
  let name = $("#path").val().split(path.sep).slice(-1)[0];
  if (bookmarks[name]) {
    delete bookmarks[name];
  } else {
    bookmarks[name] = $("#path").val();
  }
  fs.writeFile(__dirname + '\\bookmarks.json', JSON.stringify(bookmarks), (err) => {if(err) console.error(err);loadBookMarks();});
});