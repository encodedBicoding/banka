
const toggle = (e)=>{
    e.style.display === 'block'? e.style.display = 'none' : e.style.display = 'block';
    return e.style.display;
};
function showDashNav(){
    let button = document.getElementById('toggle_nav');
    let nav = document.getElementById('user_nav');
    button.addEventListener('click', (event)=>{
        let span = document.getElementById('xx');
        event.preventDefault();
        toggle(nav) === 'block' ?
        span.className = 'fa fa-times':span.className = 'fa fa-bars';
    })
}
