export const Common={
    edit:false,
    design:{},
    data:{},
    dataset:{},
    param:{},
    subdatasets:[],
    RATIO:1,
    YRATIO:1,
    val(data,y){
        let v=Number(data);
        if(isNaN(v)) return data;
        return Math.round(v*(y?Common.YRATIO:Common.RATIO));
    },
    getNestedVal(data,path){
        if(!path) return data;
        let val=data;
        try{
            path.split(".").forEach((f)=>{
                val=val[f];
            });
            return val;
        }catch(e){
            //console.log("Value Error",path,e)
            return "";
        }
    },
    PXMAP:{
        pageWidth: {prop:'width', y:false},
        pageHeight: {prop:'height', y:true},
        leftMargin: {prop:'paddingLeft', y:false},
        rightMargin: {prop:'paddingRight', y:false},
        topMargin: {prop:'paddingTop', y:true},
        bottomMargin: {prop:'paddingBottom', y:true},
        height: {prop:'height', y:true},
        width: {prop:'width', y:false},
        x: {prop:'left', y:false},
        y: {prop:'top', y:true},
    },
    VALMAP:{
        textAlignment:'textAlign',
        verticalAlignment:'verticalAlign'
    },
    processSubDataSet(design){
        let sub=Array.isArray(design.subDataset)?design.subDataset:[design.subDataset];
        Common.subdatasets={};
        let result={};
        sub.forEach(f=>{
            result[f._attributes.name]={start:0};
            Common.subdatasets[f._attributes.name]=Common.dataset[f._attributes.name].length || 0;
        },{});
        return result;
    },
    createSubDataSetFromPrevious(prev,name){
        let result={};
        for(let key in prev) result[key]={start:prev[key].start,end:prev[key].end};
        result[name].start=result[name].end;
        result[name].end=undefined;
        return result;
    },
    isDone(pages){
        let result=true;
        let lastPage=pages[pages.length-1];
        for(let key in lastPage){
            result = result && (lastPage[key].end!==undefined)
        }
        return result;
    },
    compileData(design,data){
        let result={};
        design.field.forEach((f)=>{
            if(f._attributes){
                let name=f._attributes.name;
                //let classname=f._attributes['class'];
                if(f.fieldDescription){
                    result[name]=Common.getNestedVal(data,f.fieldDescription._cdata);
                }else{
                    result[name]=data[name]||"";
                }
            }
        });
        let params={};
        let parameters=Array.isArray(design.parameter)?design.parameter:[design.parameter];
        parameters.forEach((f)=>{
            if(f._attributes){
                params[f._attributes.name]=Common.param[f._attributes.name]||"";
            }
        });
        return {
            F:result,
            P:params,
            V:{
                PAGE_NUMBER:1,
                PAGE_COUNT:1,
                REPORT_COUNT:1,
                COLUMN_NUMBER:1,
                MASTER_TOTAL_PAGES:1,
                MASTER_CURRENT_PAGE:1
            }
        };
    },
    compileExpr(expr){
        let re = /\$([FPV]){([^}]+)?}/g;
        let match;
        /*eslint no-cond-assign: 0*/
        while(match = re.exec(expr)) {
            expr = expr.replace(match[0], "__values."+match[1]+"."+match[2].trim())
        }
        return expr;
    },
    overRiddenData(data,overrides){
        if(!overrides) return data;
        let result={};
        for(let key in data){
            result[key]={};
            for(let key2 in data[key])
                result[key][key2]=data[key][key2];
        }
        for(let key in overrides){
            for(let key2 in overrides[key])
                result[key][key2]=overrides[key][key2];
        }
        return result;
    },
    parseExpr(expr,data,overrides){
        try{
            /*eslint no-new-func: 0*/
            let code=new Function('__values','IF',"return "+ Common.compileExpr(expr));
            try{
                return code(Common.overRiddenData(data,overrides),function(c,tv,fv){ return c?tv:fv });
            }catch(e){
                console.log("Error evaluating expression",expr,e.message);
                return "";
                //throw new Error("Error evaluating expression",expr)
            }
        }catch(e){
            console.log("Syntax Error",e);
            throw new Error("Syntax Error",expr);
        }
    },
    Attr2Style(data){
        let result={};
        let attr=data._attributes;
        if(attr){
            for(let key in Common.PXMAP){
                if(attr[key]){
                    let map=Common.PXMAP[key];
                    result[map.prop]=Common.val(attr[key].toLowerCase(),map.y)+"px";
                }
            }
            for(let key in Common.VALMAP){
                if(attr[key]){
                    result[Common.VALMAP[key]]=attr[key].toLowerCase();
                }
            }
        }
        return result;
    },
    Font2Style(data){
        let result={};
        let attr=data._attributes;
        if(attr){
            if(attr.size) result.fontSize=Common.val(attr.size);
            if(attr.isBold==="true") result.fontWeight="bold";
    
        }
        return result;
    },
    TEXT_ATTR:{
        textElement(data){
            let result={};
            if(data.font) result={...result,...Common.Font2Style(data.font)};
            if(data._attributes){
                result={...result,...Common.Attr2Style(data)};
            }
            //if(data.paragraph) 
            return result;
        }
    },
    BOX_ATTR:{
        __DEFAULT__(side){
            return {
                ['border'+side+'Width']:"1px",
                ['border'+side+'Style']:"solid"
            }
        },
        __GENERIC__Pen(side,data){
            let result={};
            let attr=data._attributes;
            side=side[0].toUpperCase()+side.substr(1);
            result=Common.BOX_ATTR.__DEFAULT__(side);
            for(let key in attr){
                switch(key){
                    case "lineWidth": result['border'+side+'Width']=Math.round(Number(attr.lineWidth))+"px"; break;
                    case "lineStyle": result['border'+side+'Style']=attr.lineStyle.toLowerCase(); break;
                    case "lineColor": result['border'+side+'Color']=attr.lineColor.toLowerCase(); break;
                    default: break;
                }
            }
            return result;
        },
        topPen(data){return Common.BOX_ATTR.__GENERIC__Pen('top',data)},
        leftPen(data){return Common.BOX_ATTR.__GENERIC__Pen('left',data)},
        rightPen(data){return Common.BOX_ATTR.__GENERIC__Pen('right',data)},
        bottomPen(data){return Common.BOX_ATTR.__GENERIC__Pen('bottom',data)},
    },
    putTextAttr(data){
        let result={};
        if(data.textElement) result={...result,...Common.Attr2Style(data.textElement), ...Common.TEXT_ATTR.textElement(data.textElement)}
        if(data.reportElement) result={...result,...Common.Attr2Style(data.reportElement)}
        if(data.box){
            for(let key in data.box) if(Common.BOX_ATTR[key]) result={...result,...Common.BOX_ATTR[key](data.box[key])};
        }
        //if()
        return result
    }
}