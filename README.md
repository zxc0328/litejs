# Litejs
A light weight javascript library. Litejs aims the basic need of dom manipulation, network request, touch event support and so on in front-end development. It will be widely used in all the products of Muxistudio.

##Why Litejs
jQuery and Zeptojs are pretty awesome. But now we are developing websites running in modern broswers, there is basicly no need to use jQuery's heavy dom apis. So we assume you are big fan of querySelector() apis and hope to develop something that have no need of supporting legacy IEs(IE8 and older).   
So Litejs will provide you with an amazing variety of Apis. And we also highly modularize the code so you can combine the modules you like without effort.

##Get started
**with requirejs**  
just require litejs as a dependency.  

```
requirejs(["js/lite"], function (l) {
            var target = document.querySelectorAll(".target");
            l.swipe(target, "swipeTop", function () {
                console.log("swipeTop!!!!");
            })
        });
```
##Api reference  


###Lite-dom(under devlopment)


**addClass(element,className)**  

element: Node  
className: String  

**removeClass(element,className)**  

element: Node  
className: String  

**indexOf(parentNode,childNode)**  
  
*return a node's index in a nodelist*  

parentNode: NodeList  
childNode: Node
***
###Lite-touch(under devlopment)

**addSwipe(elements, event_name, callback, flag)**  
elements:NodeList  
event_name:
swipe,swipeLeft,swipeRight,swipeTop,swipeBottom  
callback(e): Function  
flag : Boolean  

flag : *true to trigger swipe event once fingers stop, false to trigger swipe event whenever fingers moves*   
 
e.detail.deltaX: the distance of the swipe in x axis  
e.detail.deltaY: the distance of the swipe in y axis

**removeSwipe(elements, event_name, callback)**  
elements:NodeList  
event_name:
swipe,swipeLeft,swipeRight,swipeTop,swipeBottom  
callback: Function

***
###Lite-ajax(under devlopment)

**ajax*(settings)**  
settings : obj  

type : String  
url : String   
isAsync : Boolean  
data : String|Obj|Num  
success : Function  
error : Function



##Broswer Capacity
IE9+ and other morden broswers