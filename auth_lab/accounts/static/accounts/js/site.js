document.addEventListener('DOMContentLoaded', () => {
  const messageBox = document.querySelector('.messages');
  if (messageBox) window.setTimeout(() => messageBox.classList.add('messages-hidden'), 4500);
  document.querySelectorAll('.side-item').forEach((link) => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.side-item').forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
