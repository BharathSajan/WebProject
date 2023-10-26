const nav = document.querySelector(".navbarNew")
fetch('/navbar.html')
.then(res=>res.text())
.then(data=>{
  nav.innerHTML=data
})