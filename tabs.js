// @ts-check

main();

async function main() {
  try {
    const tabContent = document.createElement("div");
    tabContent.setAttribute("class", "tab-content");

    const tabsButtonsContainer = document.createElement("div");
    tabsButtonsContainer.setAttribute("class", "tabs-buttons-container");

    // @ts-ignore
    chrome.storage.sync.get("tabs", ({ tabs }) =>
      tabs.forEach((p) => {
        const tabButton = document.createElement("button");
        tabButton.innerHTML = p.tabName;

        tabButton.addEventListener("click", () => {
          let tabButtonClassList = (tabButton.getAttribute("class") || "").split(" ").filter((c) => c !== "");

          if (tabButtonClassList.includes("active")) {
            removeCSSClass("active", tabButton);
            tabContent.innerHTML = "";
            tabButton.innerHTML = p.tabName;
          } else {
            tabContent.innerHTML = "";
            tabContent.appendChild(document.createTextNode(p.tabContent));

            tabsButtonsContainer.querySelectorAll('button[class*="active"]').forEach((button) => {
              button.removeChild(button.querySelector("span"));
              removeCSSClass("active", button);
            });

            const closeIcon = document.createElement("span");
            closeIcon.innerHTML = "&times;";
            tabButton.appendChild(closeIcon);
            tabButton.setAttribute("class", [...tabButtonClassList, "active"].join(" ").trim());
          }
        });

        tabsButtonsContainer.appendChild(tabButton);
      })
    );

    const tabsContainer = document.createElement("div");
    tabsContainer.setAttribute("class", "tabs-container");
    tabsContainer.appendChild(tabsButtonsContainer);
    tabsContainer.appendChild(tabContent);

    const workWrapperElement = await querySelectorAsync("#ghx-rabid > div.ghx-work-wrapper");
    workWrapperElement.parentNode.insertBefore(tabsContainer, workWrapperElement);
  } catch (error) {
    console.error("Jira Board Custom Tabs extension failed:", error);
  }
}

function removeCSSClass(cssClass, element) {
  let elementClassList = (element.getAttribute("class") || "")
    .trim()
    .split(" ")
    .filter((c) => c !== "");

  element.removeAttribute("class");

  const newElementClassList = elementClassList
    .filter((c) => c !== cssClass)
    .join(" ")
    .trim();

  if (newElementClassList && newElementClassList.length > 0) {
    element.setAttribute("class", newElementClassList);
  }
}

function querySelectorAsync(selector, timeout = 100, attempts = 30) {
  return new Promise((resolve, reject) => {
    const intervalId = window.setInterval(() => {
      if (attempts <= 0) {
        window.clearInterval(intervalId);
        reject();
        return;
      }

      const selection = document.querySelector(selector);

      if (selection) {
        window.clearInterval(intervalId);
        resolve(selection);
        return;
      }

      attempts--;
    }, timeout);
  });
}

function querySelectorAllAsync(selector, timeout = 100, attempts = 30) {
  return new Promise((resolve, reject) => {
    const intervalId = window.setInterval(() => {
      if (attempts <= 0) {
        window.clearInterval(intervalId);
        reject();
        return;
      }

      const selection = document.querySelectorAll(selector);

      if (selection) {
        window.clearInterval(intervalId);
        resolve(selection);
        return;
      }

      attempts--;
    }, timeout);
  });
}
