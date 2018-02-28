console.log('hi');
const socket = io();
socket.emit('join');

////////////////////////////////////////////////////
// Socket messages

socket.on('stress-word', function(data){
    console.log('stress-word', data);
    let t = `<li class="other-stress">${data.data || data}</li>`;
    if( $('.other-stress-block').children().length > 8 ){
       $('.other-stress-block').children().first().remove();
   }
   $('.other-stress-block').append(t);
});

socket.on('stress-encourage', function(data){
    console.log('stress-encourage', data);
    let t = `<li class="other-stress-encourage">${data.data || data}</li>`;
    $('.stress-encourage-block').prepend(t);
    $('.stress-encourage-block').children().slice(5).remove();
});

socket.on('grateful-word', function(data){
    console.log('new grateful-word', data);
    let t = `<li class="other-grateful">${data.data || data}</li>`;
    $('.other-grateful-block').prepend(t);
    $('.other-grateful-block').children().slice(16).remove();
});


////////////////////////////////////////////////////
// Form submits

$('#user-stress-encourage-form').on('submit', function(event){
    event.preventDefault();
    let word;
    if( word = $('#user-stress-encourage').val().trim() ){
       socket.emit('stress-encourage', word );
       console.log(`Emitting stress-encourage ${word}`);
       $('#user-stress-encourage').val('');	
   }
});

$('#user-grateful-word-form').on('submit', function(event){
    event.preventDefault();
    let word;
    if( word = $('#user-grateful-word').val().trim() ){
       console.log(`Emitting grateful-word ${word}`);
       socket.emit('grateful-word', word );
       $('#user-grateful-word').val('');	
   }
});

$('#user-stress-word-form').on('submit', function(event){
    event.preventDefault();
    let word;
    if( word = $('#user-stress-word').val().trim() ){
        socket.emit('stress-word', word );
        console.log(`Emitting stress-word ${word}`);
        $('#user-stress-word').val(''); 
    }
});
