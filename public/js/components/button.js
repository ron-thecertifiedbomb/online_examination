const button = (title, func) => {
    
  const button = document.createElement("button");
  button.classList.add("counter_button");
  button.textContent = title;

  button.addEventListener("click", func);

  return button;
};

export default button;
