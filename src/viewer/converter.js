import {xml2js} from 'xml-js';

const map={
    pageWidth:'width',
    pageHeight:'height',
    leftMargin:'paddingLeft',
    rightMargin:'paddingRight',
    topMargin:'paddingTop',
    bottomMargin:'paddingBottom',
    width:'width',
    height:'height',
    x:'left',
    y:'top',
    textAlignment:'textAlign',
    verticalAlignment:'verticalAlign',
    isPrintWhenDetailOverflows:'whiteSpaceNowrap',
    stretchType:'stretchType',
    direction:'direction',
};
const convert={
    _attributes(obj){
        let result={};
        for(let key in obj){
            if(map[key]) result[map[key]]=obj[key];
        }
        return result;
    },
    property(obj){
        let result={};
        result=obj;
        return result;
    },
    //"import"(obj){},
    //template(obj){},
    //reportFont(obj){},
    style(obj){return obj;},
    subDataset(obj){
        return (Array.isArray(obj)?obj:[obj]).reduce((a,c)=>{
            a[c._attributes.name]={
                expression:c.queryString._cdata,
                uuid:c._attributes.uuid,
                field:c.field?convert.field(c.field):[],
                parameter:c.parameter?convert.parameter(c.parameter):[],
            };
            return a;
        },{});
    },
    scriptlet(obj){return obj;},
    parameter(obj){
        return (Array.isArray(obj)?obj:[obj]).map(f=>{
            return {
                name:f._attributes.name,
                type:f._attributes.class,
                default:f.defaultValueExpression && f.defaultValueExpression._cdata
            }
        });
    },
    queryString(obj){return obj;},
    field(obj){
        return (Array.isArray(obj)?obj:[obj]).map(f=>{
            return {
                name:f._attributes.name,
                type:f._attributes.class,
                expression:f.fieldDescription && f.fieldDescription._cdata
            };
        })
    },
    //sortField(obj){},
    variable(obj){
        return (Array.isArray(obj)?obj:[obj]).map(f=>{
            return {
                name:f._attributes.name,
                type:f._attributes.class,
                expression:f.variableExpression && f.variableExpression._cdata,
                init:f.initialValueExpression && f.initialValueExpression._cdata,
            }
        });
    },
    //filterExpression(obj){},
    //group(obj){}
    
}
function convertTextElement(obj){
    let result={};
    for(let key in obj._attributes)
        if(map[key])
            result[map[key]]=obj._attributes[key];
    if(obj.font){
        if(obj.font._attributes.size) result.fontSize=obj.font._attributes.size;
        if(obj.font._attributes.isBold==="true") result.fontWeight="bold";
        if(obj.font._attributes.isItalic==="true") result.fontStyle="italic";
        if(obj.font._attributes.isUnderline==="true") result.textDecorationLine="underline";
        if(obj.font._attributes.isStrikeThrough==="true")
            if(result.textDecorationLine)
                result.textDecorationLine+=" line-through";
            else
                result.textDecorationLine="line-through";
    }
    //TODO: obj.paragraph
    return result;
}
function convertList(obj){
    let result={
        dataset:obj.datasetRun._attributes.subDataset,
        datasetParameter:[],
        contents:convertBand(obj["jr:listContents"])
    };
    return result;
}
function convertElement(name,obj){
    let result={
        uuid:obj.reportElement && obj.reportElement._attributes.uuid
    };
    switch(name){
        case "componentElement":
            result.measurement=convert._attributes(obj.reportElement._attributes);
            if(obj.reportElement.printWhenExpression)
                result.printWhenExpression=obj.reportElement.printWhenExpression._cdata;
            if(obj["jr:list"]){
                result.elementName="list";
                result.element=convertList(obj["jr:list"]);
            }
            break;
        case "line":case "rectangle":case "image":case "staticText":case "textField":
            result.measurement=convert._attributes(obj.reportElement._attributes);
            if(obj.reportElement.printWhenExpression)
                result.printWhenExpression=obj.reportElement.printWhenExpression._cdata;
            if(obj.textElement)
                result.textElement=convertTextElement(obj.textElement);
            if(obj.text)
                result.text=obj.text._cdata;
            else if(obj.textFieldExpression)
                result.textFieldExpression=obj.textFieldExpression._cdata;
            else if(obj.imageExpression)
                result.imageExpression=obj.imageExpression._cdata;
            else if(obj._attributes){
                for(let key in obj._attributes)
                    if(map[key])
                        result.measurement[map[key]]=obj._attributes[key];
            }
            break;
        case "frame":
            result={...result,...convertBand(obj)};
            break;
        case "switch":
            result.measurement=convert._attributes(obj.reportElement._attributes);
            result.case=(Array.isArray(obj.case)?obj.case:[obj.case]).map(f=>{
                let r={
                    measurement:convert._attributes(f.reportElement._attributes),
                    caseExpression:f.caseExpression._cdata,
                    elements:{}
                };
                delete f.reportElement;
                delete f.caseExpression;
                for(let key in f)
                    r.elements[key]=(Array.isArray(f[key])?f[key]:[f[key]]).map(m=>convertElement(key,m))
                return r;
            })
            break;
        default:
    }
    return result;
}
const BandNames=['background','title','pageHeader','columnHeader','detail','columnFooter','pageFooter','lastPageFooter','summary','noData'];
function convertBand(obj){
    let result={
        measurement:convert._attributes(obj._attributes),
        elements:Object.keys(obj).reduce((a,c)=>{
            if(c!=="_attributes"){
                a[c]=(Array.isArray(obj[c])?obj[c]:[obj[c]]).map(m=>convertElement(c,m));
            }
            return a;
        },{})
    };
    return result;
}
export default function(jrxml){
    let report={
        bands:{}
    };
    let jasper=xml2js(jrxml,{compact: true}).jasperReport
    //console.log('jasper',jasper)
    for(let key in jasper){
        if(convert[key])
            report[key]=convert[key](jasper[key]);
        if(BandNames.includes(key))
            report.bands[key]=convertBand(jasper[key].band)
    }
    report.measurement=report._attributes;
    delete report._attributes;
    return report;
}
