export function reveal(node) {
  node.classList.add('reveal');
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('in');
        io.disconnect();
      }
    },
    { threshold: 0.12 }
  );
  io.observe(node);
  return { destroy() { io.disconnect(); } };
}
