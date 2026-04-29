import button from "./button.js";
import title from "./title.js";

const counter = () => {

  const container = document.createElement("div");
  container.classList.add("counter_container");
  container.appendChild(title("h1", "Counter"));
    
  const countLabelContainer = document.createElement("div");
  countLabelContainer.classList.add("countLabelContainer");
  container.appendChild(countLabelContainer);
  const countLabel = title("p", "Counter");

  container.appendChild(countLabelContainer);
  countLabelContainer.appendChild(countLabel);

  let count = (countLabel.textContent = 0);

  function increment() {
    count += 1;
    countLabel.textContent = count;
  }

  function decrement() {
    if (count === 0) return;
    count -= 1;
    countLabel.textContent = count;
  }

  container.appendChild(button("Increment", increment));
  container.appendChild(button("Decrement", decrement));

  return container;
};

export default counter;
