const title = (element, label) => {
  const labelElement = document.createElement(element);
  labelElement.classList.add("label");
  labelElement.textContent = label;

  return labelElement;
};

export default title;
