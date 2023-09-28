const start = document.querySelector("[data-start]");
const windows = [...document.querySelectorAll("[data-window]")];
const triggers = [...document.querySelectorAll("[data-window-trigger]")];
const errors = [...document.querySelectorAll("[data-error-trigger]")];

start.addEventListener("click", e => {
  if (start.checked) {
    start.setAttribute("checked", "");
  } else {
    start.removeAttribute("checked");
  }
  triggers.forEach(trigger => {
    trigger.classList.remove("active");
  });
});

const desktop = document.querySelector("#icons");
desktop.addEventListener("click", e => {
  triggers.forEach(trigger => {
    trigger.classList.remove("active");
  });
  start.checked = false;
  start.removeAttribute("checked");
});

const taskbar = document.querySelector("#window-taskbar");
const close = taskbar.querySelector("[data-close]");
close.removeAttribute("disabled");
const applies = [...document.querySelectorAll("[data-apply]")];
const global = [...document.querySelectorAll("[data-global-option]")];
const options = [...document.querySelectorAll("[data-option]")];
const outline = document.querySelector("#start-menu-outline");
options.forEach(option => {
  option.addEventListener("click", e => {
    applies[1].removeAttribute("disabled");
  });
});
applies.forEach(apply => {
  apply.addEventListener("click", e => {
    options.forEach((option, index) => {
      if (option.checked) {
        global[index].checked = true;
        global[index].setAttribute("checked", "");
      } else {
        global[index].checked = false;
        global[index].removeAttribute("checked");
      }
    });
  });
});

const bars = [...document.querySelectorAll(".menu-status-bar")];
bars.forEach(bar => {
  bar.addEventListener("click", e => {
    if (bar.checked) {
      bar.setAttribute("checked", "");
    } else {
      bar.removeAttribute("checked");
    }
  });
});

const welcome = document.querySelector("#welcome");
const welcomeInside = document.querySelector("#window-welcome .window-inside");
errors.forEach(error => {
  let name = error.getAttribute("data-name");
  let alert = document.querySelector(`#alert-${name}`);
  let retry = alert.querySelector("[data-retry]");
  error.addEventListener("click", e => {
    if (error.checked) {
      error.setAttribute("checked", "");
      if (retry) retry.focus();
      if (name == "blue-screen") {
        document.addEventListener("keydown", e => {
          if (e.key === "Enter" && error.checked) {
            error.checked = false;
            error.removeAttribute("checked");
          } else if (e.key === "Control") {
            error.checked = false;
            error.removeAttribute("checked");
            console.log(welcome.classList);
            start.checked = false;
            start.removeAttribute("checked");
            triggers.forEach(trigger => {
              trigger.checked = false;
              trigger.classList.remove("active");
            });
            welcome.checked = true;
            welcome.setAttribute("checked", "");
            welcome.classList.add("active");
            welcomeInside.removeAttribute("style");
          } else {
            error.checked = false;
            error.removeAttribute("checked");
          }
        });
      }
    } else {
      error.removeAttribute("checked");
    }
  });
});

let order = 0;
let layer = 10;
triggers.forEach(trigger => {
  let name = trigger.getAttribute("data-name");
  let window = document.querySelector(`#window-${name}`);
  let inside = window.querySelector(".window-inside");
  let tab = document.querySelector(`.tab-${name}`);
  let menu = window.querySelector("[data-menu]");
  let max = document.querySelector(`#${name}-maximize`);
  let drag;
  window.addEventListener("click", e => {
    start.checked = false;
    start.removeAttribute("checked");
    if (!trigger.classList.contains("active")) {
      triggers.forEach(trigger => {
        trigger.classList.remove("active");
      });
      trigger.classList.add("active");
    }
  });
  trigger.addEventListener("click", e => {
    start.checked = false;
    start.removeAttribute("checked");
    if (trigger.checked) {
      trigger.setAttribute("checked", "");
      triggers.forEach(trigger => {
        trigger.classList.remove("active");
      });
      trigger.classList.add("active");
      order = order + 1;
      if (tab) tab.style.order = order;
      layer = layer + 1;
      window.style.zIndex = layer;
      window.setAttribute("data-index", layer);
      drag = new Draggabilly(window, {
        handle: ".window-nav",
        containment: true });

      if (window == taskbar) close.focus();
    } else {
      trigger.classList.remove("active");
      trigger.removeAttribute("checked");
      inside.removeAttribute("style");
      window.removeAttribute("data-index");
      if (drag != undefined) drag.destroy();
      window.removeAttribute("style");
      if (menu) {
        menu.checked = false;
        menu.removeAttribute("checked");
      }
      if (max) max.checked = false;
    }
  });
});

const minimizers = [...document.querySelectorAll("[data-minimize]")];
minimizers.forEach((minimizer, index) => {
  let name = minimizer.getAttribute("data-name");
  let trigger = document.querySelector(`#${name}`);
  let tab = document.querySelector(`.tab-${name} .activate`);
  let window = document.querySelector(`#window-${name}`);
  tab.addEventListener("click", e => {
    triggers.forEach(trigger => {
      trigger.classList.remove("active");
    });
    trigger.classList.add("active");
    let layers = [...document.querySelectorAll("[data-index]")];
    if (layers.length > 1 && !minimizer.checked) {
      let values = [];
      layers.forEach(layer => {
        values.push(layer.getAttribute("data-index"));
      });
      let highest = Math.max(...values) + 1;
      window.style.zIndex = highest;
      window.setAttribute("data-index", highest);
    }
  });
  minimizer.addEventListener("click", e => {
    if (minimizer.checked) {
      minimizer.setAttribute("checked", "");
      trigger.classList.remove("active");
    } else {
      minimizer.removeAttribute("checked");
      triggers.forEach(trigger => {
        trigger.classList.remove("active");
      });
      trigger.classList.add("active");
    }
  });
});

windows.forEach(window => {
  let menu = window.querySelector("[data-menu]");
  let toggle = window.querySelector("[data-toggle]");
  let labels = [...window.querySelectorAll("[data-label]")];
  if (toggle) {
    toggle.addEventListener("pointerdown", e => {
      menu.checked = true;
      menu.setAttribute("checked", "");
    });
  }
  if (labels.length > 0) {
    labels.forEach(label => {
      label.addEventListener("click", e => {
        menu.checked = false;
        menu.removeAttribute("checked");
      });
    });
  }
});

const time = document.querySelector(".clock");
const updateTime = () => {
  let date = luxon.DateTime.fromJSDate(new Date()).toLocaleString(luxon.DateTime.TIME_SIMPLE);
  time.innerHTML = date;
};
updateTime();
setInterval(() => updateTime(), 1000);
//# sourceURL=pen.js