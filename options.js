// @ts-check

// @ts-ignore
chrome.storage.sync.get("tabs", ({ tabs }) => {
  if (tabs && tabs.length > 0) {
    tabs.forEach((p) => createTabForm(p.tabName, p.tabContent));
  }
});

const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", () => {
  saveButton.innerHTML = "Saved";
  saveButton.setAttribute("disabled", null);

  const tabs = Array.from(document.querySelectorAll("#tabsForms > div")).map((tabFormElement) => {
    return {
      // @ts-ignore
      tabName: tabFormElement.querySelector("div:first-child > input").value,
      // @ts-ignore
      tabContent: tabFormElement.querySelector("div:nth-child(2) > textarea").value,
    };
  });

  // @ts-ignore
  chrome.storage.sync.set({ tabs: tabs }, () => console.log("datos guardados"));
});

document.getElementById("addButton").addEventListener("click", () => {
  createTabForm();
});

function createTabForm(tabName, tabContent) {
  const tabNameInput = document.createElement("input");
  tabNameInput.setAttribute("type", "text");
  tabNameInput.setAttribute("placeholder", "Tab name");
  if (tabName) {
    tabNameInput.value = tabName;
  }
  tabNameInput.addEventListener("keyup", () => enableSaveButton());

  const deleteButton = document.createElement("button");
  deleteButton.appendChild(document.createTextNode("Delete"));

  const moveUpButton = document.createElement("button");
  moveUpButton.appendChild(document.createTextNode("Move up ↑"));

  const moveDownButton = document.createElement("button");
  moveDownButton.appendChild(document.createTextNode("Move down ↓"));

  const tabFormHeader = document.createElement("div");
  tabFormHeader.appendChild(tabNameInput);
  tabFormHeader.appendChild(deleteButton);
  tabFormHeader.appendChild(moveUpButton);
  tabFormHeader.appendChild(moveDownButton);

  const tabContentTextarea = document.createElement("textarea");
  tabContentTextarea.setAttribute("placeholder", "Tab contents...");
  if (tabContent) {
    tabContentTextarea.value = tabContent;
  }
  tabContentTextarea.addEventListener("keyup", () => enableSaveButton());
  const tabFormBody = document.createElement("div");
  tabFormBody.appendChild(tabContentTextarea);

  const tabForm = document.createElement("div");
  tabForm.appendChild(tabFormHeader);
  tabForm.appendChild(tabFormBody);

  moveUpButton.addEventListener("click", () => {
    const previousElementSibling = tabForm.previousElementSibling;
    if (previousElementSibling) {
      previousElementSibling.parentNode.insertBefore(
        tabForm.parentNode.removeChild(tabForm),
        previousElementSibling
      );
      enableSaveButton();
    }
  });

  moveDownButton.addEventListener("click", () => {
    const nextElementSibling = tabForm.nextElementSibling;
    if (nextElementSibling) {
      nextElementSibling.parentNode.insertBefore(
        nextElementSibling.parentNode.removeChild(nextElementSibling),
        tabForm
      );
      enableSaveButton();
    }
  });

  const tabsFormsContainer = document.getElementById("tabsForms");
  tabsFormsContainer.appendChild(tabForm);

  deleteButton.addEventListener("click", () => {
    tabsFormsContainer.removeChild(tabForm);
    enableSaveButton();
  });
}

function enableSaveButton() {
  const saveButton = document.getElementById("saveButton");
  saveButton.innerHTML = "Save";
  saveButton.removeAttribute("disabled");
}
