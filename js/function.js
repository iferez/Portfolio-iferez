const items = document.querySelectorAll('.nav_padre > .list_item');
const layout = document.querySelector('.layout');
const state = {
  navigationItems: {},
  root: layout,
};

for (let navItemIndex = 0; navItemIndex < items.length; ++navItemIndex) {
  const stateItem = {
    element: items[navItemIndex],
    id: navItemIndex,
    isActive: false,
    type: 'DEFAULT',
  } 
  
  const subNav =  items[navItemIndex].querySelector('.nav');
  if (subNav) {
    stateItem.childNavigation = subNav;
    stateItem.type = 'PARENT';
  }
  
  stateItem.onClick = () => {
    const actualOnClick = () => {
      if (state.activeItem === navItemIndex) {
        state.activeItem = false;
        return;
      }
      
      if (state.activeItem) {
        state.activeItem = null;
      } 

      if ('PARENT' === state.navigationItems[navItemIndex].type) {
        state.activeItem = navItemIndex;
        animateShow(state);
      }
    };
    
    if (state.activeItem) {
      return animateHide(state, actualOnClick);
    }
    
    return actualOnClick();
  };
  
  state.navigationItems[navItemIndex] = stateItem;
}

const animateShow = (state) => {
  const animation = anime.timeline();
  
  animation.add({
    begin: () => {
      state.root.classList.add('nav--active');
    },
    complete: () => {
      state.navigationItems[state.activeItem].element.classList.add('list_item--active');
    },
    duration: 450,
    easing: 'easeOutExpo',
    opacity: 1,
    translateX: [
      {delay: 300, value: '20%',},
    ],
    scaleX: [
      {value: 0},
      {value: 1},
    ],
    targets: '.layout_body',
  })
  .add({
    duration: 70,
    opacity: [0, 1],
    targets: state.navigationItems[state.activeItem].childNavigation,
  }).add({
    delay: anime.stagger(70),
    opacity: [0, 1],
    translateY: ['100%', '0'],
    targets: state.navigationItems[state.activeItem].childNavigation.querySelectorAll('.list_item'),
  });
  
  return animation;
};

const animateHide = (state, complete) => {
  const animation = anime.timeline({
    complete: complete,
  });
  
  animation.add({
    duration: 210,
    opacity: [1, 0],
    translateY: [0, '+=50px'],
    targets: state.navigationItems[state.activeItem].childNavigation,
  }).add({
    complete: () => {
      state.root.classList.remove('nav--active');
      state
        .navigationItems[state.activeItem]
        .element
        .classList
        .remove('list_item--active')
      ;
    },
    duration: 250,
    easing: 'easeOutCirc',
    scaleX: [
      {value: 0},
    ],
    translateX: [
      {value: 0},
    ],
    targets: '.layout_body',
  });
  
  return animation;
};

(() => {
  const introAnimation = anime.timeline({
    complete: () => {
      for (let stateItemIndex = 0; stateItemIndex < Object.values(state.navigationItems).length; ++ stateItemIndex) {
        state.navigationItems[stateItemIndex].element.addEventListener(
          'click',
          state.navigationItems[stateItemIndex].onClick
        );
        
        state.navigationItems[stateItemIndex].element.style.transform = '';
      }
    },
  });

  introAnimation.add({
    duration: 350,
    delay: 1000,
    easing: 'easeOutCirc',
    targets: '.layout_navegacion',
    scaleX: [0, 1],
  }).add({
    delay: anime.stagger(75),
    duration: 450,
    easing: 'easeOutCirc',
    opacity: [0, 1],
    translateY: ['100%', '0%'],
    targets: '.nav_padre > .list_item:not(.logo)',
  }).add({
    easing: 'easeOutExpo',
    targets: '.layout_navegacion',
    translateX: [
      {delay: 350, value: (-80) + '%'},
    ],
  }).add({
    duration: 350,
    easing: 'easeOutExpo',
    targets: '.hero-title',
    opacity: [0, 1],
    translateY: ['50px', '0'],
  }).add({
    duration: 400,
    easing: 'easeOutExpo',
    targets: '.hero-text',
    opacity: [0, 1],
    translateY: ['0', '-3rem'],
  }, '-=100');
})();