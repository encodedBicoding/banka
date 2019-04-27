
const toggle = (e) => {
  if (e.style.display === 'block') {
    e.style.display = 'none';
  } else {
    e.style.display = 'block';
  }
  return e.style.display;
};
// elements to trigger clicks of their neighbour elements
const tinyCamera = document.querySelector('#t_c');
const listClick1 = document.querySelector('#list_click1');
const listClick2 = document.querySelector('#list_click2');
const listClick3 = document.querySelector('#list_click3');
const listClick4 = document.querySelector('#list_click4');
const listClick5 = document.querySelector('#list_click5');
// elements to be triggered
const userImg = document.querySelector('#user_img');
const one = document.querySelector('#one');
const two = document.querySelector('#two');
const three = document.querySelector('#three');
const four = document.querySelector('#four');
const five = document.querySelector('#five');
// Function to facilitate clicking of next element
const clickNext = (element, elementToClick) => {
  element.addEventListener('click', () => {
    elementToClick.click();
  });
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
const startApp = () => {
  showDashNav();
  clickNext(tinyCamera, userImg);
  clickNext(listClick1, one);
  clickNext(listClick2, two);
  clickNext(listClick3, three);
  clickNext(listClick4, four);
  clickNext(listClick5, five);
};
startApp();
