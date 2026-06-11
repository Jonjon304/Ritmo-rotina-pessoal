(function () {
  var hub = document.getElementById('hub');
  var sidebar = document.getElementById('sidebar');
  var moduleContent = document.getElementById('module-content');
  var btnHome = document.getElementById('btn-home');
  var hubCards = document.querySelectorAll('.hub-card');
  var sidebarBtns = document.querySelectorAll('.sidebar-modules .sidebar-btn');
  var modulePages = document.querySelectorAll('.module-page');
  var tabBtns = document.querySelectorAll('.tab-btn');

  var currentModule = null;
  var isTransitioning = false;
  var transitionTimeout = null;

  function clearTransition() {
    isTransitioning = false;
    if (transitionTimeout) {
      clearTimeout(transitionTimeout);
      transitionTimeout = null;
    }
  }

  function scheduleTransition(fn, ms) {
    transitionTimeout = setTimeout(fn, ms);
    return transitionTimeout;
  }

  function getGreeting() {
    var hour = new Date().getHours();
    if (hour < 12) return 'Bom dia, Jon. &#127749;';
    if (hour < 18) return 'Boa tarde, Jon. &#127769;';
    return 'Boa noite, Jon. &#127769;';
  }

  function updateGreeting() {
    var el = document.querySelector('.greeting-text');
    if (el) el.innerHTML = getGreeting();
  }

  function formatDate() {
    var now = new Date();
    var days = ['Domingo', 'Segunda', 'Ter\u00e7a', 'Quarta', 'Quinta', 'Sexta', 'S\u00e1bado'];
    var months = ['janeiro', 'fevereiro', 'mar\u00e7o', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return days[now.getDay()] + ', ' + now.getDate() + ' de ' + months[now.getMonth()] + ' de ' + now.getFullYear();
  }

  function updateDate() {
    var el = document.querySelector('.greeting-date');
    if (el) el.textContent = formatDate();
  }

  function resetHub() {
    hub.classList.remove('exiting', 'hidden', 'entering', 'greeting-state');
  }

  function showModule(name) {
    if (!name) return;
    if (currentModule === name) return;
    if (isTransitioning) {
      clearTransition();
      resetHub();
      moduleContent.classList.remove('visible');
      sidebar.classList.remove('visible');
      deactivateAllModules();
      currentModule = null;
    }
    isTransitioning = true;

    if (currentModule === null) {
      hubToModule(name);
    } else {
      switchModule(name);
    }
  }

  function hubToModule(name) {
    hub.classList.add('exiting');

    scheduleTransition(function () {
      hub.classList.remove('exiting');
      hub.classList.add('hidden');

      sidebar.classList.add('visible');

      activateModule(name);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          moduleContent.classList.add('visible');
          isTransitioning = false;
          transitionTimeout = null;
        });
      });
    }, 280);
  }

  function moduleToHub() {
    if (isTransitioning) {
      clearTransition();
      moduleContent.classList.remove('visible');
      sidebar.classList.remove('visible');
      deactivateAllModules();
      currentModule = null;
    }
    isTransitioning = true;

    moduleContent.classList.remove('visible');

    scheduleTransition(function () {
      sidebar.classList.remove('visible');
      deactivateAllModules();
      currentModule = null;

      scheduleTransition(function () {
        hub.classList.remove('hidden');
        hub.classList.add('entering');

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            hub.classList.remove('entering');
            hub.classList.add('greeting-state');

            scheduleTransition(function () {
              hub.classList.remove('greeting-state');
              isTransitioning = false;
              transitionTimeout = null;
            }, 400);
          });
        });
      }, 150);
    }, 300);
  }

  function switchModule(name) {
    if (currentModule === name) return;
    deactivateAllModules();
    activateModule(name);
    isTransitioning = false;
    transitionTimeout = null;
  }

  function activateModule(name) {
    currentModule = name;

    modulePages.forEach(function (page) {
      if (page.dataset.module === name) {
        page.classList.add('active');
      }
    });

    sidebarBtns.forEach(function (btn) {
      if (btn.dataset.module === name) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabBtns.forEach(function (btn) {
      if (btn.dataset.tab === name) {
        btn.classList.add('active');
      } else if (btn.dataset.tab !== 'more') {
        btn.classList.remove('active');
      }
    });
  }

  function deactivateAllModules() {
    modulePages.forEach(function (page) {
      page.classList.remove('active');
    });
    sidebarBtns.forEach(function (btn) {
      btn.classList.remove('active');
    });
  }

  function goHome() {
    if (currentModule === null) return;

    tabBtns.forEach(function (btn) {
      btn.classList.remove('active');
    });
    var homeTab = document.querySelector('.tab-btn[data-tab="home"]');
    if (homeTab) homeTab.classList.add('active');

    moduleToHub();
  }

  hubCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var mod = card.dataset.module;
      if (mod) showModule(mod);
    });
  });

  sidebarBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var mod = btn.dataset.module;
      if (mod) showModule(mod);
    });
  });

  if (btnHome) {
    btnHome.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      goHome();
    });
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.dataset.tab;
      if (tab === 'home') {
        goHome();
      } else if (tab === 'more') {
        var modules = ['cronograma', 'notas', 'habitos'];
        var next = modules.find(function (m) { return m !== currentModule; }) || modules[0];
        showModule(next);
      } else {
        showModule(tab);
      }
    });
  });

  document.querySelectorAll('.task-checkbox').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var item = cb.closest('.task-item');
      if (cb.checked) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
    });
  });

  updateGreeting();
  updateDate();
})();
