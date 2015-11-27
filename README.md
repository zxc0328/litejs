![# Litejs ](http://7oxh2b.com1.z0.glb.clouddn.com/litejs-logo2.png)


A light weight javascript library. Litejs aims the basic need of dom manipulation, evnet system, network request, touch event support and so on in front-end development. It will be widely used in all the products of Muxistudio.

##Why Litejs
jQuery and Zeptojs are pretty awesome. But now we are developing websites running in modern broswers, there is basicly no need to use jQuery's heavy dom apis. So we assume you are big fan of querySelector() apis and hope to develop something that have no need of supporting legacy IEs(IE7 and older).   
So Litejs will provide you with an amazing variety of Apis. And we also highly modularize the code so you can combine the modules you like together without effort.

##Get started
**Install litejs with bower**   

```
bower install litejs --save-dev  
```   

**Using litejs with requirejs**  
 
just require litejs as a dependency.  

```
requirejs(["bower_components/litejs/lite"], function (l) {
            var target = l(".target");
            l.swipe(target, "swipeTop", function () {
                console.log("swipeTop!!!!");
            })
});
```
##Api reference  

###Selector in Litejs
*description:*  

Select the nodes according to the given CSS sytle selectors 

*Syntax:*

`var target = l(".target");`

*Return:*  

`[Object lite_nodeList]`

****
###Dom manipulation

####**addClass**  
*description:*  

Add the given classname to the node's class attribute.

*Syntax:*

`l.addClass([Array ClassName]);`


****
####**removeClass**  
*description:*  

Remove the given classname to the node's class attribute.

*Syntax:*

`l.removeClass([Array ClassName]);`

****
####**indexOf**  
  
*description:*  

Return a node's index in a nodelist.

*Syntax:*

`l.indexOf([NodeList ParentNode]);`

*Return:*  

`[Number index]`

***
###Swipe Event
**addSwipe**  
  
*Syntax:*

`l.addSwipe([String event_name], [Function callback], [Boolean flag])`


*Detail*  

flag : *true to trigger swipe event once fingers stop, false to trigger swipe event whenever fingers moves*   

event_name: *swipe,swipeLeft,swipeRight,swipeTop,swipeBottom* 

e.detail.deltaX: *the distance of the swipe in x axis*  
e.detail.deltaY: *the distance of the swipe in y axis*

***
**removeSwipe**

*Syntax:*

`l.removeSwipe([String event_name], [Function callback])`

*Detail*  

event_name: *swipe,swipeLeft,swipeRight,swipeTop,swipeBottom* 


***
###Ajax

####**ajax** 

*Syntax:* 

```
l.ajax([Object settings])
```

*Paramaters:* 

```
[Object settings]
 
[String type] 
[String url]   
[Boolean isAsync]     
[String|Obj|Num data]  
[Function success]  
[Function error]  
[Object headers]
```

*Detail*  

type : the type of the request, eg:"GET","POST".   
isAsync : optional, default value true.       
headers : the key-value object of the header settings.


*Basic Usage*


```
require(["../lite"], function (l) {
            l.ajax({
                url: "data.txt",
                type: "GET",
                isAsync : "false",
                success: function (data) {
                    var target = document.querySelector(".target");
                    target.innerHTML = data;
                },
                error : function(status){
                		console.log("error: " + status);
                }
                headers : {
                	"Authorization" :"Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=="
                }
            })
        })
```



##Broswer Capacity
IE8+ and other morden broswers

##Release 

###v1.0
--2015.11
###v0.2 
--2015.10.14

##License

MIT
