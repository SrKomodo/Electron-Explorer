/*let remote;
let octicons;*/
$("#min-btn").click(function () {
  let window = remote.getCurrentWindow();
  window.minimize();
});

$("#max-btn").click(function () {
  let window = remote.getCurrentWindow();
  if (!window.isMaximized()) {
    window.maximize();
  } else {
    window.unmaximize();
  }
});

$("#close-btn").click(function () {
  let window = remote.getCurrentWindow();
  window.close();
});

$(function(){
  $("#min-btn").html(octicons['dash'].toSVG({ "width": 32, "height": 32}));
  $("#max-btn").html(octicons['triangle-up'].toSVG({ "width": 32, "height": 32}));
  $("#close-btn").html(octicons['x'].toSVG({ "width": 32, "height": 32}));
  $("#back").html(octicons["arrow-left"].toSVG({ "width": 32, "height": 32 }));
  let window = remote.getCurrentWindow();
  window.on("maximize", () => {
    $("#max-btn").html(octicons['triangle-down'].toSVG({ "width": 32, "height": 32}));
  });
  window.on("unmaximize", () => {
    $("#max-btn").html(octicons['triangle-up'].toSVG({ "width": 32, "height": 32}));
  });
});