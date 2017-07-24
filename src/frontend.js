import './style.sass';
import 'jquery.cookie';
const $ = require('jquery');
let playlists = {};
$('<div id="player"/>').appendTo($('body'));
$('<div id="playlists"/>').appendTo($('body'));

$('#player').html(require('./player.pug')({ file: $.cookie('currentFile') }));
let plr = document.getElementById('plr');

let timeUpdate = () => {
  console.log(plr.currentTime);
  $.cookie('currentTime', JSON.stringify(plr.currentTime));
};

let end = () => {
  let next = $(".file[data-file='" + $.cookie('currentFile') + "']").next();
  next.click();
};

plr.ontimeupdate = timeUpdate;
plr.onended = end;

plr.currentTime = JSON.parse($.cookie('currentTime'));

plr.ontimeupdate = timeUpdate;

const renderPl = () => {
  let tpl = require('./lists.pug');
  $('#playlists').html(tpl({ path: require('path'), playlists: playlists }));

  $('.playlist .file').click(function() {
    let file = $(this).attr('data-file');
    let tpl = require('./player.pug');
    $.cookie('currentFile', file);

    $('#player').html(tpl({ file: file }));
    let plr = document.getElementById('plr');

    plr.ontimeupdate = timeUpdate;
    plr.onended = end;

    plr.play();
  });
};
$.get({
  url: 'playlist.json',
  success: pl => {
    playlists = pl;
    renderPl();
  },
}).fail(() => {
  alert('cannot load playlist.json');
  $('body').html(":-(").addClass("fail")
});
