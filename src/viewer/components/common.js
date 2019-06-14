export const Common={
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
    ATTRIBUTE_MAP:{
        width: { px:true, y:false },
        height: { px:true, y:true },
        paddingLeft: { px:true, y:false },
        paddingRight: { px:true, y:false },
        paddingTop: { px:true, y:true },
        paddingBottom: { px:true, y:true },
        left: { px:true, y:false },
        top: { px:true, y:true },
        textAlign: {  },
        verticalAlign: {  },
    },
    processSubDataSet(design){
        let result={};
        Common.subdatasets={};
        if(design.subDataset){
            for(let key in design.subDataset){
                if(Common.dataset[key]){
                    result[key]={start:0};
                    Common.subdatasets[key]=Common.dataset[key].length || 0;
                }
            }
        }
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
        if(design.field){
            design.field.forEach((f)=>{
                //let classname=f._attributes['class'];
                if(f.expression){
                    result[f.name]=Common.getNestedVal(data,f.expression);
                }else{
                    result[f.name]=data[f.name]||"";
                }
            });
        }
        let params={};
        if(design.parameter)
            design.parameter.forEach((f)=>{
                params[f.name]=Common.param[f.name]||"";
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
        let attr=data && data.measurement;
        if(attr){
            for(let key in attr){
                let map=Common.ATTRIBUTE_MAP[key];
                if(!map) continue;
                if(map.px){
                    result[key]=Common.val(attr[key].toLowerCase(),map.y)+"px";
                }else{
                    result[key]=attr[key].toLowerCase();
                }
            }
        }
        return result;
    },
    Font2Style(data){
        let result={...data};
        if(result.fontSize) result.fontSize=Common.val(result.fontSize);
        /*let attr=data.attributes;
        if(attr){
            if(attr.fontSize) result.fontSize=Common.val(attr.fontSize);
            if(attr.fontWeight) result.fontWeight=attr.fontWeight;
        }*/
        return result;
    },
    TEXT_ATTR:{
        textElement(data){
            return Common.Font2Style(data);
            /*let result={};
            if(data.font) result={...result,...Common.Font2Style(data.font)};
            if(data._attributes){
                result={...result,...Common.Attr2Style(data)};
            }
            //if(data.paragraph) 
            return result;*/
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
        if(data.textElement) result=Common.TEXT_ATTR.textElement(data.textElement); //result={...result,...Common.Attr2Style(data.textElement), ...Common.TEXT_ATTR.textElement(data.textElement)}
        if(data.measurement) result={...result,...Common.Attr2Style(data)}
        if(data.box){
            for(let key in data.box) if(Common.BOX_ATTR[key]) result={...result,...Common.BOX_ATTR[key](data.box[key])};
        }
        //if()
        return result
    },
    ////////////////
    complete:0
}