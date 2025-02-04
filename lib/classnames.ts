const classnames = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(' ');
export default classnames;
