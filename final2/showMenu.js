function showMenu(){
    var  menu = document.getElementById("top-nav");
    if  (menu.style.display==="none" || menu.style.display === ''){
        menu.style.display="block";
    } else {
    menu.style.display="none";
        }
    }