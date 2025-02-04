const Render = ({ condition, children, render }) => {
  if (condition) {
    return children || (render && render());
  }
  return null;
};

Render.defaultProps = {
  condition: null,
  render: null,
  children: null,
};

export default Render;
