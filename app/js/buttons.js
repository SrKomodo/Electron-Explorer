/*
 * First of all, dont worry that remote and octicons is not defined
 * That isnt really a problem as far as I know
 * Also for some reason I have to define "window" individually in every code block
 * No idea why I have to do it that way
 */

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


$(function(){

  // These 4 lines set the intial icons for most buttons
  $("#min-btn").html(octicons['dash'].toSVG({ "width": 32, "height": 32}));
  $("#max-btn").html(octicons['chevron-up'].toSVG({ "width": 32, "height": 32}));
  $("#close-btn").html(octicons['x'].toSVG({ "width": 32, "height": 32}));
  $("#back").html(octicons["arrow-left"].toSVG({ "width": 32, "height": 32 }));

  let window = remote.getCurrentWindow();

  window.on("maximize", () => { // When the window is maximized then change the icon to minimize
    $("#max-btn").html(octicons['chevron-down'].toSVG({ "width": 32, "height": 32}));
  });

  window.on("unmaximize", () => { // The same as the last thingie but the opposite
    $("#max-btn").html(octicons['chevron-up'].toSVG({ "width": 32, "height": 32}));
  });

});