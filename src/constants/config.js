export const global = {
  mode: 'Production'
};

if (process.env.NODE_ENV === 'development') {
  global.mode = 'Development';
}
