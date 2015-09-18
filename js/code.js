$(document).ready(function(){
  $("#btnSendId").click(function(){
	  // Using Post method to the URL 'PostInfo', data is sent in JSON format
	  // A callback method is launched when the server answer
	  	$.post("PostMe",
    		  {
    		    cmd:"PostInfo",
    		    data:$("#txtToSendId").val()
    		  },
    		  function(data,status){
    		    alert("Post Done received data: " + data + "\nStatus: " + status);
    	});    
  });

  
  // Using Get method to the URL 'PostInfo'
  // A callback method is launched when the server answer
  $("#btnGetId").click(function(){
	  	$.get("PostMe",
  		  function(data,status){
	  		
	  		$("#txtReceivedId").val(data.data);
	  		
  		    alert("Get Done received data: " + data + "\nStatus: " + status);
  	});    
});
});