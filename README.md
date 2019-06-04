![logo](public/logo.jpg)
# jaspit
Simple report rendering library based on Jasper Report

# Usage
```html
<div id="report"></div>

<script type="text/javascript" src="jaspit-viewer.bundle.min.js"></script>
<script>
Jaspit.render({
	dom_id: "report",
	fetch: "both",//expected values are: ["both", "design", "data"], and anything else will be treated as "none"
	design: "/invoice.jrxml",//make sure the java expressions are changed to javascript
	data: "/invoice.json",
	param:{
		logo1: '/logo.jpg'
	},
	done:function(){//will be called when render is complete
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

- Font and Global Style Support
- Editor
- Support for most components
- CLI
