


var DragDrop = {

// ondragover :: EventFun -> JQuery -> IO JQuery
	ondragover: function(jq,f)  { jq.addEventListener("dragover", function(e) { DragDrop.prev(e,f); }); },

// ondragleave :: EventFun -> JQuery -> IO JQuery
	ondragleave: function(jq,f) { jq.addEventListener("dragleave", function(e) { 
			DragDrop.prev(e,f); 
		}); 
	},

	ondrop: function(jq,f) { jq.addEventListener("drop", function(e) { 
			DragDrop.prev(e,f); 
		}); 
	},

	prev: function(e,f) { e.stopPropagation(); e.preventDefault(); f(e); return false; },

	getFiles: function(e) { 
		return e.dataTransfer.files; 
	}

}
