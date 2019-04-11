
const toggle = (e) => {
  if (e.style.display === 'block') {
    e.style.display = 'none';
  } else {
    e.style.display = 'block';
  }
  return e.style.display;
};
function showDashNav() {
  const button = document.getElementById('toggle_nav');
  const nav = document.getElementById('user_nav');
  button.addEventListener('click', (event) => {
    const span = document.getElementById('xx');
    event.preventDefault();
    toggle(nav) === 'block'
      ? span.className = 'fa fa-times' : span.className = 'fa fa-bars';
  });
}
showDashNav();
