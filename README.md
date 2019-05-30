<p align="center">
![logo](public/logo.jpg)
</p>
# jaspit
Simple Jasper Report rendering engine

# Usage
```
<div id="report"></div>

<script type="text/javascript" src="jaspit.bundle.min.js"></script>
<script>
Jaspit.init({
	dom_id:"report",
	fetch:true,//if true, the following two parameters will be taken as URL
	jrxml:"/invoice.jrxml",
	json:"/invoice.json",
	param:{logo1:'/logo.jpg'},
	done:function(){
		//uncomment to print from browser
		//print();
	}
});
</script>
```

# Development
Clone this repo, then `npm install`
- Run `npm run dev`
- Then visit [http://localhost:9000](http://localhost:9000/)

## Future plan

- Editor
- Support for most components
- CLI
